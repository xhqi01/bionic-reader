// Bionic Reader - Content Script
// Bolds the first ~40% of each word's letters

const BIONIC_ATTR = 'data-bionic-processed';
const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT',
  'CODE', 'PRE', 'KBD', 'SAMP', 'VAR', 'HEAD', 'META',
  'LINK', 'TITLE', 'SVG', 'MATH'
]);

let enabled = false;
let originalNodes = new Map(); // store originals for undo

function getBionicLength(word) {
  const clean = word.replace(/[^a-zA-Z\u3040-\u30FF\u4E00-\u9FFF]/g, '');
  const len = clean.length;
  if (len <= 1) return 1;
  if (len <= 3) return 1;
  if (len <= 5) return 2;
  if (len <= 8) return 3;
  return Math.ceil(len * 0.4);
}

function processBionic(text) {
  // Split into tokens: words and non-word characters
  return text.replace(/(\b[a-zA-Z]+\b)/g, (word) => {
    const boldLen = getBionicLength(word);
    const bold = word.slice(0, boldLen);
    const rest = word.slice(boldLen);
    return `<b style="font-weight:700">${bold}</b>${rest}`;
  });
}

function applyBionic(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    if (!text.trim() || !/[a-zA-Z]/.test(text)) return;

    const parent = node.parentNode;
    if (!parent || SKIP_TAGS.has(parent.tagName)) return;
    if (parent.hasAttribute(BIONIC_ATTR)) return;

    const span = document.createElement('span');
    span.setAttribute(BIONIC_ATTR, 'true');
    span.innerHTML = processBionic(text);

    originalNodes.set(span, text);
    parent.replaceChild(span, node);
    return;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    if (SKIP_TAGS.has(node.tagName)) return;
    if (node.hasAttribute(BIONIC_ATTR)) return;
    if (node.isContentEditable) return;

    // Walk children (collect first to avoid live list issues)
    const children = Array.from(node.childNodes);
    children.forEach(applyBionic);
  }
}

function removeBionic() {
  document.querySelectorAll(`[${BIONIC_ATTR}]`).forEach(span => {
    const original = originalNodes.get(span);
    if (original && span.parentNode) {
      span.parentNode.replaceChild(document.createTextNode(original), span);
    }
  });
  originalNodes.clear();
}

function toggle(newState) {
  enabled = newState;
  if (enabled) {
    applyBionic(document.body);
  } else {
    removeBionic();
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'TOGGLE') {
    toggle(msg.enabled);
    sendResponse({ ok: true });
  }
  if (msg.type === 'GET_STATE') {
    sendResponse({ enabled });
  }
});

// Init from storage
chrome.storage.local.get(['bionicEnabled'], (result) => {
  if (result.bionicEnabled) {
    toggle(true);
  }
});
