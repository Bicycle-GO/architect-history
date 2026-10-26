import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { buildings, eras, regions, sources, glossary, questions } from '../dist/data.js';
import { routes, dimensions, classification, recordsFor, recordURL } from '../dist/catalog.js';
import { collectionListing, searchContent } from '../dist/views.js';
const root=new URL('../dist/',import.meta.url);
assert.equal(new Set(buildings.map(b=>b.id)).size,buildings.length,'Unique record IDs');
assert.equal(new Set(sources.map(s=>s.id)).size,sources.length,'Unique source IDs');
for(const era of eras.filter(e=>e.id!=='all'))assert(buildings.some(b=>b.era===era.id),'Missing era '+era.id);
for(const region of regions)assert(buildings.some(b=>b.region===region.id),'Missing region '+region.id);
for(const b of buildings){
 for(const key of ['id','title','era','region','date','summary','material','structure','space','culture','point','caution','image'])assert.equal(typeof b[key],'string',b.id+' '+key);
 assert(eras.some(e=>e.id===b.era));
 assert(['outside','multiple'].includes(b.region)||regions.some(r=>r.id===b.region));
 assert(b.sources.length>0);
 for(const id of b.sources)assert(sources.some(s=>s.id===id),'Unknown source '+id);
}
for(const s of sources)assert.equal(new URL(s.url).protocol,'https:');
for(const [, ,id] of glossary)assert(sources.some(s=>s.id===id));
for(const q of questions)assert(q.answer>=0&&q.answer<q.options.length);
const credits=JSON.parse(await readFile(new URL('assets/credits.json',root),'utf8'));
const images=['hero',...new Set(buildings.filter(b=>['amsa','dolmen','mireuk','bulguk','buseok','changdeok','hahoe','jeju','station','ddp'].includes(b.image)).map(b=>b.image))];
for(const id of images){assert((await stat(new URL('assets/'+id+'.jpg',root))).size>1000,'Image '+id);assert(credits.some(c=>c.id===id&&c.license&&c.artist&&c.source),'Credit '+id);}
console.log(`Verified ${buildings.length} records, ${eras.length-1} eras, ${regions.length} regions, ${sources.length} institutional sources, ${images.length} credited images, ${questions.length} quiz questions.`);
for(const id of images){
 const bytes=await readFile(new URL('assets/'+id+'.jpg',root));
 assert(!bytes.includes(Buffer.from('Exif\0\0')),'Deployment photos must omit EXIF: '+id);
 assert(!bytes.includes(Buffer.from('http://ns.adobe.com/xap/1.0/')),'Deployment photos must omit XMP: '+id);
}

// Every menu and detail link must lead to a real HTML document.
assert.equal(new Set(routes.map(r=>r.path)).size,routes.length,'Unique page URLs');
for(const b of buildings){
 const c=classification[b.id];assert(c,'Missing classification '+b.id);
 assert(c.functions.length>0);
 for(const id of c.functions)assert(dimensions.functions.categories.some(f=>f.id===id));
 assert(dimensions.types.categories.some(t=>t.id===c.type));
 assert(routes.some(r=>r.path===recordURL(b.id)));
}
for(const [dimension,d] of Object.entries(dimensions)){
 for(const c of d.categories)assert(recordsFor(dimension,c.id).length>0,'Empty category '+dimension+'/'+c.id);
}
const targets=new Set();
const build=JSON.parse(await readFile(new URL('build-manifest.json',root),'utf8'));
for(const route of routes){
 const file=route.path==='/404.html'?'404.html':route.path.slice(1)+'index.html';
 const html=await readFile(new URL(file,root),'utf8');
 assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,'One page heading: '+route.path);
 assert(html.includes('data-route='),'Page context: '+route.path);
 assert(html.includes('/multipage-app.js'),'Shared page behavior: '+route.path);
 assert(html.includes(`/runtime/${build.buildId}/shell.js`),'Independent navigation shell: '+route.path);
 assert(html.includes('id="site-sidebar"')&&html.includes('data-nav-toggle'),'Collapsible left panel: '+route.path);
 assert(!html.includes('id="main-navigation"'),'Remove former top menu: '+route.path);
 assert(!html.includes('<base '),'Page-local anchors must stay on the current page: '+route.path);
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,'Duplicate element/SVG ID: '+route.path);
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=match[1].replace(/&amp;/g,'&');
  if(href.startsWith('#')||/^https?:/.test(href))continue;
  const url=new URL(href,'https://gieok.test/');
  assert.equal(url.origin,'https://gieok.test','Internal URL origin');
  assert(!['#timeline','#regions','#compare','#library'].includes(url.hash),'Avoid former single-page navigation');
  targets.add(decodeURIComponent(url.pathname));
 }
}
for(const pathname of targets){const file=pathname.endsWith('/')?pathname.slice(1)+'index.html':pathname.slice(1);assert((await stat(new URL(file,root))).isFile(),'Missing linked page or asset '+pathname);}
for(const asset of build.assets){
 const bytes=await readFile(new URL(asset.path.slice(1),root));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256,'Asset fingerprint '+asset.path);
 if(asset.path.endsWith('.js')){
  const code=bytes.toString('utf8');
  for(const match of code.matchAll(/from\s+['"]([^'"]+)['"]/g)){
   if(!match[1].startsWith('.'))continue;
   assert((await stat(new URL(match[1],new URL(asset.path.slice(1),root)))).isFile(),'Missing browser module import '+match[1]);
  }
 }
}
const pageTwo=collectionListing({dimension:'regions',id:'capital'},'page=2');
assert(pageTwo.includes('aria-current="page">2'),'Pagination selects page 2');
const scoped=collectionListing({dimension:'regions',id:'capital'},'era=joseon');
assert(scoped.includes('서울 창덕궁')&&!scoped.includes('data-record-id="ddp"'),'Era filter stays inside the current region');
const search=searchContent('q='+encodeURIComponent('주심포'));
assert(search.includes('영주 부석사 무량수전')&&search.includes('안동 봉정사 극락전'),'Search across structural terms');
console.log(`Verified ${routes.length} HTML pages and ${targets.size} linked internal destinations; category coverage, scoped filtering and pagination passed.`);
