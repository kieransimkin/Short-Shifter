"use strict";
// Shared by the isolated content script and the regression tests.
globalThis.ShortShifterDetection = Object.freeze({
  isShortsUrl(href) {
    try {
      const url = new URL(href, 'https://www.youtube.com');
      return ['www.youtube.com', 'youtube.com', 'm.youtube.com'].includes(url.hostname)
        && /^\/shorts\/[^/]+\/?$/.test(url.pathname);
    } catch { return false; }
  },
  isNearNineBySixteen(width, height) {
    return width > 0 && height > 0 && Math.abs(width / height - 9 / 16) / (9 / 16) <= .05;
  }
});
