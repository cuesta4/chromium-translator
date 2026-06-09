// Shared translation worker helpers. Loaded only by the extension service worker.
var GOOGLE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single';
var DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';

var MAX_GOOGLE_CHUNK = 1800;
var MAX_DEEPSEEK_BATCH = 5200;
var MAX_DEEPSEEK_ITEMS = 20;
var GOOGLE_TIMEOUT_MS = 17000;
var DEEPSEEK_TIMEOUT_MS = 25000;
var CACHE_PREFIX = 'ct:v3:';
var CACHE_META_KEY = 'ct:cacheMeta:v3';
var CACHE_MAX_ENTRIES = 1400;
var CACHE_TRIM_TO = 1000;
var CACHE_EMERGENCY_TRIM_TO = 650;
var CACHE_MAX_VALUE_CHARS = 12000;
var CACHE_TOUCH_FLUSH_MS = 2500;
var LEGACY_CACHE_PREFIXES = ['ct:v2:'];
var LEGACY_CACHE_META_KEYS = ['ct:cacheMeta:v2'];

function createBroker(options) {
  return {
    queue: [],
    active: 0,
    concurrency: options.concurrency,
    minConcurrency: options.minConcurrency,
    maxConcurrency: options.maxConcurrency,
    gapMs: options.gapMs,
    adaptive: options.adaptive !== false,
    nextStartAt: 0,
    cooldownUntil: 0,
    consecutiveErrors: 0,
    startGate: Promise.resolve()
  };
}

var googleBroker = createBroker({ concurrency: 4, minConcurrency: 2, maxConcurrency: 6, gapMs: 140, adaptive: true });
var deepSeekBroker = createBroker({ concurrency: 1, minConcurrency: 1, maxConcurrency: 2, gapMs: 280, adaptive: false });
var cacheMutationChain = Promise.resolve();
var pendingCacheTouches = {};
var cacheTouchTimer = null;

function sleep(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, Math.max(0, ms)); });
}

function jitter(ms) {
  return Math.round(ms * (0.75 + Math.random() * 0.5));
}

async function fetchWithTimeout(url, options, timeoutMs) {
  var controller = new AbortController();
  var timer = setTimeout(function () { controller.abort(); }, timeoutMs);
  try {
    options = options || {};
    options.signal = controller.signal;
    return await fetch(url, options);
  } finally {
    clearTimeout(timer);
  }
}

function wellFormedText(value) {
  var text = String(value);
  if (typeof text.toWellFormed === 'function') return text.toWellFormed();
  return Array.from(text).map(function (char) {
    var code = char.charCodeAt(0);
    return char.length === 1 && code >= 0xD800 && code <= 0xDFFF ? '\uFFFD' : char;
  }).join('');
}

function safeEncodeURIComponent(value) {
  return encodeURIComponent(wellFormedText(value));
}

