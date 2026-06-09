(function () {
  'use strict';

  if (window.__chromiumTranslatorContentLoaded) return;
  window.__chromiumTranslatorContentLoaded = true;

  var originalTexts = new Map();
  var activeSession = null;
  var lastTargetLang = null;
  var toastTimer = null;
  var mutationObserver = null;
  var mutationTimer = null;
  var viewportTimer = null;
  var processTimer = null;

  var SKIP_TAGS = new Set([
    'script', 'style', 'noscript', 'code', 'pre', 'kbd', 'samp', 'var',
    'textarea', 'input', 'select', 'option', 'button',
    'svg', 'math', 'canvas', 'iframe', 'object', 'embed'
  ]);

  var BATCH_SIZE = 20;
  var MAX_SCAN_TEXT_NODES = 30000;
  var MAX_BACKGROUND_NODES = 1800;
  var MAX_PENDING_NODES = 2600;
  var MAX_DRAIN_BATCHES = 160;
  var MAX_NODE_FAILURES = 3;
  var VIEWPORT_PREFETCH_PX = 1400;
  var MUTATION_DEBOUNCE_MS = 650;
  var VIEWPORT_DEBOUNCE_MS = 180;
  var SAMPLE_SIZE = 40;
  var MIN_LANG_LENGTH = 10;

  var LANG_SCRIPTS = {
    kor: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/,
    ara: /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/,
    heb: /[\u0590-\u05FF\uFB1D-\uFB4F]/,
    hin: /[\u0900-\u097F]/,
    ben: /[\u0980-\u09FF]/,
    tam: /[\u0B80-\u0BFF]/,
    tel: /[\u0C00-\u0C7F]/,
    tha: /[\u0E00-\u0E7F]/,
    ell: /[\u0370-\u03FF\u1F00-\u1FFF]/,
    kat: /[\u10A0-\u10FF]/,
    arm: /[\u0530-\u058F]/
  };

  function injectToastStyles() {
    if (document.getElementById('__ct_styles')) return;
    var style = document.createElement('style');
    style.id = '__ct_styles';
    style.textContent = [
      '.__ct_toast{position:fixed;top:-80px;left:50%;z-index:2147483647;transform:translate(-50%,0);padding:12px 24px;border-radius:8px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:14px;font-weight:500;color:#fff;box-shadow:0 4px 20px rgba(0,0,0,.25);transition:top .35s cubic-bezier(.22,.61,.36,1),opacity .3s;opacity:0;pointer-events:none;white-space:nowrap;display:flex;align-items:center;gap:8px}',
      '.__ct_toast.__ct_show{top:16px;opacity:1}',
      '.__ct_toast.__ct_info{background:#2563eb}',
      '.__ct_toast.__ct_success{background:#16a34a}',
      '.__ct_toast.__ct_error{background:#dc2626}',
      '.__ct_toast .__ct_spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:__ct_spin .7s linear infinite}',
      '@keyframes __ct_spin{to{transform:rotate(360deg)}}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(style);
  }

  function showToast(message, type) {
    type = type || 'info';
    if (!document.body) return;
    injectToastStyles();
    var existing = document.getElementById('__ct_toast');
    if (existing) existing.remove();
    if (toastTimer) clearTimeout(toastTimer);
    var toast = document.createElement('div');
    toast.id = '__ct_toast';
    toast.className = '__ct_toast __ct_' + type;
    if (type === 'info') {
      var spinner = document.createElement('span');
      spinner.className = '__ct_spinner';
      toast.appendChild(spinner);
    }
    var msg = document.createElement('span');
    msg.textContent = message;
    toast.appendChild(msg);
    document.body.appendChild(toast);
    toast.offsetHeight;
    toast.classList.add('__ct_show');
  }

  function hideToast(delay, type) {
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      var toast = document.getElementById('__ct_toast');
      if (!toast) return;
      if (type) toast.className = '__ct_toast __ct_' + type;
      toast.classList.remove('__ct_show');
      toastTimer = setTimeout(function () { if (toast.parentNode) toast.remove(); }, 350);
    }, delay || 3000);
  }

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'ping') {
      sendResponse({ ok: true });
      return;
    }

    if (message.action === 'translate') {
      sendResponse({ accepted: true });
      runTranslation(message.targetLang, {
        filterByLang: message.filterByLang !== false
      });
      return;
    }

    if (message.action === 'restore') {
      cancelActiveSession();
      restoreOriginalTexts();
      sendResponse({ success: true });
    }
  });

  async function runTranslation(targetLang, options) {
    cancelActiveSession();
    if (lastTargetLang && lastTargetLang !== targetLang && originalTexts.size > 0) {
      restoreOriginalTexts();
    }
    lastTargetLang = targetLang;

    var session = {
      id: Date.now() + ':' + Math.random().toString(36).slice(2),
      targetLang: targetLang,
      filterByLang: !options || options.filterByLang !== false,
      pending: new Map(),
      pendingNodeCount: 0,
      queuedNodes: new WeakSet(),
      nodeFailures: new WeakMap(),
      ignoredNodes: new WeakMap(),
      languageAttempts: 0,
      predominantLang: null,
      languageInitialized: false,
      cancelled: false,
      processingPromise: null,
      initialDrain: true,
      completionShown: false,
      totalReplaced: 0
    };
    activeSession = session;

    try {
      showToast('Traduzindo página...', 'info');
      collectCandidateTextNodes(session, true);
      initializeLanguageFilter(session);
      setupLiveObservers(session);

      if (session.pending.size === 0) {
        showToast('Nenhum texto visível para traduzir', 'success');
        hideToast(1800, 'success');
        session.initialDrain = false;
        session.completionShown = true;
        return;
      }

      await processPending(session);
    } catch (err) {
      if (!session.cancelled) {
        console.error('[CT] Erro na tradução:', err);
        showToast('Erro: ' + err.message, 'error');
        hideToast(4000, 'error');
      }
    }
  }

  function initializeLanguageFilter(session) {
    if (session.languageInitialized) return;
    if (!session.filterByLang) {
      session.languageInitialized = true;
      return;
    }
    session.languageAttempts++;
    session.predominantLang = detectPredominantLanguage(Array.from(session.pending.keys()));
    if (session.predominantLang && session.predominantLang !== 'und') {
      session.languageInitialized = true;
      pruneByLanguage(session);
      return;
    }
    // Empty shells in SPAs may receive their actual article later. Retry detection
    // after future mutations instead of permanently disabling the filter.
    if (session.pending.size >= 5 || session.languageAttempts >= 3) session.languageInitialized = true;
  }

  function processPending(session) {
    if (session.cancelled) return Promise.resolve();
    if (session.processingPromise) return session.processingPromise;

    session.processingPromise = (async function () {
      var batches = 0;
      while (!session.cancelled && session.pending.size > 0 && batches < MAX_DRAIN_BATCHES) {
        batches++;
        var entries = takeNextBatch(session);
        if (entries.length === 0) break;
        try {
          var replaced = await sendAndApply(entries, session, session.targetLang);
          session.totalReplaced += replaced;
        } catch (err) {
          console.warn('[CT] Lote falhou:', err.message);
          releaseEntriesAfterFailure(entries, session);
          scheduleCollectAndProcess(session, 1600);
        }
        await idlePause(12);
      }
    })().finally(function () {
      session.processingPromise = null;
      if (session.cancelled) return;
      if (session.pending.size > 0) {
        scheduleProcess(session, 20);
        return;
      }
      if (session.initialDrain) {
        session.initialDrain = false;
        if (!session.completionShown) {
          session.completionShown = true;
          showToast('Tradução concluída: ' + session.totalReplaced + ' trechos', 'success');
          hideToast(2400, 'success');
        }
      }
    });

    return session.processingPromise;
  }

  function scheduleProcess(session, delay) {
    if (session.cancelled || activeSession !== session) return;
    if (processTimer) clearTimeout(processTimer);
    processTimer = setTimeout(function () {
      processTimer = null;
      if (!session.cancelled && activeSession === session) processPending(session);
    }, delay || 0);
  }

  function scheduleCollectAndProcess(session, delay) {
    if (session.cancelled || activeSession !== session) return;
    if (mutationTimer) clearTimeout(mutationTimer);
    mutationTimer = setTimeout(function () {
      mutationTimer = null;
      if (session.cancelled || activeSession !== session) return;
      collectCandidateTextNodes(session, false);
      initializeLanguageFilter(session);
      processPending(session);
    }, delay || MUTATION_DEBOUNCE_MS);
  }

  function takeNextBatch(session) {
    var entries = [];
    session.pending.forEach(function (entry) {
      entry.priority = computeEntryPriority(entry);
      entries.push(entry);
    });
    entries.sort(function (a, b) {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.domOrder - b.domOrder;
    });

    var selected = [];
    for (var i = 0; i < entries.length && selected.length < BATCH_SIZE; i++) {
      var entry = entries[i];
      session.pending.delete(entry.text);
      session.pendingNodeCount = Math.max(0, session.pendingNodeCount - entry.nodes.length);
      if (entry.nodes.length === 0) continue;
      selected.push(entry);
    }
    return selected;
  }

  function sendAndApply(entries, session, targetLang) {
    var texts = entries.map(function (entry) { return entry.text; });
    return new Promise(function (resolve, reject) {
      var settled = false;
      var timeout = setTimeout(function () {
        if (!settled) {
          settled = true;
          reject(new Error('Timeout: serviço de tradução não respondeu'));
        }
      }, 28000);

      chrome.runtime.sendMessage({
        action: 'translateTexts',
        texts: texts,
        targetLang: targetLang,
        priority: 'viewport'
      }, function (response) {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);

        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
        if (!response) return reject(new Error('Sem resposta do background'));
        if (response.error) return reject(new Error(response.error));
        if (session.cancelled || activeSession !== session) return resolve(0);

        var translations = response.translations;
        if (!translations || translations.length !== texts.length) {
          return reject(new Error('Resposta de tradução incompleta'));
        }

        var replaced = 0;
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i];
          var translated = translations[i];
          if (!isUsableTranslation(entry.text, translated)) {
            ignoreEntry(entry, session);
            continue;
          }

          for (var j = 0; j < entry.nodes.length; j++) {
            var node = entry.nodes[j];
            session.queuedNodes.delete(node);
            if (!node.parentNode) continue;
            var current = node.textContent;
            var parts = splitPeripheralWhitespace(current);
            if (normalizeCore(parts.core) !== entry.text) continue;
            var applied = parts.leading + translated.trim() + parts.trailing;
            storeOriginal(node, current, applied, targetLang);
            node.textContent = applied;
            replaced++;
          }
        }
        resolve(replaced);
      });
    });
  }

  function releaseEntry(entry, session) {
    for (var i = 0; i < entry.nodes.length; i++) session.queuedNodes.delete(entry.nodes[i]);
  }

  function ignoreEntry(entry, session) {
    for (var i = 0; i < entry.nodes.length; i++) {
      session.queuedNodes.delete(entry.nodes[i]);
      session.ignoredNodes.set(entry.nodes[i], entry.text);
    }
  }

  function releaseEntriesAfterFailure(entries, session) {
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      for (var j = 0; j < entry.nodes.length; j++) {
        var node = entry.nodes[j];
        session.queuedNodes.delete(node);
        var previousFailure = session.nodeFailures.get(node);
        var count = previousFailure && previousFailure.text === entry.text ? previousFailure.count + 1 : 1;
        session.nodeFailures.set(node, { text: entry.text, count: count });
      }
    }
  }

  function isUsableTranslation(original, translated) {
    if (typeof translated !== 'string') return false;
    var clean = translated.trim();
    if (!clean) return false;
    if (clean === original.trim()) return false;
    return true;
  }

  function collectCandidateTextNodes(session, initial) {
    if (!document.body || session.cancelled) return;
    pruneDisconnectedOriginalRecords();
    var t0 = performance.now();
    var domOrder = 0;
    var scanned = 0;
    var accepted = 0;
    var backgroundAccepted = 0;
    var near = [];
    var background = [];

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      scanned++;
      domOrder++;
      var parent = node.parentElement;
      if (scanned > MAX_SCAN_TEXT_NODES && computeNodePriority(parent) > 1) continue;
      if (!isCandidateNode(node, session)) continue;
      var parts = splitPeripheralWhitespace(node.textContent);
      var text = normalizeCore(parts.core);
      if (!text) continue;
      if (!shouldTranslateLanguage(text, session)) continue;
      var candidate = { node: node, element: parent, text: text, priority: computeNodePriority(parent), domOrder: domOrder };
      if (candidate.priority <= 1) near.push(candidate);
      else background.push(candidate);
    }

    for (var n = 0; n < near.length; n++) {
      if (queueCandidate(session, near[n], true)) accepted++;
    }
    for (var b = 0; b < background.length && backgroundAccepted < MAX_BACKGROUND_NODES; b++) {
      if (queueCandidate(session, background[b], false)) {
        accepted++;
        backgroundAccepted++;
      }
    }

    console.log('[CT] Coleta' + (initial ? ' inicial' : '') + ': ' + session.pending.size + ' textos pendentes, ' + accepted + ' nodes adicionados, ' + scanned + ' examinados em ' + (performance.now() - t0).toFixed(0) + 'ms');
  }

  function queueCandidate(session, candidate, forceNear) {
    if (!forceNear && session.pendingNodeCount >= MAX_PENDING_NODES) return false;
    if (session.queuedNodes.has(candidate.node)) return false;
    var failures = getNodeFailureCount(candidate.node, candidate.text, session);
    if (failures >= MAX_NODE_FAILURES) return false;

    var entry = session.pending.get(candidate.text);
    if (!entry) {
      entry = { text: candidate.text, nodes: [], elements: [], priority: candidate.priority, domOrder: candidate.domOrder };
      session.pending.set(candidate.text, entry);
    }
    entry.nodes.push(candidate.node);
    entry.elements.push(candidate.element);
    if (candidate.priority < entry.priority) entry.priority = candidate.priority;
    if (candidate.domOrder < entry.domOrder) entry.domOrder = candidate.domOrder;
    session.queuedNodes.add(candidate.node);
    session.pendingNodeCount++;
    return true;
  }

  function isCandidateNode(node, session) {
    var text = node.textContent;
    if (!text || !text.trim()) return false;
    var record = originalTexts.get(node);
    if (record) {
      if (node.textContent === record.translated) return false;
      originalTexts.delete(node);
    }
    if (session.queuedNodes.has(node)) return false;
    var normalized = normalizeCore(splitPeripheralWhitespace(text).core);
    var ignoredText = session.ignoredNodes.get(node);
    if (ignoredText) {
      if (ignoredText === normalized) return false;
      session.ignoredNodes.delete(node);
    }
    if (getNodeFailureCount(node, normalized, session) >= MAX_NODE_FAILURES) return false;
    var parent = node.parentElement;
    if (!isTranslatableElement(parent)) return false;
    if (!isElementVisible(parent)) return false;
    return true;
  }

  function getNodeFailureCount(node, text, session) {
    var failure = session.nodeFailures.get(node);
    if (!failure) return 0;
    if (failure.text !== text) {
      session.nodeFailures.delete(node);
      return 0;
    }
    return failure.count || 0;
  }

  function setupLiveObservers(session) {
    teardownLiveObservers();
    mutationObserver = new MutationObserver(function (mutations) {
      if (session.cancelled || !hasRelevantMutation(mutations)) return;
      scheduleCollectAndProcess(session, MUTATION_DEBOUNCE_MS);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
    window.addEventListener('scroll', onViewportChanged, { passive: true });
    window.addEventListener('resize', onViewportChanged, { passive: true });

    function onViewportChanged() {
      if (session.cancelled || activeSession !== session) return;
      if (viewportTimer) clearTimeout(viewportTimer);
      viewportTimer = setTimeout(function () {
        viewportTimer = null;
        if (session.cancelled || activeSession !== session) return;
        collectCandidateTextNodes(session, false);
        processPending(session);
      }, VIEWPORT_DEBOUNCE_MS);
    }
    session.onViewportChanged = onViewportChanged;
  }

  function hasRelevantMutation(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];
      if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length > 0) return true;
      if (mutation.type === 'characterData') {
        var record = originalTexts.get(mutation.target);
        if (!record || mutation.target.textContent !== record.translated) return true;
      }
    }
    return false;
  }

  function teardownLiveObservers() {
    if (mutationObserver) mutationObserver.disconnect();
    mutationObserver = null;
    if (mutationTimer) clearTimeout(mutationTimer);
    mutationTimer = null;
    if (viewportTimer) clearTimeout(viewportTimer);
    viewportTimer = null;
    if (processTimer) clearTimeout(processTimer);
    processTimer = null;
    if (activeSession && activeSession.onViewportChanged) {
      window.removeEventListener('scroll', activeSession.onViewportChanged);
      window.removeEventListener('resize', activeSession.onViewportChanged);
      activeSession.onViewportChanged = null;
    }
  }

  function cancelActiveSession() {
    if (activeSession) activeSession.cancelled = true;
    teardownLiveObservers();
    activeSession = null;
  }

  function isTranslatableElement(el) {
    if (!el) return false;
    var cur = el;
    while (cur && cur.nodeType === Node.ELEMENT_NODE) {
      var tag = cur.tagName ? cur.tagName.toLowerCase() : '';
      if (SKIP_TAGS.has(tag)) return false;
      if (cur.isContentEditable) return false;
      if (cur.hasAttribute('translate') && cur.getAttribute('translate') === 'no') return false;
      if (cur.classList && (cur.classList.contains('__ct_toast') || cur.id === '__ct_toast' || cur.id === '__ct_styles')) return false;
      cur = cur.parentElement;
    }
    return true;
  }

  function isElementVisible(el) {
    if (!el) return false;
    var cur = el;
    while (cur && cur.nodeType === Node.ELEMENT_NODE) {
      if (cur.hasAttribute('hidden') || cur.getAttribute('aria-hidden') === 'true') return false;
      var ancestorStyle = window.getComputedStyle(cur);
      if (ancestorStyle.display === 'none' || ancestorStyle.visibility === 'hidden' || ancestorStyle.visibility === 'collapse') return false;
      cur = cur.parentElement;
    }
    if (el.checkVisibility) {
      try {
        return el.checkVisibility({ checkOpacity: false, checkVisibilityCSS: true });
      } catch (e) {}
    }
    return el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
  }

  function computeEntryPriority(entry) {
    var best = 3;
    for (var i = 0; i < entry.elements.length; i++) {
      best = Math.min(best, computeNodePriority(entry.elements[i]));
      if (best === 0) break;
    }
    return best;
  }

  function computeNodePriority(el) {
    if (!el || !el.getBoundingClientRect) return 3;
    var rect = el.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return 3;
    var vh = window.innerHeight || document.documentElement.clientHeight || 0;
    var vw = window.innerWidth || document.documentElement.clientWidth || 0;
    var intersectsViewport = rect.bottom >= 0 && rect.top <= vh && rect.right >= 0 && rect.left <= vw;
    if (intersectsViewport) return 0;
    var nearViewport = rect.bottom >= -VIEWPORT_PREFETCH_PX && rect.top <= vh + VIEWPORT_PREFETCH_PX && rect.right >= -200 && rect.left <= vw + 200;
    if (nearViewport) return 1;
    return 2;
  }

  function splitPeripheralWhitespace(text) {
    var match = String(text).match(/^(\s*)([\s\S]*?)(\s*)$/);
    return { leading: match ? match[1] : '', core: match ? match[2] : text, trailing: match ? match[3] : '' };
  }

  function normalizeCore(text) {
    var t = String(text).trim();
    if (!t) return '';
    if (/^[\d\s\p{P}\p{S}]+$/u.test(t)) return '';
    return t;
  }

  function detectPredominantLanguage(texts) {
    if (typeof window.francPredominant !== 'function') return null;
    var sample = texts.filter(function (t) { return t.length >= MIN_LANG_LENGTH; }).sort(function (a, b) { return b.length - a.length; }).slice(0, SAMPLE_SIZE);
    if (sample.length === 0) return null;
    try {
      return window.francPredominant(sample, { minLength: MIN_LANG_LENGTH });
    } catch (e) {
      console.warn('[CT] Erro na detecção de idioma:', e.message);
      return null;
    }
  }

  function shouldTranslateLanguage(text, session) {
    if (!session.filterByLang || !session.predominantLang || session.predominantLang === 'und') return true;
    if (text.length < MIN_LANG_LENGTH) return true;
    var scriptPattern = LANG_SCRIPTS[session.predominantLang] || null;
    if (scriptPattern && scriptPattern.test(text)) return true;
    if (typeof window.franc !== 'function') return true;
    try {
      var detected = window.franc(text, { minLength: MIN_LANG_LENGTH });
      return detected === session.predominantLang || detected === 'und';
    } catch (e) {
      return true;
    }
  }

  function pruneByLanguage(session) {
    var removed = 0;
    session.pending.forEach(function (entry, text) {
      if (shouldTranslateLanguage(text, session)) return;
      session.pending.delete(text);
      session.pendingNodeCount = Math.max(0, session.pendingNodeCount - entry.nodes.length);
      releaseEntry(entry, session);
      removed++;
    });
    if (removed) console.log('[CT] Filtro de idioma removeu ' + removed + ' textos');
  }

  function storeOriginal(node, original, translated, targetLang) {
    if (!originalTexts.has(node)) {
      originalTexts.set(node, { original: original, translated: translated, targetLang: targetLang });
    }
  }

  function pruneDisconnectedOriginalRecords() {
    originalTexts.forEach(function (record, node) {
      if (!node.parentNode) originalTexts.delete(node);
    });
  }

  function restoreOriginalTexts() {
    var count = 0;
    originalTexts.forEach(function (record, node) {
      if (!node.parentNode) return;
      if (node.textContent === record.translated) {
        node.textContent = record.original;
        count++;
      }
    });
    originalTexts.clear();
    lastTargetLang = null;
    console.log('[CT] Restaurados ' + count + ' textos originais');
  }

  function idlePause(ms) {
    return new Promise(function (resolve) {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(function () { resolve(); }, { timeout: ms + 50 });
      } else {
        setTimeout(resolve, ms);
      }
    });
  }
})();
