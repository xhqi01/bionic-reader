# bionic-reader

A Chrome extension that bolds the first letters of every word on a webpage, helping your brain move faster through text with less friction. Built on the Bionic Reading method — originally designed for readers with ADHD and dyslexia.

![preview](assets/preview.png)

---

## Features

- Toggle on/off per page with one click
- Automatically adjusts bold length based on word length
- Skips code blocks, inputs, and scripts
- No data collected, works entirely in your browser

---

## Install

> Chrome Web Store listing coming soon. For now, load it manually:

1. Download or clone this repo
2. Go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** → select the repo folder
5. Pin the extension and click the icon to toggle

---

## How it works

Each word gets its first ~40% of letters bolded. The exact amount scales with word length:

| Word length | Bold letters |
|-------------|-------------|
| 1–3 letters | 1 |
| 4–5 letters | 2 |
| 6–8 letters | 3 |
| 9+ letters  | ~40% |

The extension processes text nodes directly in the DOM and skips `<code>`, `<pre>`, `<input>`, `<textarea>`, and other non-prose elements.

---

## Development

```
bionic-reader/
├── manifest.json
├── content.js      # DOM text processing
├── popup.html      # Extension popup UI
├── popup.js        # Toggle logic
└── icon*.png
```

No build step required. Edit and reload from `chrome://extensions`.

---

## License

MIT
