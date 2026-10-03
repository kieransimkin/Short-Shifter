"use strict";
chrome.runtime.onInstalled.addListener(async () => {
  const settings = await chrome.storage.local.get({ shortsVisible: false });
  if (typeof settings.shortsVisible !== "boolean") await chrome.storage.local.set({ shortsVisible: false });
});
