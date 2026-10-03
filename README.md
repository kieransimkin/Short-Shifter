# Short Shifter

Cover portrait-format YouTube media with a bouncing, winking poo.

Short Shifter detects approximately 9:16 media (±5% tolerance). With **Shorts visible** switched off, matching media gets a dark, click-through overlay. This is a visual cover: it does not stop playback, audio or navigation, and portrait videos that are not Shorts may also match. Your preference is stored locally. The extension contains no analytics or remote runtime service.

## Free installation in desktop Brave or Chrome

1. Download `short-shifter-1.0.0-chrome.zip` from the GitHub Releases page and extract it to a permanent folder.
2. Open `brave://extensions` or `chrome://extensions`.
3. Turn on **Developer mode**, select **Load unpacked**, and choose the extracted folder containing `manifest.json`.
4. Open YouTube and use the extension popup to switch **Shorts visible** on or off.

Keep the extracted folder in place. Updates are manual: download and extract a new release, then reload the extension. This project is not currently listed in a browser store. Desktop installation has not yet been manually verified in Brave.

## Development

Requires Node.js 24. No npm dependencies or image-conversion tools are required; PNG icons are included.

```sh
npm test
npm run check
npm run build
```

Load `dist/` as an unpacked extension. The build creates a Chrome/Brave manifest without Firefox-specific metadata.

## Privacy and permissions

The extension uses local `storage` for the visibility preference and host access limited to YouTube. Detection runs locally on the page. It does not send browsing activity or preferences to a server.

## Release

GitHub Actions checks the JavaScript, runs tests and builds the extension. Version tags create a downloadable GitHub release. Store submission is a separate step and requires the store's developer account and review.

## Licence

MIT. Not affiliated with YouTube, Google or Brave.