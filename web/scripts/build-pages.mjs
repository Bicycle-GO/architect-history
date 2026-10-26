import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { routes } from '../dist/catalog.js';
import { header, sidebar, footer, renderPage } from '../dist/views.js';
import { esc } from '../dist/components.js';

const root=new URL('../dist/',import.meta.url);
const credits=JSON.parse(await readFile(new URL('assets/credits.json',root),'utf8'));
const runtimeFiles=['multipage-app.js','shell.js','views.js','navigation.js','catalog.js','components.js','data.js','styles.css','multipage.css','sidebar.css'];
// Git normalizes text to LF; use the same bytes on Windows and Vercel/Linux.
const contents=await Promise.all(runtimeFiles.map(async file=>Buffer.from((await readFile(new URL(file,root),'utf8')).replace(/\r\n?/g,'\n'),'utf8')));
const digest=createHash('sha256');
runtimeFiles.forEach((file,i)=>digest.update(file).update(contents[i]));
const buildId=digest.digest('hex').slice(0,16);
const runtimePath=`/runtime/${buildId}/`;
const runtimeRoot=new URL(`runtime/${buildId}/`,root);
await mkdir(runtimeRoot,{recursive:true});
const assets=[];
for(let i=0;i<runtimeFiles.length;i++){
 await writeFile(new URL(runtimeFiles[i],runtimeRoot),contents[i]);
 assets.push({path:runtimePath+runtimeFiles[i],sha256:createHash('sha256').update(contents[i]).digest('hex')});
}
for(const route of routes){
 const description=route.kind==='record'?'시기·재료·구조·공간·문화와 원자료를 함께 읽는 한국 건축 기록.':'시대별, 지역별, 기능별, 종류별 독립 페이지에서 한국의 건축과 생활문화를 탐색하고 비교하세요.';
 const html=`<!doctype html>
<html lang="ko">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <meta name="theme-color" content="#f7f6f2">
 <meta name="description" content="${esc(description)}">
 <meta property="og:title" content="${esc(route.title)}">
 <meta property="og:description" content="${esc(description)}">
 <title>${esc(route.title)}</title>
 <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
 <link rel="preconnect" href="https://fonts.googleapis.com">
 <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;450;500;550;600;650;700;800&family=Noto+Serif+KR:wght@400;500;600;700&display=swap" rel="stylesheet">
 <link rel="stylesheet" href="${runtimePath}styles.css">
 <link rel="stylesheet" href="${runtimePath}multipage.css">
 <link rel="stylesheet" href="${runtimePath}sidebar.css">
 <script defer src="${runtimePath}shell.js"></script>
 <script type="module" src="${runtimePath}multipage-app.js"></script>
</head>
<body data-route="${esc(JSON.stringify(route))}" data-build="${buildId}">
 <a class="skip-link" href="#main">본문으로 건너뛰기</a>
 ${sidebar(route)}
 <div id="site-frame" class="site-frame">
  <header id="header">${header(route)}</header>
  <div class="wrap"><div id="page-status" class="page-status" role="status" hidden></div></div>
  <main id="main" tabindex="-1">${renderPage(route,'',credits)}</main>
  <footer id="footer">${footer()}</footer>
 </div>
 <div id="toast" role="status" aria-live="polite"></div>
</body>
</html>
`;
 const target=new URL(route.path==='/404.html'?'404.html':route.path.slice(1)+'index.html',root);
 await mkdir(new URL('./',target),{recursive:true});
 await writeFile(target,html);
}
await writeFile(new URL('page-manifest.json',root),JSON.stringify(routes,null,2));
await writeFile(new URL('build-manifest.json',root),JSON.stringify({buildId,assets},null,2));
console.log(`Generated ${routes.length} independent HTML pages, including ${routes.filter(r=>r.kind==='collection').length} category pages and ${routes.filter(r=>r.kind==='record').length} record pages.`);