function splitIntoChunks(text, maxLen) {
  text = String(text);
  if (text.length <= maxLen) return [text];
  var chunks = [];
  var remaining = text;
  while (remaining.length > maxLen) {
    var slice = remaining.slice(0, maxLen + 1);
    var minPreferred = Math.floor(maxLen * 0.55);
    var minWhitespace = Math.floor(maxLen * 0.35);
    var splitAt = -1;
    var i;

    for (i = Math.min(maxLen, slice.length); i >= minPreferred; i--) {
      var previous = slice.charAt(i - 1);
      var beforePrevious = slice.charAt(i - 2);
      if (previous === '\n' || (/[\s]/.test(previous) && /[.!?;:,]/.test(beforePrevious))) {
        splitAt = i;
        break;
      }
    }
    if (splitAt < 0) {
      for (i = Math.min(maxLen, slice.length); i >= minWhitespace; i--) {
        if (/\s/.test(slice.charAt(i - 1))) {
          splitAt = i;
          break;
        }
      }
    }
    if (splitAt < 1) splitAt = maxLen;
    if (splitAt > 0 && splitAt < remaining.length) {
      var leftCode = remaining.charCodeAt(splitAt - 1);
      var rightCode = remaining.charCodeAt(splitAt);
      if (leftCode >= 0xD800 && leftCode <= 0xDBFF && rightCode >= 0xDC00 && rightCode <= 0xDFFF) splitAt--;
    }
    if (splitAt < 1) splitAt = Math.min(maxLen, remaining.length);
    chunks.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt);
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

function splitIntoGoogleChunks(text) {
  var initial = splitIntoChunks(text, MAX_GOOGLE_CHUNK);
  var safe = [];
  for (var i = 0; i < initial.length; i++) {
    splitEncodedChunk(initial[i], safe);
  }
  return safe;
}

function splitEncodedChunk(text, output) {
  if (safeEncodeURIComponent(text).length <= 6000 || text.length <= 1) {
    output.push(text);
    return;
  }
  var halves = splitIntoChunks(text, Math.max(1, Math.floor(text.length / 2)));
  if (halves.length < 2) halves = [text.slice(0, Math.ceil(text.length / 2)), text.slice(Math.ceil(text.length / 2))];
  for (var i = 0; i < halves.length; i++) splitEncodedChunk(halves[i], output);
}

function joinTranslatedChunks(sourceChunks, translatedChunks) {
  var output = '';
  for (var i = 0; i < translatedChunks.length; i++) {
    var value = String(translatedChunks[i] || '').trim();
    if (!value) return '';
    if (i > 0) {
      var previousSource = sourceChunks[i - 1] || '';
      var currentSource = sourceChunks[i] || '';
      var needsSpace = /\s$/.test(previousSource) || /^\s/.test(currentSource);
      if (needsSpace && output && !/\s$/.test(output) && !/^\s/.test(value)) output += ' ';
    }
    output += value;
  }
  return output.trim();
}

function fnv1aHash(str) {
  var h = 0x811c9dc5;
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0).toString(36);
}

