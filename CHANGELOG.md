## 1.0.4 - 2026-10-08

- Add explicit agent capability, improvement, validation and upstream PR guidance to the README and contributor instructions.

## 1.0.3 — 3 October 2026

- Replace the separate winking face with a transparent, one-shot wink of the original poo illustration, including three intermediate eye positions.
- Keep the same poo centred through three bounces, smooth collapse and final fade; restart each wink independently.

# Changelog

## 1.0.2 — 3 October 2026

- Replace infinite bouncing with three 500 ms bounces, a 650 ms height collapse, a 450 ms wink and a 180 ms fade.
- Keep the poo centred in a separate unclipped layer during collapse; remove it afterwards.
- Restore layout and cancel pending animation when Shorts visibility is turned back on.
- Respect reduced motion by hiding the card without bouncing/collapse motion.


## 1.0.1 — 3 October 2026

- Detect Shorts by shelf/card structure, `/shorts/` links and Shorts badges, including landscape thumbnails in watch-page recommendations.
- Rescan recycled recommendation links and dynamically inserted cards; keep covers aligned when cards resize.
- Remove stale covers and avoid duplicate nested covers or self-triggered scan loops.
- Apply visibility preference changes to other open YouTube tabs.
- Preserve ordinary video recommendation cards unless they have an explicit Shorts signal.

Existing portrait-media fallback remains outside ordinary recommendation cards. Covers remain click-through and do not stop playback or audio.
