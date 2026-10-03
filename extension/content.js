"use strict";
(() => {
  const OVERLAY_CLASS = 'short-shifter-overlay';
  const STYLE_ID = 'short-shifter-styles';
  const { isShortsUrl, isNearNineBySixteen } = globalThis.ShortShifterDetection;
  const SHORTS_CARDS = 'ytm-shorts-lockup-view-model,ytm-shorts-lockup-view-model-v2,yt-shorts-lockup-view-model,ytd-reel-item-renderer';
  const VIDEO_CARDS = 'ytd-compact-video-renderer,yt-lockup-view-model,ytd-rich-item-renderer,ytd-grid-video-renderer,ytd-video-renderer';
  const SHELVES = 'ytd-reel-shelf-renderer,ytm-reel-shelf-renderer,ytd-rich-shelf-renderer[is-shorts]';
  const overlays = new Map();
  const watchedTargets = new Set();
  let shortsVisible = false;
  let scanTimer = null;
  let resizeObserver;

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `.${OVERLAY_CLASS}{position:absolute!important;z-index:2147483647!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;background:radial-gradient(circle at 50% 45%,#181818 0%,#090909 70%)!important;border-radius:inherit!important;pointer-events:none!important;box-sizing:border-box!important}.${OVERLAY_CLASS} .short-shifter-poo{display:block!important;font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif!important;font-size:clamp(28px,22%,76px)!important;line-height:1!important;user-select:none!important;animation:short-shifter-bounce 850ms cubic-bezier(.25,.8,.25,1) infinite!important;transform-origin:center bottom!important}.${OVERLAY_CLASS} .short-shifter-face{position:absolute!important;width:.8em!important;height:.8em!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:.5em!important;transform:translate(.15em,-.15em) scaleX(0)!important;animation:short-shifter-wink 3s ease-in-out infinite!important}@keyframes short-shifter-bounce{0%,100%{transform:translateY(5px) rotate(-3deg)}50%{transform:translateY(-8px) rotate(3deg)}}@keyframes short-shifter-wink{0%,72%,100%{transform:translate(.15em,-.15em) scaleX(0)}75%,82%{transform:translate(.15em,-.15em) scaleX(1)}}`;
    document.documentElement.appendChild(style);
  }

  function targets() {
    const found = new Set(document.querySelectorAll(`${SHELVES},${SHORTS_CARDS}`));
    // A sidebar Short can have a landscape thumbnail; its URL or Shorts badge
    // is stronger evidence than the aspect ratio of its rendered image.
    for (const marker of document.querySelectorAll('a[href],[overlay-style="SHORTS"],[data-style="SHORTS"]')) {
      if (marker.matches('a') && !isShortsUrl(marker.getAttribute('href'))) continue;
      const card = marker.closest(`${SHORTS_CARDS},${VIDEO_CARDS}`);
      if (card) found.add(card);
    }
    for (const shelf of document.querySelectorAll('grid-shelf-view-model')) {
      if (shelf.querySelector(SHORTS_CARDS) || [...shelf.querySelectorAll('a[href]')].some(a => isShortsUrl(a.getAttribute('href')))) found.add(shelf);
    }
    // Retain v1.0.0's portrait-media fallback, but not inside an ordinary video
    // recommendation card: avatars and portrait artwork are not Shorts signals.
    for (const media of document.querySelectorAll('img,video,canvas,ytd-thumbnail,yt-thumbnail-view-model,a#thumbnail')) {
      if (media.closest(`${VIDEO_CARDS},.${OVERLAY_CLASS}`)) continue;
      const rect = media.getBoundingClientRect();
      if (isNearNineBySixteen(rect.width, rect.height)) found.add(media);
    }
    // One cover per shelf/card, never a pile of covers for nested thumbnails.
    return [...found].filter(target => ![...found].some(parent => parent !== target && parent.contains(target)));
  }

  function remove(target) {
    const entry = overlays.get(target);
    if (!entry) return;
    entry.overlay.remove();
    if (entry.changedPosition && entry.host.style.position === 'relative') entry.host.style.position = entry.oldPosition;
    overlays.delete(target);
  }

  function cover(target) {
    const rect = target.getBoundingClientRect();
    if (rect.width < 30 || rect.height < 50) { remove(target); return; }
    let entry = overlays.get(target);
    // Images, videos and canvases cannot reliably display child elements.
    const host = target.matches('img,video,canvas') ? target.parentElement : target;
    if (!host) return;
    if (entry && (entry.host !== host || !entry.overlay.isConnected)) { remove(target); entry = null; }
    if (!entry) {
      const oldPosition = host.style.position;
      const changedPosition = getComputedStyle(host).position === 'static';
      if (changedPosition) host.style.position = 'relative';
      const overlay = document.createElement('div');
      overlay.className = OVERLAY_CLASS;
      overlay.setAttribute('aria-label', 'YouTube Short hidden');
      const poo = document.createElement('span');
      poo.className = 'short-shifter-poo';
      poo.textContent = '💩';
      const face = document.createElement('span');
      face.className = 'short-shifter-face';
      face.textContent = '😉';
      overlay.append(poo, face);
      host.appendChild(overlay);
      entry = { overlay, host, oldPosition, changedPosition };
      overlays.set(target, entry);
    }
    const hostRect = host.getBoundingClientRect();
    Object.assign(entry.overlay.style, {
      left: `${rect.left - hostRect.left - host.clientLeft + host.scrollLeft}px`,
      top: `${rect.top - hostRect.top - host.clientTop + host.scrollTop}px`,
      width: `${rect.width}px`, height: `${rect.height}px`
    });
  }

  function scan() {
    scanTimer = null;
    injectStyles();
    const selected = new Set(shortsVisible ? [] : targets());
    // Observe zero-sized skeletons too: they can become visible without a DOM
    // insertion (for example after an asynchronous layout or image load).
    for (const target of watchedTargets) if (!selected.has(target)) {
      resizeObserver?.unobserve(target);
      watchedTargets.delete(target);
    }
    for (const target of selected) if (!watchedTargets.has(target)) {
      resizeObserver?.observe(target);
      watchedTargets.add(target);
    }
    for (const target of overlays.keys()) if (!target.isConnected || !selected.has(target)) remove(target);
    for (const target of selected) cover(target);
  }
  function schedule() { if (scanTimer === null) scanTimer = setTimeout(scan, 150); }
  function ownNode(node) {
    return node instanceof Element && (node.id === STYLE_ID || node.matches(`.${OVERLAY_CLASS}`) || !!node.closest(`.${OVERLAY_CLASS}`));
  }
  function start() {
    resizeObserver = new ResizeObserver(schedule);
    new MutationObserver(records => {
      const externalChange = records.some(record => !ownNode(record.target) && (record.type === 'attributes'
        || [...record.addedNodes, ...record.removedNodes].some(node => !ownNode(node))));
      if (externalChange) schedule();
    }).observe(document.documentElement, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ['href', 'overlay-style', 'data-style', 'is-shorts', 'hidden', 'class']
    });
    addEventListener('resize', schedule, { passive: true });
    addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('yt-navigate-finish', schedule);
  }
  async function init() {
    injectStyles();
    shortsVisible = Boolean((await chrome.storage.local.get({ shortsVisible: false })).shortsVisible);
    start();
    scan();
  }
  function changeVisibility(value) { shortsVisible = Boolean(value); scan(); }
  chrome.runtime.onMessage.addListener(message => {
    if (message?.type === 'SHORTS_VISIBILITY_CHANGED') changeVisibility(message.shortsVisible);
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.shortsVisible) changeVisibility(changes.shortsVisible.newValue);
  });
  init();
})();
