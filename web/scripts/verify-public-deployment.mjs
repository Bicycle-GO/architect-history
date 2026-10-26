import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {routes} from '../dist/catalog.js';

// Public production verification: no credentials or authentication changes.
const origin = new URL(process.argv[2] || 'https://architect-history.vercel.app');
assert((origin.protocol === 'https:' && origin.hostname.endsWith('.vercel.app')) ||
  (origin.protocol === 'http:' && origin.hostname === '127.0.0.1'), 'Use a Vercel or local preview URL');
const root = new URL('../dist/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('build-manifest.json', root), 'utf8'));
const paths = routes.filter(r => r.kind !== 'notfound').map(r => ({path:r.path, kind:'html'}));
const media = new Set(['/assets/favicon.svg']);
for(const route of routes){
  const file = route.path === '/404.html' ? '404.html' : route.path.slice(1) + 'index.html';
  const html = await readFile(new URL(file, root), 'utf8');
  for(const match of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) media.add(match[1]);
}
for(const asset of manifest.assets) paths.push({...asset, kind:'asset'});
for(const path of media){
  assert(path.startsWith('/assets/'), 'Use local media assets: ' + path);
  const bytes = await readFile(new URL(path.slice(1), root));
  paths.push({path, kind:'image', sha256:createHash('sha256').update(bytes).digest('hex')});
}
paths.push({path:'/__missing-page-check__/', kind:'notfound'});
for(const path of ['/types','/regions/jeju','/buildings/changdeok']) paths.push({path,kind:'redirect'});
const failures=[];
let index=0,passed=0;
async function worker(){
  while(index < paths.length){
    const item=paths[index++];
    try{
      const response=await fetch(new URL(item.path,origin),{redirect:'manual',signal:AbortSignal.timeout(30000)});
      if(item.kind==='redirect'){
        assert([301,307,308].includes(response.status), 'Expected canonical redirect, HTTP '+response.status);
        assert.equal(new URL(response.headers.get('location'),origin).pathname,item.path+'/');
        passed++;continue;
      }
      assert.equal(response.status,item.kind==='notfound'?404:200,'HTTP '+response.status);
      const mime=response.headers.get('content-type')||'';
      const bytes=Buffer.from(await response.arrayBuffer());
      if(item.kind==='html'||item.kind==='notfound'){
        assert(mime.includes('text/html'),'Incorrect HTML MIME: '+mime);
        const html=bytes.toString('utf8');
        assert(html.includes('data-build="'+manifest.buildId+'"'),'Page is stale or missing');
        assert(html.includes('id="site-sidebar"'),'Navigation shell is missing');
        if(item.kind==='notfound') assert(html.includes('이 페이지를 찾을 수 없습니다.'),'Custom recovery page is missing');
      }else{
        assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256,'Asset differs from the tested source');
        if(item.kind==='image') assert(mime.startsWith('image/'),'Incorrect image MIME: '+mime);
        else if(item.path.endsWith('.js')) assert(mime.includes('javascript'),'Incorrect JS MIME: '+mime);
        else if(item.path.endsWith('.css')) assert(mime.includes('text/css'),'Incorrect CSS MIME: '+mime);
      }
      passed++;
    }catch(error){failures.push({path:item.path,error:error.message});}
  }
}
await Promise.all(Array.from({length:4},worker));
console.log(JSON.stringify({origin:origin.origin,buildId:manifest.buildId,checked:paths.length,passed,images:media.size,failures},null,2));
process.exitCode=failures.length?1:0;
