importScripts('../lib/translator.js');

console.log('[SW] Service worker iniciado');

var isEnabled = true;
var injectedTabs = new Map();
var ALLOWED_TARGET_LANG = /^(pt|en|es|fr|de|it|ru|ja|zh-CN|zh-TW|ko|ar|hi|tr|nl|pl|vi|th|id|el|cs|sv|ro|hu|fi|he|uk|bg|da|no|fil|ms)$/;
var MAX_TEXTS_PER_MESSAGE = 64;
var MAX_TEXT_CHARS = 50000;
var contextMenuMutationQueue = Promise.resolve();

restrictStorageAccess();
cleanupLegacyCache();
hydrateState().then(function () {
  return ensureContextMenu();
}).catch(function (err) {
  console.warn('[SW] Falha ao reconciliar menu de contexto:', err.message);
});

chrome.runtime.onInstalled.addListener(async function () {
  var settings = await chrome.storage.local.get(['enabled']);
  if (settings.enabled === undefined) {
    await chrome.storage.local.set({ enabled: true, service: 'google', apiKey: '', filterByLang: true });
  }
  await hydrateState();
  await ensureContextMenu();
});

chrome.runtime.onStartup.addListener(async function () {
  await hydrateState();
  await ensureContextMenu();
});

chrome.storage.onChanged.addListener(function (changes) {
  if (changes.enabled) {
    isEnabled = changes.enabled.newValue !== false;
    updateContextMenu().catch(function (err) {
      console.warn('[SW] Falha ao atualizar menu de contexto:', err.message);
    });
  }
});

async function hydrateState() {
  try {
    var settings = await chrome.storage.local.get(['enabled']);
    isEnabled = settings.enabled !== false;
  } catch (err) {
    console.warn('[SW] Falha ao carregar estado:', err.message);
  }
}

function restrictStorageAccess() {
  try {
    if (chrome.storage && chrome.storage.local && chrome.storage.local.setAccessLevel) {
      chrome.storage.local.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' }).catch(function () {});
    }
  } catch (e) {}
}

function enqueueContextMenuMutation(task) {
  contextMenuMutationQueue = contextMenuMutationQueue.then(task, task);
  return contextMenuMutationQueue;
}

function callContextMenuApi(method, args) {
  return new Promise(function (resolve, reject) {
    var callback = function () {
      var lastError = chrome.runtime && chrome.runtime.lastError;
      if (lastError) reject(new Error(lastError.message));
      else resolve();
    };
    chrome.contextMenus[method].apply(chrome.contextMenus, args.concat(callback));
  });
}

function contextMenuDetails() {
  return {
    id: 'translate-page',
    title: chrome.i18n.getMessage('contextMenuTitle') || 'Traduzir esta página',
    contexts: ['page'],
    enabled: isEnabled
  };
}

async function reconcileContextMenu() {
  var details = contextMenuDetails();
  try {
    await callContextMenuApi('update', ['translate-page', {
      title: details.title,
      contexts: details.contexts,
      enabled: details.enabled
    }]);
    return;
  } catch (updateError) {}

  try {
    await callContextMenuApi('create', [details]);
  } catch (createError) {
    // Another worker activation or queued initializer may have created it first.
    // Reconcile once more instead of surfacing a harmless duplicate-ID error.
    await callContextMenuApi('update', ['translate-page', {
      title: details.title,
      contexts: details.contexts,
      enabled: details.enabled
    }]);
  }
}

function ensureContextMenu() {
  return enqueueContextMenuMutation(reconcileContextMenu);
}

function updateContextMenu() {
  return enqueueContextMenuMutation(async function () {
    try {
      await callContextMenuApi('update', ['translate-page', { enabled: isEnabled }]);
    } catch (e) {
      await reconcileContextMenu();
    }
  });
}

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId !== 'translate-page') return;
  if (!tab || tab.id === undefined || tab.id === null) return;

  try {
    var settings = await chrome.storage.local.get(['enabled', 'targetLang', 'filterByLang']);
    if (settings.enabled === false) return;
    if (!settings.targetLang) {
      chrome.action.openPopup().catch(function () {});
      return;
    }
    if (!ALLOWED_TARGET_LANG.test(settings.targetLang)) throw new Error('Idioma alvo inválido');

    await ensureContentScripts(tab.id, settings.filterByLang !== false);
    await chrome.tabs.sendMessage(tab.id, {
      action: 'translate',
      targetLang: settings.targetLang,
      filterByLang: settings.filterByLang !== false
    });
  } catch (err) {
    console.error('[SW] Erro ao iniciar tradução:', err.message);
  }
});

async function ensureContentScripts(tabId, needsLanguageDetector) {
  var alreadyAlive = false;
  try {
    var response = await chrome.tabs.sendMessage(tabId, { action: 'ping' });
    alreadyAlive = !!(response && response.ok);
  } catch (e) {}

  var state = injectedTabs.get(tabId) || {};
  if (!alreadyAlive) state = {};
  if (alreadyAlive && (!needsLanguageDetector || state.detector)) return;

  var files = [];
  if (needsLanguageDetector && (!state.detector || !alreadyAlive)) files.push('lib/franc-min-bundle.js');
  if (!alreadyAlive) files.push('content/content.js');

  if (files.length > 0) {
    await chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: false },
      files: files
    });
  }
  injectedTabs.set(tabId, { detector: !!(needsLanguageDetector || state.detector), content: true });
}

chrome.tabs.onRemoved.addListener(function (tabId) {
  injectedTabs.delete(tabId);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.status === 'loading') injectedTabs.delete(tabId);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'translateTexts') {
    (async function () {
      try {
        validateTranslateMessage(message, sender);
        var settings = await chrome.storage.local.get(['service', 'apiKey', 'model']);
        var t0 = performance.now();
        var results = await translate(message.texts, message.targetLang, {
          service: settings.service || 'google',
          apiKey: settings.apiKey || '',
          model: settings.model || 'deepseek-chat'
        });
        console.log('[SW] Tradução de lote concluída em ' + (performance.now() - t0).toFixed(0) + 'ms');
        sendResponse({ translations: results });
      } catch (err) {
        console.error('[SW] Erro na tradução:', err.message);
        sendResponse({ error: err.message });
      }
    })();
    return true;
  }

  if (message.action === 'restoreAll') {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
        if (tab.id === undefined || tab.id === null) return;
        chrome.tabs.sendMessage(tab.id, { action: 'restore' }).catch(function () {});
      });
    });
    sendResponse({ success: true });
  }
});

function validateTranslateMessage(message, sender) {
  if (!sender || !sender.tab) throw new Error('Origem da tradução inválida');
  if (!Array.isArray(message.texts) || message.texts.length === 0 || message.texts.length > MAX_TEXTS_PER_MESSAGE) {
    throw new Error('Pedido de tradução inválido');
  }
  if (!ALLOWED_TARGET_LANG.test(message.targetLang || '')) throw new Error('Idioma alvo inválido');
  for (var i = 0; i < message.texts.length; i++) {
    if (typeof message.texts[i] !== 'string' || !message.texts[i].trim() || message.texts[i].length > MAX_TEXT_CHARS) {
      throw new Error('Texto inválido no pedido de tradução');
    }
  }
}
