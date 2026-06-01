const GOOGLE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single';
const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';
const MAX_GOOGLE_CHUNK = 1500;
const MAX_DEEPSEEK_BATCH = 8000;
const CONCURRENCY = 12;

const CACHE_PREFIX = 'tr_';

async function getCachedBatch(texts, targetLang) {
  var keys = [];
  var keyToIdx = {};
  for (var i = 0; i < texts.length; i++) {
    var k = CACHE_PREFIX + hash(texts[i], targetLang);
    keys.push(k);
    keyToIdx[k] = i;
  }
  var result = await chrome.storage.local.get(keys);
  var cached = {};
  for (var k in result) {
    if (result[k] && keyToIdx[k] !== undefined) {
      cached[keyToIdx[k]] = result[k];
    }
  }
  return cached;
}

async function setCache(text, targetLang, translation) {
  var key = CACHE_PREFIX + hash(text, targetLang);
  await chrome.storage.local.set({ [key]: translation });
}

async function setCacheBatch(texts, targetLang, results) {
  var batch = {};
  for (var i = 0; i < texts.length; i++) {
    if (results[i]) {
      var key = CACHE_PREFIX + hash(texts[i], targetLang);
      batch[key] = results[i];
    }
  }
  if (Object.keys(batch).length > 0) {
    await chrome.storage.local.set(batch);
  }
}

function hash(text, lang) {
  let h = 0;
  const s = text + '::' + lang;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return 'h' + (h >>> 0).toString(36);
}

