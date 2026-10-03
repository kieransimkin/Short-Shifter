"use strict";
// Finite, local choreography. No music clock or shared site dependencies.
globalThis.ShortShifterMotion = class {
  constructor(host, mascot, position) {
    this.host = host; this.mascot = mascot; this.position = position;
    this.cancelled = false; this.animations = new Set();
    this.saved = new Map();
    this.inert = host.inert;
    this.phase = 'bounce';
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.done = this.run().catch(error => {
      if (!this.cancelled) { console.error('Short Shifter animation failed', error); this.finish(); }
    });
  }
  set(property, value, priority = '') {
    if (!this.saved.has(property)) this.saved.set(property, [this.host.style.getPropertyValue(property), this.host.style.getPropertyPriority(property)]);
    this.host.style.setProperty(property, value, priority);
  }
  async animate(element, frames, options) {
    if (this.cancelled) return;
    const animation = element.animate(frames, options);
    this.animations.add(animation);
    try { await animation.finished; } finally { this.animations.delete(animation); animation.cancel(); }
  }
  track = () => {
    if (this.cancelled || this.phase === 'hidden') return;
    this.position();
    this.frame = requestAnimationFrame(this.track);
  };
  async run() {
    this.mascot.dataset.phase = this.phase;
    this.track();
    const poo = this.mascot.querySelector('.short-shifter-poo');
    if (!this.reduced) await this.animate(poo,
      [{ transform: 'translateY(0)' }, { transform: 'translateY(-16px)', offset: .5 }, { transform: 'translateY(0)' }],
      { duration: 500, iterations: 3, easing: 'ease-in-out' });
    if (this.cancelled) return;
    this.phase = 'collapse'; this.mascot.dataset.phase = this.phase;
    const rect = this.host.getBoundingClientRect();
    const css = getComputedStyle(this.host);
    const initial = { height: `${rect.height}px`, paddingTop: css.paddingTop, paddingBottom: css.paddingBottom,
      marginTop: css.marginTop, marginBottom: css.marginBottom, borderTopWidth: css.borderTopWidth, borderBottomWidth: css.borderBottomWidth };
    this.set('height', `${rect.height}px`);
    this.set('box-sizing', 'border-box', 'important');
    this.set('min-height', '0px', 'important'); this.set('max-height', 'none', 'important');
    this.set('overflow', 'hidden', 'important');
    this.host.inert = true;
    if (!this.reduced) await this.animate(this.host,
      [initial, { height: '0px', paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '0px', borderTopWidth: '0px', borderBottomWidth: '0px' }],
      { duration: 650, easing: 'ease-in-out', fill: 'forwards' });
    if (this.cancelled) return;
    for (const property of ['height','max-height','padding-top','padding-bottom','margin-top','margin-bottom','border-top-width','border-bottom-width']) this.set(property, '0px', 'important');
    this.position();
    this.phase = 'wink'; this.mascot.dataset.phase = this.phase;
    // Put the wink inside the same centred glyph box, not beside the poo.
    const face = this.mascot.querySelector('.short-shifter-face');
    if (!this.reduced) {
      await this.animate(face, [{ opacity: 0 }, { opacity: 1, offset: .15 }, { opacity: 1, offset: .85 }, { opacity: 0 }], { duration: 450 });
      if (!this.cancelled) await this.animate(this.mascot, [{ opacity: 1 }, { opacity: 0 }], { duration: 180 });
    }
    if (!this.cancelled) this.finish();
  }
  finish() {
    this.phase = 'hidden'; cancelAnimationFrame(this.frame);
    this.mascot.remove();
    this.set('display', 'none', 'important');
  }
  restore() {
    this.cancelled = true;
    cancelAnimationFrame(this.frame);
    for (const animation of this.animations) animation.cancel();
    this.animations.clear(); this.mascot.remove();
    for (const [property, [value, priority]] of this.saved) {
      if (value) this.host.style.setProperty(property, value, priority);
      else this.host.style.removeProperty(property);
    }
    this.host.inert = this.inert;
  }
};
