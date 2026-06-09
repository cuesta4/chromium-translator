const LANGUAGES = [
  { code: 'pt', name: 'Portugu\u00eas' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Espa\u00f1ol' },
  { code: 'fr', name: 'Fran\u00e7ais' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ru', name: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439' },
  { code: 'ja', name: '\u65e5\u672c\u8a9e' },
  { code: 'zh-CN', name: '\u4e2d\u6587 (\u7b80\u4f53)' },
  { code: 'zh-TW', name: '\u4e2d\u6587 (\u7e41\u9ad4)' },
  { code: 'ko', name: '\ud55c\uad6d\uc5b4' },
  { code: 'ar', name: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629' },
  { code: 'hi', name: '\u0939\u093f\u0928\u094d\u0926\u0940' },
  { code: 'tr', name: 'T\u00fcrk\u00e7e' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pl', name: 'Polski' },
  { code: 'vi', name: 'Ti\u1ebfng Vi\u1ec7t' },
  { code: 'th', name: '\u0e44\u0e17\u0e22' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'el', name: '\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac' },
  { code: 'cs', name: '\u010ce\u0161tina' },
  { code: 'sv', name: 'Svenska' },
  { code: 'ro', name: 'Rom\u00e2n\u0103' },
  { code: 'hu', name: 'Magyar' },
  { code: 'fi', name: 'Suomi' },
  { code: 'he', name: '\u05e2\u05d1\u05e8\u05d9\u05ea' },
  { code: 'uk', name: '\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430' },
  { code: 'bg', name: '\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438' },
  { code: 'da', name: 'Dansk' },
  { code: 'no', name: 'Norsk' },
  { code: 'fil', name: 'Filipino' },
  { code: 'ms', name: 'Bahasa Melayu' }
];

const DEEPSEEK_MODELS_URL = 'https://api.deepseek.com/v1/models';
const MODELS_TIMEOUT_MS = 10000;
let currentModel = 'deepseek-chat';

const elements = {
  toggleEnabled: document.getElementById('toggleEnabled'),
  targetLang: document.getElementById('targetLang'),
  serviceGoogle: document.querySelector('input[value="google"]'),
  serviceDeepSeek: document.querySelector('input[value="deepseek"]'),
  apiKeySection: document.getElementById('apiKeySection'),
  apiKey: document.getElementById('apiKey'),
  modelSelect: document.getElementById('modelSelect'),
  refreshModels: document.getElementById('refreshModels'),
  modelStatus: document.getElementById('modelStatus'),
  toggleFilterLang: document.getElementById('toggleFilterLang')
};

function populateLanguages() {
  const select = elements.targetLang;
  for (const lang of LANGUAGES) {
    const option = document.createElement('option');
    option.value = lang.code;
    option.textContent = lang.name;
    select.appendChild(option);
  }
}

async function loadSettings() {
  const defaults = {
    enabled: true,
    targetLang: '',
    service: 'google',
    apiKey: '',
    model: 'deepseek-chat',
    filterByLang: true
  };

  try {
    const settings = await chrome.storage.local.get(defaults);

    elements.toggleEnabled.checked = settings.enabled !== false;
    elements.targetLang.value = settings.targetLang || '';
    elements.toggleFilterLang.checked = settings.filterByLang !== false;

    if (settings.service === 'deepseek') {
      elements.serviceDeepSeek.checked = true;
    } else {
      elements.serviceGoogle.checked = true;
    }

    elements.apiKey.value = settings.apiKey || '';
    currentModel = settings.model || 'deepseek-chat';

    updateApiKeyVisibility();

    if (settings.service === 'deepseek' && settings.apiKey) {
      await fetchModels(settings.apiKey, currentModel);
    } else if (settings.apiKey) {
      setModelSelectFallback(currentModel);
    } else {
      setModelSelectEmpty();
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
}

function updateApiKeyVisibility() {
  if (elements.serviceDeepSeek.checked) {
    elements.apiKeySection.classList.remove('hidden');
  } else {
    elements.apiKeySection.classList.add('hidden');
  }
}

function setModelSelectEmpty() {
  elements.modelSelect.innerHTML = '<option value="">Preencha a chave API...</option>';
  elements.modelSelect.disabled = true;
  elements.refreshModels.classList.add('hidden');
}

function setModelSelectLoading() {
  elements.modelSelect.innerHTML = '<option value="">Carregando modelos...</option>';
  elements.modelSelect.disabled = true;
  elements.refreshModels.classList.add('hidden');
  elements.modelStatus.classList.add('hidden');
}

var cachedModels = null;
var cachedModelsKey = null;
var cachedModelsTime = 0;
var MODEL_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

async function fetchModels(apiKey, savedModel, forceRefresh) {
  if (!apiKey) {
    setModelSelectEmpty();
    return;
  }

  var cacheKey = apiKey + '::models';

  if (!forceRefresh && cachedModels && cachedModelsKey === cacheKey && (Date.now() - cachedModelsTime) < MODEL_CACHE_TTL) {
    populateModelSelect(cachedModels, savedModel);
    return;
  }

  setModelSelectLoading();
  elements.refreshModels.classList.remove('hidden');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MODELS_TIMEOUT_MS);
  try {
    const response = await fetch(DEEPSEEK_MODELS_URL, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const models = (data.data || [])
      .map(function (m) { return m.id; })
      .filter(function (id) { return id && typeof id === 'string'; })
      .sort();

    if (models.length === 0) {
      throw new Error('Nenhum modelo dispon\u00edvel');
    }

    cachedModels = models;
    cachedModelsKey = cacheKey;
    cachedModelsTime = Date.now();

    populateModelSelect(models, savedModel);
    elements.modelStatus.classList.add('hidden');
  } catch (err) {
    setModelSelectFallback(savedModel);
    elements.modelStatus.textContent = 'Erro ao buscar modelos: ' + err.message;
    elements.modelStatus.classList.remove('hidden');
    elements.refreshModels.classList.remove('hidden');
  } finally {
    clearTimeout(timeout);
  }
}

function populateModelSelect(models, savedModel) {
  elements.modelSelect.innerHTML = '';
  elements.modelSelect.disabled = false;
  elements.refreshModels.classList.remove('hidden');

  var selectedValue = savedModel || 'deepseek-chat';
  var foundSaved = false;

  for (var i = 0; i < models.length; i++) {
    var modelId = models[i];
    var option = document.createElement('option');
    option.value = modelId;
    option.textContent = modelId;
    if (modelId === selectedValue) {
      option.selected = true;
      foundSaved = true;
    }
    elements.modelSelect.appendChild(option);
  }

  if (!foundSaved && models.length > 0) {
    elements.modelSelect.value = models[0];
  }
  currentModel = elements.modelSelect.value || currentModel;
}

function setModelSelectFallback(savedModel) {
  const fallbackModels = ['deepseek-chat', 'deepseek-reasoner'];
  elements.modelSelect.innerHTML = '';
  elements.modelSelect.disabled = false;

  let found = false;
  for (const modelId of fallbackModels) {
    const option = document.createElement('option');
    option.value = modelId;
    option.textContent = modelId + ' (offline)';
    if (modelId === savedModel) {
      option.selected = true;
      found = true;
    }
    elements.modelSelect.appendChild(option);
  }

  if (!found && fallbackModels.length > 0) {
    elements.modelSelect.value = fallbackModels[0];
  }
  currentModel = elements.modelSelect.value || currentModel;
}

function getSelectedModel() {
  return elements.modelSelect.value || currentModel || 'deepseek-chat';
}

async function saveSettings() {
  const apiKey = elements.apiKey.value.trim();
  currentModel = getSelectedModel();
  const settings = {
    enabled: elements.toggleEnabled.checked,
    targetLang: elements.targetLang.value,
    service: elements.serviceDeepSeek.checked ? 'deepseek' : 'google',
    apiKey: apiKey,
    model: currentModel,
    filterByLang: elements.toggleFilterLang.checked
  };

  chrome.storage.local.set(settings).catch(err => {
    console.error('Failed to save settings:', err);
  });

  if (!settings.enabled) {
    chrome.runtime.sendMessage({ action: 'restoreAll' }).catch(() => {});
  }
}

function setupListeners() {
  elements.toggleEnabled.addEventListener('change', saveSettings);
  elements.toggleFilterLang.addEventListener('change', saveSettings);
  elements.targetLang.addEventListener('change', saveSettings);
  elements.serviceGoogle.addEventListener('change', () => {
    updateApiKeyVisibility();
    saveSettings();
  });
  elements.serviceDeepSeek.addEventListener('change', async () => {
    updateApiKeyVisibility();
    const apiKey = elements.apiKey.value.trim();
    if (elements.serviceDeepSeek.checked && apiKey) await fetchModels(apiKey, currentModel);
    saveSettings();
  });
  elements.modelSelect.addEventListener('change', () => {
    currentModel = getSelectedModel();
    saveSettings();
  });

  elements.apiKey.addEventListener('input', debounce(async () => {
    const apiKey = elements.apiKey.value.trim();
    if (apiKey.length >= 30 && elements.serviceDeepSeek.checked) {
      await fetchModels(apiKey, getSelectedModel());
    } else if (apiKey.length === 0) {
      setModelSelectEmpty();
    }
    saveSettings();
  }, 800));

  elements.refreshModels.addEventListener('click', async () => {
    const apiKey = elements.apiKey.value.trim();
    if (apiKey) {
      await fetchModels(apiKey, getSelectedModel(), true);
    }
  });
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  populateLanguages();
  loadSettings();
  setupListeners();
});
