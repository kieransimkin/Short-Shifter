# Short Shifter

Cover YouTube Shorts with a bouncing, winking poo.

Short Shifter recognises Shorts shelves, cards, links and badges, including recommendations beside a video. It also retains a roughly 9:16 media fallback outside ordinary video recommendation cards. With **Shorts visible** switched off, matching content is covered, the poo bounces three times, and its card collapses to zero height. The centred poo then winks and disappears. Turning visibility back on restores the original layout. Reduced-motion preferences skip the animation. This hides the card visually; it does not stop playback or audio. The portrait fallback can also match non-Shorts media. Your preference is stored locally; there is no analytics or remote runtime service.

## Free manual installation

1. Download `short-shifter-1.0.3-chrome.zip` from [GitHub Releases](https://github.com/kieransimkin/Short-Shifter/releases/latest) and extract it to a permanent folder.
2. Open your browser's extensions page: `chrome://extensions`, `brave://extensions`, `edge://extensions`, `vivaldi://extensions`, or Opera's Extensions page.
3. Turn on **Developer mode**, select **Load unpacked**, and choose the extracted folder containing `manifest.json`.
4. Refresh YouTube and use the extension popup to switch **Shorts visible** on or off.

Keep the extracted folder in place. For an update, replace the files in your existing extension folder with the new release, click **Reload** on its extension card, then refresh your open YouTube tabs. Updates are manual; there is no browser-store listing.

[Full browser-by-browser installation guide](https://kieransimkin.co.uk/short-shifter/#ss-install). Chromium browser compatibility depends on Manifest V3 APIs; Firefox and Safari are not supported by this ZIP. Real-browser compatibility across the listed browsers has not been certified.

## Upgrading an existing installation

1. Download the newest `short-shifter-<version>-chrome.zip` from [GitHub Releases](https://github.com/kieransimkin/Short-Shifter/releases/latest). Extract it to a temporary folder.
2. Find the permanent Short Shifter folder you originally selected with **Load unpacked**. Your browser's extension details may show its path.
3. Copy **all files and folders** from the new ZIP into that existing folder, replacing files when prompted. Keep the same folder path, and make sure `manifest.json` sits directly inside it. Do not copy the ZIP or add an extra nested folder. New releases may add scripts, so do not replace only `content.js`.
4. Open your browser's extensions page (`chrome://extensions`, `brave://extensions`, `edge://extensions`, `vivaldi://extensions`, or Opera's Extensions page). Find **Short Shifter** and click **Reload** (the circular arrow). Keep Developer mode enabled if needed to see this control.
5. Refresh **every open YouTube tab** so it receives the new content scripts. Open the popup and check your **Shorts visible** setting.
6. Check the version on the extension's card or **Details** page against the release you downloaded. For version **1.0.3**, the extracted folder must include `detection.js`, `motion.js`, `content.js` and the complete `assets` folder, and the manifest must say `1.0.3`.

Reloading the same installation preserves its locally stored visibility preference. Avoid removing and reinstalling it just to upgrade, because removal can clear those settings. There are no automatic updates for this manually installed version.

If the version stays old, confirm that you replaced files in the folder your browser actually loaded, then click Reload again. If the browser reports a missing script, recopy the complete extracted release and check for an extra folder level. If YouTube still behaves like the old release, refresh the tab after reloading the extension.
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

The finite sequence is tested at http://127.0.0.1:8767/tests/animation-regression.html using the actual motion/content scripts and mocked extension APIs.