function djb2Hash(str) {
  var h = 5381;
  for (var i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (h >>> 0).toString(36);
}

function sourceFingerprint(text, targetLang, service, model) {
  var source = [service || 'google', model || '', targetLang || '', text].join('\u0001');
  return fnv1aHash(source) + ':' + djb2Hash(source) + ':' + source.length;
}

function cacheKey(text, targetLang, service, model) {
  return CACHE_PREFIX + sourceFingerprint(text, targetLang, service, model);
}

async function cleanupLegacyCache() {
  try {
    var all = await chrome.storage.local.get(null);
    var remove = [];
    Object.keys(all).forEach(function (key) {
      if (LEGACY_CACHE_META_KEYS.indexOf(key) >= 0 || LEGACY_CACHE_PREFIXES.some(function (prefix) { return key.indexOf(prefix) === 0; })) remove.push(key);
    });
    if (remove.length > 0) {
      await chrome.storage.local.remove(remove);
      console.log('[TR] Cache legado removido: ' + remove.length + ' entradas');
    }
  } catch (err) {
    console.warn('[TR] Falha ao remover cache legado:', err.message);
  }
}

async function getCacheMeta() {
  var data = await chrome.storage.local.get(CACHE_META_KEY);
  return data[CACHE_META_KEY] || {};
}

function queueCacheTouch(key) {
  pendingCacheTouches[key] = Date.now();
  if (cacheTouchTimer) return;
  cacheTouchTimer = setTimeout(function () {
    cacheTouchTimer = null;
    flushCacheTouches().catch(function (err) { console.warn('[TR] Falha ao atualizar LRU:', err.message); });
  }, CACHE_TOUCH_FLUSH_MS);
}

function consumeCacheTouches(meta) {
  var touches = pendingCacheTouches;
  pendingCacheTouches = {};
  Object.keys(touches).forEach(function (key) {
    if (meta[key]) meta[key].lastUsed = touches[key];
  });
}

function withCacheMutation(task) {
  var next = cacheMutationChain.then(task, task);
  cacheMutationChain = next.catch(function () {});
  return next;
}

async function flushCacheTouches() {
  var keys = Object.keys(pendingCacheTouches);
  if (keys.length === 0) return;
  await withCacheMutation(async function () {
    var meta = await getCacheMeta();
    consumeCacheTouches(meta);
    await chrome.storage.local.set({ [CACHE_META_KEY]: meta });
  });
}

async function getCachedBatch(texts, targetLang, service, model) {
  var keys = [];
  var keyToIndices = {};
  for (var i = 0; i < texts.length; i++) {
    var k = cacheKey(texts[i], targetLang, service, model);
    keys.push(k);
    if (!keyToIndices[k]) keyToIndices[k] = [];
    keyToIndices[k].push(i);
  }
  var stored = await chrome.storage.local.get(keys);
  var cached = {};
  Object.keys(stored).forEach(function (key) {
    var record = stored[key];
    var indices = keyToIndices[key];
    if (!indices || !record || typeof record !== 'object' || typeof record.value !== 'string') return;
    for (var j = 0; j < indices.length; j++) cached[indices[j]] = record.value;
    queueCacheTouch(key);
  });
  return cached;
}

async function setCacheBatch(texts, targetLang, results, service, model) {
  await withCacheMutation(async function () {
    var batch = {};
    var meta = await getCacheMeta();
    consumeCacheTouches(meta);
    var now = Date.now();
    for (var i = 0; i < texts.length; i++) {
      var value = results[i];
      if (typeof value !== 'string' || !value.trim()) continue;
      if (value.length > CACHE_MAX_VALUE_CHARS) continue;
      var k = cacheKey(texts[i], targetLang, service, model);
      batch[k] = { value: value, savedAt: now };
      meta[k] = { lastUsed: now, size: value.length };
    }
    if (Object.keys(batch).length === 0) return;
    await trimCacheIfNeeded(meta, CACHE_TRIM_TO, false, Object.keys(batch));
    batch[CACHE_META_KEY] = meta;
    try {
      await chrome.storage.local.set(batch);
    } catch (err) {
      console.warn('[TR] Cache excedeu armazenamento; aplicando poda emergencial:', err.message);
      await trimCacheIfNeeded(meta, CACHE_EMERGENCY_TRIM_TO, true, Object.keys(batch).filter(function (key) { return key !== CACHE_META_KEY; }));
      batch[CACHE_META_KEY] = meta;
      await chrome.storage.local.set(batch);
    }
  });
}

async function trimCacheIfNeeded(meta, trimTo, force, protectedKeys) {
  var keys = Object.keys(meta);
  if (!force && keys.length <= CACHE_MAX_ENTRIES) return;
  var protectedSet = new Set(protectedKeys || []);
  keys.sort(function (a, b) { return (meta[a].lastUsed || 0) - (meta[b].lastUsed || 0); });
  var needed = Math.max(0, keys.length - trimTo);
  var remove = [];
  for (var i = 0; i < keys.length && remove.length < needed; i++) {
    if (!protectedSet.has(keys[i])) remove.push(keys[i]);
  }
  if (remove.length === 0) return;
  for (var r = 0; r < remove.length; r++) delete meta[remove[r]];
  await chrome.storage.local.remove(remove);
}

function enqueueBrokerRequest(broker, task) {
  return new Promise(function (resolve, reject) {
    broker.queue.push({ task: task, resolve: resolve, reject: reject });
    pumpBroker(broker);
  });
}

function pumpBroker(broker) {
  while (broker.active < broker.concurrency && broker.queue.length > 0) {
    var item = broker.queue.shift();
    broker.active++;
    runBrokerItem(broker, item).finally(function () {
      broker.active--;
      pumpBroker(broker);
    });
  }
}

function reserveBrokerStart(broker) {
  var gate = broker.startGate.then(async function () {
    while (true) {
      var now = Date.now();
      var wait = Math.max(0, broker.cooldownUntil - now, broker.nextStartAt - now);
      if (wait <= 0) break;
      await sleep(wait);
    }
    broker.nextStartAt = Date.now() + broker.gapMs;
  });
  broker.startGate = gate.catch(function () {});
  return gate;
}

async function runBrokerItem(broker, item) {
  try {
    await reserveBrokerStart(broker);
    var result = await item.task();
    broker.consecutiveErrors = 0;
    if (broker.adaptive && broker.concurrency < broker.maxConcurrency) broker.concurrency++;
    item.resolve(result);
  } catch (err) {
    broker.consecutiveErrors++;
    if (broker.adaptive) broker.concurrency = Math.max(broker.minConcurrency, Math.floor(broker.concurrency / 2));
    if (err && (err.status === 429 || err.status === 403 || err.status === 503)) {
      var retryAfter = Number(err.retryAfterMs || 0);
      var backoff = retryAfter || jitter(Math.min(20000, 800 * Math.pow(2, broker.consecutiveErrors)));
      broker.cooldownUntil = Math.max(broker.cooldownUntil, Date.now() + backoff);
    }
    item.reject(err);
  }
}

function isRetryableError(err) {
  if (!err) return true;
  if (err.name === 'AbortError') return true;
  if (!err.status) return true;
  return err.status === 403 || err.status === 408 || err.status === 429 || err.status >= 500;
}

async function translateGoogleChunk(text, targetLang, retries) {
  retries = retries === undefined ? 2 : retries;
  var lastErr = null;
  for (var attempt = 0; attempt <= retries; attempt++) {
    try {
      return await enqueueBrokerRequest(googleBroker, async function () {
        var url = GOOGLE_ENDPOINT + '?client=gtx&sl=auto&tl=' + encodeURIComponent(targetLang) + '&dt=t&q=' + safeEncodeURIComponent(text);
        var response = await fetchWithTimeout(url, {}, GOOGLE_TIMEOUT_MS);
        if (!response.ok) {
          var err = new Error('Google HTTP ' + response.status);
          err.status = response.status;
          var retryAfter = response.headers && response.headers.get('Retry-After');
          if (retryAfter) err.retryAfterMs = parseRetryAfter(retryAfter);
          throw err;
        }
        var data = await response.json();
        var translation = parseGoogleResponse(data);
        if (!translation) throw new Error('Google: resposta vazia');
        return translation;
      });
    } catch (err) {
      lastErr = err;
      if (attempt >= retries || !isRetryableError(err)) break;
      await sleep(jitter(400 * Math.pow(2, attempt)));
    }
  }
  throw lastErr || new Error('Google: falha desconhecida');
}

function parseRetryAfter(value) {
  var n = Number(value);
  if (!Number.isNaN(n)) return n * 1000;
  var date = Date.parse(value);
  if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
  return 0;
}

function parseGoogleResponse(data) {
  if (!Array.isArray(data) || !Array.isArray(data[0])) return '';
  var translation = '';
  for (var i = 0; i < data[0].length; i++) {
    if (Array.isArray(data[0][i]) && typeof data[0][i][0] === 'string') translation += data[0][i][0];
  }
  return translation.trim();
}

async function translateGoogle(texts, targetLang) {
  var t0 = performance.now();
  var results = new Array(texts.length);
  var cached = await getCachedBatch(texts, targetLang, 'google', 'gtx');
  var toTranslate = [];

  for (var i = 0; i < texts.length; i++) {
    if (cached[i] !== undefined) results[i] = cached[i];
    else toTranslate.push({ index: i, text: texts[i] });
  }
  if (toTranslate.length === 0) return results;

  var chunkJobs = [];
  var sourceChunks = {};
  for (var t = 0; t < toTranslate.length; t++) {
    var item = toTranslate[t];
    var chunks = splitIntoGoogleChunks(item.text);
    sourceChunks[item.index] = chunks;
    for (var c = 0; c < chunks.length; c++) chunkJobs.push({ index: item.index, chunkIndex: c, text: chunks[c] });
  }

  var translations = {};
  var failures = 0;
  await Promise.all(chunkJobs.map(async function (job) {
    try {
      var value = await translateGoogleChunk(job.text, targetLang);
      if (!translations[job.index]) translations[job.index] = [];
      translations[job.index][job.chunkIndex] = value;
    } catch (err) {
      failures++;
      console.warn('[TR] Google chunk falhou:', err.message);
    }
  }));

  Object.keys(sourceChunks).forEach(function (idx) {
    var sources = sourceChunks[idx];
    var translated = translations[idx];
    if (!translated || translated.length !== sources.length || translated.some(function (v) { return typeof v !== 'string' || !v; })) return;
    var joined = joinTranslatedChunks(sources, translated);
    if (joined) results[parseInt(idx, 10)] = joined;
  });

  if (failures === chunkJobs.length && chunkJobs.length > 0) throw new Error('Google: todos os chunks falharam');
  await setCacheBatch(texts, targetLang, results, 'google', 'gtx');
  console.log('[TR] Google: ' + texts.length + ' textos em ' + (performance.now() - t0).toFixed(0) + 'ms');
  return results;
}

async function translateDeepSeek(texts, targetLang, apiKey, model) {
  model = model || 'deepseek-chat';
  if (!apiKey) throw new Error('DeepSeek API key not configured');
  if (texts.length === 0) return [];

  var t0 = performance.now();
  var langName = getLanguageName(targetLang);
  var results = new Array(texts.length);
  var cached = await getCachedBatch(texts, targetLang, 'deepseek', model);
  var toTranslateIndices = [];

  for (var i = 0; i < texts.length; i++) {
    if (cached[i] !== undefined) results[i] = cached[i];
    else toTranslateIndices.push(i);
  }
  if (toTranslateIndices.length === 0) return results;

  var uncached = toTranslateIndices.map(function (idx) { return texts[idx]; });
  var batches = splitTextsIntoBatches(uncached, MAX_DEEPSEEK_BATCH, MAX_DEEPSEEK_ITEMS);
  var offset = 0;

  for (var bi = 0; bi < batches.length; bi++) {
    var batch = batches[bi];
    try {
      var numbered = batch.map(function (text, idx) { return '[T' + (idx + 1) + '] ' + text; }).join('\n');
      var response = await enqueueBrokerRequest(deepSeekBroker, async function () {
        var deepSeekResponse = await fetchWithTimeout(DEEPSEEK_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: 'Translate each numbered text to ' + langName + '. Return ONLY one line per item, preserving the exact [TN] tags. Do not translate the tags.' },
              { role: 'user', content: numbered }
            ],
            temperature: 0.1,
            max_tokens: 4096
          })
        }, DEEPSEEK_TIMEOUT_MS);
        if (!deepSeekResponse.ok) {
          var errorText = await deepSeekResponse.text();
          var httpError = new Error('DeepSeek HTTP ' + deepSeekResponse.status + ': ' + errorText.slice(0, 200));
          httpError.status = deepSeekResponse.status;
          var retryAfter = deepSeekResponse.headers && deepSeekResponse.headers.get('Retry-After');
          if (retryAfter) httpError.retryAfterMs = parseRetryAfter(retryAfter);
          throw httpError;
        }
        return deepSeekResponse;
      });
      var data = await response.json();
      var rawOutput = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!rawOutput) throw new Error('DeepSeek: resposta inesperada');
      var parsed = parseNumberedResponse(rawOutput, batch.length);
      for (var j = 0; j < batch.length; j++) {
        var originalIdx = toTranslateIndices[offset + j];
        if (typeof parsed[j] === 'string' && parsed[j].trim() && parsed[j].trim() !== batch[j].trim()) results[originalIdx] = parsed[j].trim();
      }
    } catch (err) {
      console.warn('[TR] DeepSeek batch ' + (bi + 1) + '/' + batches.length + ' falhou:', err.message);
    }
    offset += batch.length;
    await sleep(80);
  }

  await setCacheBatch(texts, targetLang, results, 'deepseek', model);
  console.log('[TR] DeepSeek: ' + texts.length + ' textos em ' + (performance.now() - t0).toFixed(0) + 'ms');
  return results;
}

