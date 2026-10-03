import test from 'node:test';
import assert from 'node:assert/strict';
import '../extension/detection.js';
const {isShortsUrl,isNearNineBySixteen} = globalThis.ShortShifterDetection;
for (const href of ['/shorts/abc','/shorts/abc?feature=share','https://www.youtube.com/shorts/abc','https://m.youtube.com/shorts/abc/']) {
  test(`recognises Short ${href}`,()=>assert.equal(isShortsUrl(href),true));
}
for (const href of ['/watch?v=abc','/shorts','/channel/shorts','https://example.com/shorts/abc','/redirect?q=/shorts/abc','/shorts/abc/more']) {
  test(`rejects non-Short ${href}`,()=>assert.equal(isShortsUrl(href),false));
}
test('actual production ratio check rejects landscape and empty dimensions',()=>{
  assert.equal(isNearNineBySixteen(90,160),true);
  assert.equal(isNearNineBySixteen(160,90),false);
  assert.equal(isNearNineBySixteen(0,160),false);
});
