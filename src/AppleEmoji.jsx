import { useEffect } from 'react';
import twemoji from 'twemoji';

// ════════════════════════════════════════════════════════════
// AppleEmoji — replaces native emoji glyphs with Apple/iOS emoji
// images everywhere in the app (works on Windows, Android, web).
//
// Uses twemoji to detect emoji + extract codepoints (the hard part),
// then points the image URL at the Apple emoji image set on jsDelivr
// so you get true iOS-style emojis on every platform.
// ════════════════════════════════════════════════════════════

const APPLE_BASE = 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64';

function parse(root) {
  if (!root) return;
  twemoji.parse(root, {
    folder: '',
    ext: '',
    callback: (icon) => {
      // icon is the codepoint string e.g. "1f9d8"; Apple set drops the
      // trailing variation selector "-fe0f" on most single glyphs.
      const clean = icon.replace(/-fe0f$/i, '');
      return `${APPLE_BASE}/${clean}.png`;
    },
    attributes: () => ({ loading: 'lazy' }),
  });
}

export default function AppleEmoji() {
  useEffect(() => {
    // inject sizing style once
    const styleId = 'apple-emoji-style';
    if (!document.getElementById(styleId)) {
      const st = document.createElement('style');
      st.id = styleId;
      st.textContent = `
        img.emoji {
          height: 1em; width: 1em;
          margin: 0 0.05em 0 0.1em;
          vertical-align: -0.15em;
          display: inline-block;
        }`;
      document.head.appendChild(st);
    }

    // initial parse
    parse(document.body);

    // re-parse on DOM changes (chat messages, new screens, etc.)
    let scheduled = false;
    const observer = new MutationObserver((mutations) => {
      // ignore mutations that are only our own <img.emoji> insertions
      const meaningful = mutations.some(m =>
        [...m.addedNodes].some(n =>
          !(n.nodeType === 1 && n.tagName === 'IMG' && n.classList?.contains('emoji'))
        )
      );
      if (!meaningful || scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        parse(document.body);
        scheduled = false;
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}