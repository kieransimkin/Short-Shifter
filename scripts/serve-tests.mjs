import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
createServer(async(req,res)=>{
 try {
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if (!/^\/(tests|extension)\//.test(pathname)) {res.writeHead(404).end();return;}
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':'text/html');
  res.end(await readFile(file));
 } catch {res.writeHead(404).end();}
}).listen(8767,'127.0.0.1',()=>console.log('Regression fixture: http://127.0.0.1:8767/tests/browser-regression.html'));
