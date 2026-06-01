# Chromium Translator

In-place web page translation — no redirect, no reload. Built for Chromium-based browsers that lack a decent translation extension.

## Why this exists

Chromium-based browsers (Helium, Brave, Opera, Vivaldi, Edge, Ungoogled Chromium, Thorium, etc.) struggle with the lack of a proper translation extension. The available options rely on Google Translate's official widget, which:

- **Redirects the page** to `translate.google.com`, reloading everything
- **Gets blocked** by sites like [RuTracker.org](https://rutracker.org) and other forums that reject external script injection
- **Loses page state** (filled forms, scroll position, video players)

**Chromium Translator** fixes this:

- **In-place translation**: text is replaced directly in the already-loaded DOM
- **No redirect**: everything happens via API, the page never reloads
- **Works on any site**: bypasses blocks that defeat the official Google Translate widget

## Features

| Feature | Description |
|---|---|
| **Built-in Google Translate** | Uses the `translate.googleapis.com` endpoint — **no API key required** |
| **DeepSeek AI (optional)** | For those who prefer AI translation, with a free key from [platform.deepseek.com](https://platform.deepseek.com/api_keys) |
| **Dominant language detection** | Identifies the page's primary language and skips text in other languages (e.g., English movie titles on a Russian page) |
| **Progressive translation** | Translates top-to-bottom in batches — the top of the page is ready first |
| **Smart caching** | Translated texts are cached, speeding up repeat visits |
| **Restore original** | Reverts to original text when the extension is disabled |
| **32 languages** | Arabic, Bulgarian, Chinese (Simplified & Traditional), Czech, Danish, Dutch, English, Filipino, Finnish, French, German, Greek, Hebrew, Hindi, Hungarian, Indonesian, Italian, Japanese, Korean, Malay, Norwegian, Polish, Portuguese, Romanian, Russian, Spanish, Swedish, Thai, Turkish, Ukrainian, Vietnamese, and more |

## Installation

### Step 1: Download
```bash
git clone https://github.com/{your-username}/chromium-translator.git
```
Or download the ZIP and extract it to a folder.

### Step 2: Load the extension
1. Open `chrome://extensions/` in your browser
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the project folder

### Step 3: Configure (first use)
1. Click the extension icon in the toolbar
2. Select your **target language** (e.g., Portuguese)
3. (Optional) Select DeepSeek AI and paste your free API key

## Usage

1. **Right-click** anywhere on a page
2. Select **"Translate this page"**
3. Text will be translated progressively from top to bottom
4. To disable, open the popup and toggle off — all texts revert to the original

### Popup options

| Option | Description |
|---|---|
| **Translation** | Enable/disable the extension |
| **Target language** | Which language to translate into |
| **Translate dominant language only** | Detects the page's primary language and skips text in other languages (e.g., English movie titles on a Russian forum) |
| **Service** | Google Translate (no key needed) or DeepSeek AI (requires free API key) |
| **Model** | DeepSeek model (fetched automatically from the API) |

## License

MIT