function parseNumberedResponse(raw, expectedCount) {
  var parsed = new Array(expectedCount);
  for (var i = 0; i < expectedCount; i++) parsed[i] = '';
  var matches = String(raw).matchAll(/\[T(\d+)\]\s*([\s\S]*?)(?=\n\s*\[T\d+\]|$)/g);
  for (var match of matches) {
    var idx = parseInt(match[1], 10) - 1;
    if (idx >= 0 && idx < expectedCount) parsed[idx] = String(match[2] || '').trim();
  }
  if (parsed.every(function (value) { return !value; })) {
    var nonEmpty = String(raw).split('\n').filter(function (line) { return line.trim(); });
    for (var n = 0; n < Math.min(nonEmpty.length, expectedCount); n++) parsed[n] = nonEmpty[n].replace(/^\s*\[T\d+\]\s*/, '').trim();
  }
  return parsed;
}

async function translate(texts, targetLang, options) {
  options = options || {};
  var service = options.service || 'google';
  var apiKey = options.apiKey || '';
  var model = options.model || 'deepseek-chat';
  if (!texts || texts.length === 0) return [];

  var lastError = null;
  if (service === 'deepseek' && apiKey) {
    try {
      var deepSeekResults = await translateDeepSeek(texts, targetLang, apiKey, model);
      var missing = [];
      for (var i = 0; i < deepSeekResults.length; i++) {
        if (typeof deepSeekResults[i] !== 'string' || !deepSeekResults[i].trim()) missing.push(i);
      }
      if (missing.length === 0) return deepSeekResults;
      var failedTexts = missing.map(function (idx) { return texts[idx]; });
      var fallback = await translateGoogle(failedTexts, targetLang);
      for (var f = 0; f < missing.length; f++) deepSeekResults[missing[f]] = fallback[f];
      return deepSeekResults;
    } catch (err) {
      lastError = err;
      console.warn('[TR] DeepSeek indisponível, usando Google:', err.message);
    }
  }

  try {
    var googleResults = await translateGoogle(texts, targetLang);
    for (var g = 0; g < googleResults.length; g++) {
      if (typeof googleResults[g] !== 'string' || !googleResults[g].trim()) googleResults[g] = texts[g];
    }
    return googleResults;
  } catch (err) {
    if (lastError) throw new Error('Translation failed. DeepSeek: ' + lastError.message + '. Google: ' + err.message);
    throw err;
  }
}

