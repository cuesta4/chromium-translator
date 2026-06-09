# Chromium Translator

## Version

`1.1.1`

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
| **Built-in Google translation** | Uses the Google translation endpoint without requiring an API key |
| **DeepSeek AI (optional)** | Uses a configured DeepSeek API key and model |
| **Viewport-aware scheduling** | Translates what is visible first, prefetches nearby content, and processes distant content only when capacity is available |
| **Dynamic-page support** | Continues observing SPAs and newly inserted content after the first translation pass |
| **Dominant-language filter** | Optionally identifies the main page language and skips unrelated text fragments |
| **Bounded smart cache** | Reuses translations while pruning old entries to avoid unbounded `chrome.storage.local` growth |
| **Safe restoration** | Restores original text without overwriting legitimate page mutations made afterward |
| **On-demand injection** | Loads the content script only when translation is requested; the language detector is loaded only when needed |

## Installation

1. Extract the ZIP to a permanent folder.
2. Open `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the extracted `chromium-translator` folder.

## Usage

1. Open the popup and configure the target language.
2. Right-click a page and choose **Translate this page**.
3. Visible content is translated first. As the user scrolls, the active region is reprioritized automatically.
4. Disable translation in the popup to restore original text where restoration remains safe.

## Popup options

| Option | Description |
|---|---|
| **Translation** | Enables or disables translation and restores text when disabled |
| **Target language** | Destination language |
| **Translate dominant language only** | Skips fragments that do not match the dominant source language |
| **Service** | Google translation or DeepSeek AI |
| **Model** | DeepSeek model, loaded from the API only when DeepSeek is selected |

## Technical notes

- Google and DeepSeek requests are coordinated by service-worker brokers with request spacing, cooldown sharing, retries, jitter, and bounded timeouts.
- The Google endpoint used by this extension is not a contracted public API. Its availability and throttling behavior can change independently of the extension.
- Text inside hidden ancestors, code blocks, form controls, editable regions, and `translate="no"` containers is skipped.

## License

MIT