async function translateGoogleChunk(text, targetLang, retries) {
  if (retries === undefined) retries = 2;

  for (var attempt = 0; attempt <= retries; attempt++) {
    try {
      var url = `${GOOGLE_ENDPOINT}?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      var response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      var data = await response.json();
      if (!data || !data[0]) {
        throw new Error('Unexpected response format');
      }
      var translation = '';
      for (var i = 0; i < data[0].length; i++) {
        if (data[0][i] && data[0][i][0]) {
          translation += data[0][i][0];
        }
      }
      if (!translation) throw new Error('Empty translation');
      return translation;
    } catch (err) {
      if (attempt < retries) {
        await new Promise(function (r) { setTimeout(r, 200 * (attempt + 1)); });
      } else {
        throw err;
      }
    }
  }
}

async function translateGoogle(texts, targetLang) {
  var t0 = performance.now();
  var results = new Array(texts.length);

  var cached = await getCachedBatch(texts, targetLang);
  var toTranslate = [];
  for (var i = 0; i < texts.length; i++) {
    if (cached[i] !== undefined) {
      results[i] = cached[i];
    } else {
      toTranslate.push({ index: i, text: texts[i] });
    }
  }

  if (toTranslate.length === 0) {
    console.log('[TR] Google: todos em cache (' + texts.length + ' textos)');
    return results;
  }

  console.log('[TR] Google: ' + toTranslate.length + '/' + texts.length + ' textos precisam de tradução');

  var queue = [];
  for (var t = 0; t < toTranslate.length; t++) {
    var item = toTranslate[t];
    var chunks = splitIntoChunks(item.text, MAX_GOOGLE_CHUNK);
    for (var c = 0; c < chunks.length; c++) {
      queue.push({ index: item.index, chunkIndex: c, total: chunks.length, text: chunks[c] });
    }
  }

  var translations = {};

  for (var i = 0; i < queue.length; i += CONCURRENCY) {
    var batch = queue.slice(i, i + CONCURRENCY);
    var settled = await Promise.allSettled(
      batch.map(function (q) {
        return translateGoogleChunk(q.text, targetLang).then(function (r) { return { ok: true, value: r, idx: q.index, ci: q.chunkIndex }; });
      })
    );
    for (var s = 0; s < settled.length; s++) {
      var br = settled[s];
      if (br.status === 'fulfilled' && br.value && br.value.ok) {
        if (!translations[br.value.idx]) translations[br.value.idx] = [];
        translations[br.value.idx][br.value.ci] = br.value.value;
      } else {
        console.warn('[TR] Chunk falhou:', br.status === 'rejected' ? br.reason.message : 'unknown');
      }
    }
  }

  // Flatten chunk results into final results
  for (var idx in translations) {
    var full = translations[idx].join('');
    results[idx] = full;
  }

  await setCacheBatch(texts, targetLang, results);

  console.log('[TR] Google concluído em ' + (performance.now() - t0).toFixed(0) + 'ms');
  return results;
}

async function translateDeepSeek(texts, targetLang, apiKey, model) {
  if (model === undefined) model = 'deepseek-chat';
  if (!apiKey) throw new Error('DeepSeek API key not configured');
  if (texts.length === 0) return [];

  var t0 = performance.now();
  var langName = getLanguageName(targetLang);

  var results = new Array(texts.length);
  var cached = await getCachedBatch(texts, targetLang);
  var toTranslateIndices = [];

  for (var i = 0; i < texts.length; i++) {
    if (cached[i] !== undefined) {
      results[i] = cached[i];
    } else {
      toTranslateIndices.push(i);
    }
  }

  if (toTranslateIndices.length === 0) {
    console.log('[TR] DeepSeek: todos em cache (' + texts.length + ' textos)');
    return results;
  }

  console.log('[TR] DeepSeek: ' + toTranslateIndices.length + '/' + texts.length + ' textos, modelo:', model);

  var uncached = toTranslateIndices.map(function (i) { return texts[i]; });

  var batches = splitTextsIntoBatches(uncached, MAX_DEEPSEEK_BATCH);
  var offset = 0;
  var failedBatchCount = 0;

  for (var bi = 0; bi < batches.length; bi++) {
    var batch = batches[bi];
    try {
      var numbered = batch.map(function (t, idx) { return '[T' + (offset + idx + 1) + '] ' + t; }).join('\n');

      var response = await fetch(DEEPSEEK_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are a precise translator. Translate each numbered text to ' + langName + '. Return ONLY the translations prefixed with the same number tags in format "[TN] translated text", one per line. Do NOT add any introduction, commentary, or extra text.'
            },
            { role: 'user', content: numbered }
          ],
          temperature: 0.1,
          max_tokens: 4096
        })
      });

      if (!response.ok) {
        var errorText = await response.text();
        throw new Error('DeepSeek API HTTP ' + response.status + ': ' + errorText.slice(0, 200));
      }

      var data = await response.json();
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('DeepSeek API: unexpected response format');
      }

      var rawOutput = data.choices[0].message.content;
      var parsed = parseNumberedResponse(rawOutput, batch.length);

      for (var j = 0; j < batch.length; j++) {
        var originalIdx = toTranslateIndices[offset + j];
        var translation = parsed[j] || batch[j];
        results[originalIdx] = translation;
      }
    } catch (err) {
      failedBatchCount++;
      console.warn('[TR] DeepSeek batch ' + (bi + 1) + '/' + batches.length + ' falhou:', err.message);
    }

    offset += batch.length;
  }

  await setCacheBatch(texts, targetLang, results);

  if (failedBatchCount === batches.length) {
    throw new Error('DeepSeek: todos os ' + batches.length + ' batches falharam');
  }

  console.log('[TR] DeepSeek concluído em ' + (performance.now() - t0).toFixed(0) + 'ms (' + failedBatchCount + ' batches falharam)');
  return results;
}

function parseNumberedResponse(raw, expectedCount) {
  var parsed = new Array(expectedCount);
  for (var i = 0; i < expectedCount; i++) parsed[i] = '';
  var lines = raw.split('\n');

  for (var l = 0; l < lines.length; l++) {
    var match = lines[l].match(/\[T(\d+)\]\s*(.+)/);
    if (match) {
      var idx = parseInt(match[1], 10) - 1;
      if (idx >= 0 && idx < expectedCount) {
        parsed[idx] = match[2].trim();
      }
    }
  }

  if (parsed.every(function (p) { return !p; })) {
    var nonEmpty = lines.filter(function (l) { return l.trim(); });
    for (var i = 0; i < Math.min(nonEmpty.length, expectedCount); i++) {
      var cleaned = nonEmpty[i].replace(/^\[T\d+\]\s*/, '').trim();
      if (cleaned) parsed[i] = cleaned;
    }
  }

  return parsed;
}

async function translate(texts, targetLang, options) {
  if (!options) options = {};
  var service = options.service || 'google';
  var apiKey = options.apiKey || '';
  var model = options.model || 'deepseek-chat';

  if (!texts || texts.length === 0) return [];

  var lastError = null;
  var deepseekResults = null;

  if (service === 'deepseek' && apiKey) {
    try {
      deepseekResults = await translateDeepSeek(texts, targetLang, apiKey, model);
    } catch (err) {
      console.warn('[TR] DeepSeek falhou completamente, fallback para Google:', err.message);
      lastError = err;
      deepseekResults = null;
    }
  }

  if (deepseekResults) {
    // Check for untranslated texts (null/undefined in results array)
    var failedIndices = [];
    for (var i = 0; i < deepseekResults.length; i++) {
      if (deepseekResults[i] === null || deepseekResults[i] === undefined) {
        failedIndices.push(i);
      }
    }

    if (failedIndices.length === 0) {
      return deepseekResults;
    }

    console.warn('[TR] ' + failedIndices.length + '/' + texts.length + ' textos não traduzidos pelo DeepSeek, usando Google como fallback');

    try {
      var failedTexts = failedIndices.map(function (i) { return texts[i]; });
      var googleResults = await translateGoogle(failedTexts, targetLang);
      for (var j = 0; j < failedIndices.length; j++) {
        deepseekResults[failedIndices[j]] = googleResults[j];
      }
      return deepseekResults;
    } catch (err) {
      console.error('[TR] Google fallback também falhou:', err.message);
      throw new Error('Translation failed. DeepSeek (partial) + Google: ' + err.message);
    }
  }

  // No DeepSeek results — use Google entirely
  try {
    return await translateGoogle(texts, targetLang);
  } catch (err) {
    console.error('[TR] Google Translate falhou:', err.message);
    if (lastError) {
      throw new Error('Translation failed. DeepSeek: ' + lastError.message + '. Google: ' + err.message);
    }
    throw err;
  }
}

function splitIntoChunks(text, maxSize) {
  if (text.length <= maxSize) return [text];

  var isCJK = /[\u3000-\u9FFF\uF900-\uFAFF]/.test(text);
  var chunks = [];
  var start = 0;

  while (start < text.length) {
    var end = Math.min(start + maxSize, text.length);

    if (end < text.length && !isCJK) {
      // Latin scripts: try to break at sentence or word boundaries
      var boundary = end;
      while (boundary > start + maxSize * 0.6) {
        if (/[.!?\n]/.test(text[boundary]) || (text[boundary] === ' ' && text[boundary - 1] && /[.!?]/.test(text[boundary - 1]))) {
          end = boundary + 1;
          break;
        }
        if (text[boundary] === ' ' && boundary > start + maxSize * 0.8) {
          end = boundary;
          break;
        }
        boundary--;
      }
    }

    chunks.push(text.substring(start, end).trim());
    start = end;
  }

  return chunks;
}

function splitTextsIntoBatches(texts, maxChars) {
  var batches = [];
  var currentBatch = [];
  var currentSize = 0;

  for (var i = 0; i < texts.length; i++) {
    var size = texts[i].length + 15;
    if (currentSize + size > maxChars && currentBatch.length > 0) {
      batches.push(currentBatch);
      currentBatch = [];
      currentSize = 0;
    }
    currentBatch.push(texts[i]);
    currentSize += size;
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
}

function getLanguageName(code) {
  const langs = {
    'pt': 'Portuguese',
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'ru': 'Russian',
    'ja': 'Japanese',
    'zh-CN': 'Simplified Chinese',
    'zh-TW': 'Traditional Chinese',
    'ko': 'Korean',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'tr': 'Turkish',
    'nl': 'Dutch',
    'pl': 'Polish',
    'vi': 'Vietnamese',
    'th': 'Thai',
    'id': 'Indonesian',
    'el': 'Greek',
    'cs': 'Czech',
    'sv': 'Swedish',
    'ro': 'Romanian',
    'hu': 'Hungarian',
    'fi': 'Finnish',
    'he': 'Hebrew',
    'uk': 'Ukrainian',
    'bg': 'Bulgarian',
    'da': 'Danish',
    'no': 'Norwegian'
  };
  return langs[code] || code;
}
