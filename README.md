# Short Shifter

Cover YouTube Shorts with a bouncing, winking poo.

Short Shifter recognises Shorts shelves, cards, links and badges, including recommendations beside a video. It also retains a roughly 9:16 media fallback outside ordinary video recommendation cards. With **Shorts visible** switched off, matching content gets a dark, click-through cover. This is a visual cover: it does not stop playback, audio or navigation. The portrait fallback can also match non-Shorts media. Your preference is stored locally; there is no analytics or remote runtime service.

## Free manual installation

1. Download `short-shifter-1.0.1-chrome.zip` from [GitHub Releases](https://github.com/kieransimkin/Short-Shifter/releases/latest) and extract it to a permanent folder.
2. Open your browser's extensions page: `chrome://extensions`, `brave://extensions`, `edge://extensions`, `vivaldi://extensions`, or Opera's Extensions page.
3. Turn on **Developer mode**, select **Load unpacked**, and choose the extracted folder containing `manifest.json`.
4. Refresh YouTube and use the extension popup to switch **Shorts visible** on or off.

Keep the extracted folder in place. For an update, replace the files in your existing extension folder with the new release, click **Reload** on its extension card, then refresh your open YouTube tabs. Updates are manual; there is no browser-store listing.

[Full browser-by-browser installation guide](https://kieransimkin.co.uk/short-shifter/#ss-install). Chromium browser compatibility depends on Manifest V3 APIs; Firefox and Safari are not supported by this ZIP. Real-browser compatibility across the listed browsers has not been certified.

## Development and verification

Requires Node.js 24. No npm dependencies or image-conversion tools are required; PNG icons are included.

```sh
npm test
npm run check
npm run build
node scripts/serve-tests.mjs
```

Load `dist/` as an unpacked extension. The build creates a Chromium manifest without Firefox-specific metadata. The regression fixture at `http://127.0.0.1:8767/tests/browser-regression.html` runs the actual content scripts against illustrative YouTube card and shelf layouts, with mocked extension messaging/storage. It checks landscape sidebar Shorts, ordinary recommendations, delayed insertion, recycled links, resize, toggling and SPA navigation. This fixture is not an end-to-end test of YouTube's current personalised layout or browser extension installation. Tests of URL and ratio recognition also run in Node.

## Privacy and permissions

The extension uses local `storage` for the visibility preference and host access limited to YouTube. Detection runs locally on the page. It does not send browsing activity or preferences to a server.

## Release

GitHub Actions checks the JavaScript, runs tests and builds downloadable extension ZIPs. Store submission is a separate step and requires the store's developer account and review.

## Licence

MIT. Not affiliated with YouTube, Google or the browser vendors.
