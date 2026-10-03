# Changelog

## 1.0.1 — 3 October 2026

- Detect Shorts by shelf/card structure, `/shorts/` links and Shorts badges, including landscape thumbnails in watch-page recommendations.
- Rescan recycled recommendation links and dynamically inserted cards; keep covers aligned when cards resize.
- Remove stale covers and avoid duplicate nested covers or self-triggered scan loops.
- Apply visibility preference changes to other open YouTube tabs.
- Preserve ordinary video recommendation cards unless they have an explicit Shorts signal.

Existing portrait-media fallback remains outside ordinary recommendation cards. Covers remain click-through and do not stop playback or audio.
