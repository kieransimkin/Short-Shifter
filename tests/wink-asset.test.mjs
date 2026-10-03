import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('wink GIF is transparent, multi-frame and has no looping extension',async()=>{
 const gif=await readFile(new URL('../extension/assets/poo-wink-once.gif',import.meta.url));
 assert.equal(gif.subarray(0,6).toString(),'GIF89a');
 assert.equal(gif.readUInt16LE(6),256); assert.equal(gif.readUInt16LE(8),256);
 assert.ok(!gif.includes(Buffer.from('NETSCAPE2.0'))&&!gif.includes(Buffer.from('ANIMEXTS1.0')));
 const controls=[];
 for(let i=0;i<gif.length-7;i++)if(gif[i]===0x21&&gif[i+1]===0xf9&&gif[i+2]===4){controls.push({transparent:!!(gif[i+3]&1),delay:gif.readUInt16LE(i+4)});}
 assert.equal(controls.length,5); assert.ok(controls.every(c=>c.transparent));
 assert.equal(controls.reduce((sum,c)=>sum+c.delay,0),56);
});

