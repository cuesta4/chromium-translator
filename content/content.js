(function () {
  'use strict';

  var originalTexts = new Map();
  var isTranslating = false;
  var toastTimer = null;

  var SKIP_TAGS = new Set([
    'script', 'style', 'noscript', 'code', 'pre',
    'textarea', 'input', 'select', 'option',
    'svg', 'math', 'canvas', 'iframe'
  ]);

  var SAMPLE_SIZE = 40;
  var MIN_LANG_LENGTH = 10;

  // Map language codes to Unicode script ranges (for mixed-script filtering)
  var LANG_SCRIPTS = {
    rus: /[\u0400-\u04FF\u0500-\u052F\u2DE0-\u2DFF\uA640-\uA69F]/,
    ukr: /[\u0400-\u04FF\u0500-\u052F]/,
    bel: /[\u0400-\u04FF]/,
    bul: /[\u0400-\u04FF]/,
    srp: /[\u0400-\u04FF]/,
    mkd: /[\u0400-\u04FF]/,
    jpn: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/,
    cmn: /[\u4E00-\u9FFF\u3400-\u4DBF]/,
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
    arm: /[\u0530-\u058F]/,
    geo: /[\u10A0-\u10FF]/
  };

  function getScriptForLang(lang) {
    return LANG_SCRIPTS[lang] || null;
  }

  function injectToastStyles() {
    if (document.getElementById('__ct_styles')) return;
    var style = document.createElement('style');
    style.id = '__ct_styles';
    style.textContent = [
      '.__ct_toast {',
      '  position:fixed;top:-80px;left:50%;z-index:2147483647;',
      '  transform:translate(-50%,0);padding:12px 24px;border-radius:8px;',
      '  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
      '  font-size:14px;font-weight:500;color:#fff;',
      '  box-shadow:0 4px 20px rgba(0,0,0,0.25);',
      '  transition:top 0.35s cubic-bezier(0.22,0.61,0.36,1),opacity 0.3s;',
      '  opacity:0;pointer-events:none;white-space:nowrap;',
      '  display:flex;align-items:center;gap:8px;',
      '}',
      '.__ct_toast.__ct_show{top:16px;opacity:1;}',
      '.__ct_toast.__ct_info{background:#2563eb;}',
      '.__ct_toast.__ct_success{background:#16a34a;}',
      '.__ct_toast.__ct_error{background:#dc2626;}',
      '.__ct_toast .__ct_spinner{',
      '  width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);',
      '  border-top-color:#fff;border-radius:50%;',
      '  animation:__ct_spin 0.7s linear infinite;',
      '}',
      '@keyframes __ct_spin{to{transform:rotate(360deg);}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function showToast(message, type) {
    type = type || 'info';
    injectToastStyles();

    var existing = document.getElementById('__ct_toast');
    if (existing) existing.remove();
    if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }

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

    // Force synchronous layout so toast renders before blocking work begins
    toast.offsetHeight;
    toast.classList.add('__ct_show');

    return toast;
  }

  function hideToast(delay, type) {
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      var toast = document.getElementById('__ct_toast');
      if (!toast) return;
      if (type) toast.className = '__ct_toast __ct_' + type;
      toast.classList.remove('__ct_show');
      toastTimer = setTimeout(function () { toast.remove(); }, 350);
    }, delay || 3000);
  }

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'translate') {
      if (isTranslating) {
        sendResponse({ error: 'Tradução já em andamento' });
        showToast('Tradução já em andamento...', 'info');
        hideToast(2000);
        return;
      }
      isTranslating = true;

      // Acknowledge immediately so service worker doesn't time out
      sendResponse({ accepted: true });

      console.log('[CT] Iniciando tradução para:', message.targetLang);

      runTranslation(message.targetLang);
    }

    if (message.action === 'restore') {
      restoreOriginalTexts();
      sendResponse({ success: true });
    }
  });

  async function runTranslation(targetLang) {
    try {
      showToast('Traduzindo página...', 'info');
      hideToast(3000);

      var textMap = collectVisibleTextNodes();

      if (textMap.size === 0) {
        isTranslating = false;
        return;
      }

      var uniqueTexts = Array.from(textMap.keys());

      var settings = await new Promise(function (r) { chrome.storage.local.get(['filterByLang'], r); });
      var filterByLang = settings.filterByLang !== false;

      console.log('[CT] ' + uniqueTexts.length + ' textos únicos, filterByLang:', filterByLang);

      var textsToTranslate = uniqueTexts;

      if (filterByLang && uniqueTexts.length > 0) {
        var predominantLang = detectPredominantLanguage(uniqueTexts);
        console.log('[CT] Idioma predominante:', predominantLang);

        if (predominantLang && predominantLang !== 'und') {
          var filtered = filterTextsByLanguage(uniqueTexts, predominantLang);
          textsToTranslate = filtered.texts;
          console.log('[CT] Filtrando: ' + textsToTranslate.length + ' para traduzir, ' + filtered.skipped + ' ignorados');
        }
      }

      if (textsToTranslate.length === 0) {
        isTranslating = false;
        return;
      }

      var BATCH_SIZE = 30;
      var batches = [];
      for (var i = 0; i < textsToTranslate.length; i += BATCH_SIZE) {
        batches.push(textsToTranslate.slice(i, i + BATCH_SIZE));
      }

      console.log('[CT] ' + batches.length + ' lotes progressivos (topo → baixo)');

      var totalReplaced = 0;
      var failedBatches = 0;
      for (var b = 0; b < batches.length; b++) {
        try {
          var replaced = await sendAndApply(batches[b], textMap, targetLang);
          totalReplaced += replaced;
          console.log('[CT] Lote ' + (b + 1) + '/' + batches.length + ': ' + replaced + ' nodes (total: ' + totalReplaced + ')');
        } catch (err) {
          failedBatches++;
          console.error('[CT] Lote ' + (b + 1) + '/' + batches.length + ' falhou:', err.message);
        }
      }

      if (failedBatches > 0) {
        console.warn('[CT] ' + failedBatches + '/' + batches.length + ' lotes falharam');
      }
      if (totalReplaced === 0 && failedBatches === batches.length) {
        throw new Error('Todos os lotes de tradução falharam');
      }

      console.log('[CT] Tradução concluída: ' + textsToTranslate.length + ' textos, ' + totalReplaced + ' nodes');
    } catch (err) {
      console.error('[CT] Erro na tradução:', err);
      showToast('Erro: ' + err.message, 'error');
      hideToast(4000, 'error');
    } finally {
      isTranslating = false;
    }
  }

  function sendAndApply(texts, textMap, targetLang) {
    return new Promise(function (resolve, reject) {
      chrome.runtime.sendMessage({
        action: 'translateTexts',
        texts: texts,
        targetLang: targetLang
      }, function (response) {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (!response) {
          reject(new Error('Sem resposta do background'));
          return;
        }
        if (response.error) {
          reject(new Error(response.error));
          return;
        }

        var translations = response.translations;
        if (!translations || translations.length === 0) {
          reject(new Error('Nenhuma tradução recebida'));
          return;
        }
        if (translations.length !== texts.length) {
          console.warn('[CT] Contagem parcial: esperado ' + texts.length + ', recebido ' + translations.length);
        }

        var replaced = 0;
        var limit = Math.min(texts.length, translations ? translations.length : 0);
        for (var j = 0; j < limit; j++) {
          var original = texts[j];
          var translated = translations[j];
          if (!translated || translated === original) continue;

          var nodes = textMap.get(original);
          if (!nodes) continue;

          for (var k = 0; k < nodes.length; k++) {
            var node = nodes[k];
            if (!node.parentNode) continue;

            storeOriginal(node);
            node.textContent = translated;
            replaced++;
          }
        }

        console.log('[CT] Lote aplicado: ' + replaced + ' nodes');
        resolve(replaced);
      });
    });
  }

  function detectPredominantLanguage(texts) {
    if (typeof window.franc !== 'function' || typeof window.francPredominant !== 'function') {
      console.log('[CT] franc não disponível, pulando detecção');
      return null;
    }

    var t0 = performance.now();

    var sample = texts
      .filter(function (t) { return t.length >= MIN_LANG_LENGTH; })
      .sort(function (a, b) { return b.length - a.length; })
      .slice(0, SAMPLE_SIZE);

    if (sample.length === 0) {
      console.log('[CT] Amostras muito curtas, traduzindo tudo');
      return null;
    }

    try {
      var result = window.francPredominant(sample, { minLength: MIN_LANG_LENGTH });
      console.log('[CT] Detecção: ' + result + ' em ' + (performance.now() - t0).toFixed(0) + 'ms, amostras: ' + sample.length);
      return result;
    } catch (e) {
      console.warn('[CT] Erro na detecção:', e.message);
      return null;
    }
  }

  function filterTextsByLanguage(texts, predominantLang) {
    if (typeof window.franc !== 'function') return { texts: texts, skipped: 0 };

    var scriptPattern = getScriptForLang(predominantLang);
    var toTranslate = [];
    var skipped = 0;

    for (var i = 0; i < texts.length; i++) {
      var text = texts[i];

      // Short texts: always include
      if (text.length < MIN_LANG_LENGTH) {
        toTranslate.push(text);
        continue;
      }

      // Fast-path: if text contains script chars of the predominant language, include it
      if (scriptPattern && scriptPattern.test(text)) {
        toTranslate.push(text);
        continue;
      }

      // Script check didn't match — fall back to franc for Latin-based languages
      try {
        var detected = window.franc(text, { minLength: MIN_LANG_LENGTH });
        if (detected === predominantLang || detected === 'und') {
          toTranslate.push(text);
        } else {
          skipped++;
        }
      } catch (e) {
        toTranslate.push(text);
      }
    }

    return { texts: toTranslate, skipped: skipped };
  }

  function collectVisibleTextNodes() {
    var textMap = new Map();
    var t0 = performance.now();
    var processed = 0;

    if (!document.body) return textMap;

    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          var text = node.textContent;
          if (!text) return NodeFilter.FILTER_REJECT;

          var parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          var tag = parent.tagName;
          if (!tag || SKIP_TAGS.has(tag.toLowerCase())) {
            return NodeFilter.FILTER_REJECT;
          }

          if (!isElementVisible(parent)) return NodeFilter.FILTER_REJECT;

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    var node;
    while ((node = walker.nextNode())) {
      processed++;
      var trimmed = node.textContent.trim();
      if (!trimmed) continue;

      if (!textMap.has(trimmed)) {
        textMap.set(trimmed, []);
      }
      textMap.get(trimmed).push(node);
    }

    console.log('[CT] Coleta: ' + textMap.size + ' únicos, ' + processed + ' nodes em ' + (performance.now() - t0).toFixed(0) + 'ms');
    return textMap;
  }

  function isElementVisible(el) {
    if (!el) return false;
    if (el.hasAttribute('hidden')) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;

    // Fast-path: element has layout → assume visible
    // visibility:hidden is extremely rare — translating invisible text is harmless
    var tag = el.tagName.toLowerCase();
    if (tag !== 'body' && tag !== 'html') {
      if (el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0) {
        return true;
      }
      // No layout — might be display:none, or fixed/absolute without dimensions
    }

    // Only call getComputedStyle for edge cases (no-layout elements)
    var style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    return true;
  }

  function storeOriginal(node) {
    if (!originalTexts.has(node)) {
      originalTexts.set(node, node.textContent);
    }
  }

  function restoreOriginalTexts() {
    var count = 0;
    originalTexts.forEach(function (text, node) {
      if (node.parentNode) {
        node.textContent = text;
        count++;
      }
    });
    originalTexts.clear();
    console.log('[CT] Restaurados ' + count + ' textos originais');
  }
})();
