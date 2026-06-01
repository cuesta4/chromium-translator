importScripts('../lib/translator.js');

console.log('[SW] Service worker iniciado');

var isEnabled = true;

chrome.runtime.onInstalled.addListener(async () => {
  console.log('[SW] onInstalled');

  var settings = await chrome.storage.local.get(['enabled', 'targetLang', 'service', 'apiKey']);
  if (settings.enabled === undefined) {
    await chrome.storage.local.set({ enabled: true, service: 'google', apiKey: '' });
  }

  isEnabled = settings.enabled !== false;
  updateContextMenu();

  chrome.contextMenus.create({
    id: 'translate-page',
    title: chrome.i18n.getMessage('contextMenuTitle') || 'Traduzir esta página',
    contexts: ['page']
  }, function () {
    if (chrome.runtime.lastError) {
      // Menu already exists (e.g. extension reloaded) — update it
      chrome.contextMenus.update('translate-page', {
        title: chrome.i18n.getMessage('contextMenuTitle') || 'Traduzir esta página',
        enabled: isEnabled
      }).catch(function () {});
    }
  });
  console.log('[SW] Context menu criado');
});

chrome.runtime.onStartup.addListener(async () => {
  console.log('[SW] onStartup');
  var settings = await chrome.storage.local.get(['enabled']);
  isEnabled = settings.enabled !== false;
  updateContextMenu();
});

chrome.storage.onChanged.addListener(function (changes) {
  if (changes.enabled) {
    isEnabled = changes.enabled.newValue !== false;
    updateContextMenu();
  }
});

function updateContextMenu() {
  chrome.contextMenus.update('translate-page', { enabled: isEnabled }).catch(function () {
    // Menu item may not exist — recreate on next onClick
  });
}

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId !== 'translate-page') return;
  if (!tab || !tab.id) return;

  console.log('[SW] Context menu clicado, tab:', tab.id);

  try {
    var settings = await chrome.storage.local.get(['enabled', 'targetLang']);
    console.log('[SW] Settings:', settings);

    if (settings.enabled === false) {
      console.log('[SW] Extensão desativada, ignorando');
      return;
    }

    if (!settings.targetLang) {
      console.log('[SW] Idioma alvo não configurado, abrindo popup');
      chrome.action.openPopup();
      return;
    }

    console.log('[SW] Enviando translate para tab', tab.id, 'lang:', settings.targetLang);
    chrome.tabs.sendMessage(tab.id, { action: 'translate', targetLang: settings.targetLang })
      .catch(function (err) {
        console.error('[SW] Erro ao enviar mensagem:', err.message);
      });
  } catch (err) {
    console.error('[SW] Erro no context menu:', err.message);
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'translateTexts') {
    console.log('[SW] Recebido translateTexts:', message.texts.length, 'textos, lang:', message.targetLang);

    (async function () {
      try {
        var settings = await chrome.storage.local.get(['service', 'apiKey', 'model']);
        console.log('[SW] Serviço:', settings.service, 'modelo:', settings.model);

        var t0 = performance.now();
        var results = await translate(
          message.texts,
          message.targetLang,
          {
            service: settings.service || 'google',
            apiKey: settings.apiKey || '',
            model: settings.model || 'deepseek-chat'
          }
        );
        console.log('[SW] Tradução concluída em ' + (performance.now() - t0).toFixed(0) + 'ms');

        sendResponse({ translations: results });
      } catch (err) {
        console.error('[SW] Erro na tradução:', err.message);
        sendResponse({ error: err.message });
      }
    })();
    return true;
  }

  if (message.action === 'restoreAll') {
    console.log('[SW] Restaurando textos em abas HTTP(S)');
    chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] }, function (tabs) {
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id) {
          chrome.tabs.sendMessage(tabs[i].id, { action: 'restore' }).catch(function () {});
        }
      }
    });
    sendResponse({ success: true });
  }
});