function splitTextsIntoBatches(texts, maxChars, maxItems) {
  var batches = [];
  var currentBatch = [];
  var currentSize = 0;
  for (var i = 0; i < texts.length; i++) {
    var size = texts[i].length + 15;
    if ((currentSize + size > maxChars || currentBatch.length >= maxItems) && currentBatch.length > 0) {
      batches.push(currentBatch);
      currentBatch = [];
      currentSize = 0;
    }
    currentBatch.push(texts[i]);
    currentSize += size;
  }
  if (currentBatch.length > 0) batches.push(currentBatch);
  return batches;
}

function getLanguageName(code) {
  var langs = {
    pt: 'Portuguese', en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', ru: 'Russian', ja: 'Japanese',
    'zh-CN': 'Simplified Chinese', 'zh-TW': 'Traditional Chinese', ko: 'Korean', ar: 'Arabic', hi: 'Hindi', tr: 'Turkish',
    nl: 'Dutch', pl: 'Polish', vi: 'Vietnamese', th: 'Thai', id: 'Indonesian', el: 'Greek', cs: 'Czech', sv: 'Swedish',
    ro: 'Romanian', hu: 'Hungarian', fi: 'Finnish', he: 'Hebrew', uk: 'Ukrainian', bg: 'Bulgarian', da: 'Danish', no: 'Norwegian',
    fil: 'Filipino', ms: 'Malay'
  };
  return langs[code] || code;
}
