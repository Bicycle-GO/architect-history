import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('./dist/', import.meta.url));
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.json':'application/json; charset=utf-8' };
const server = http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let target = path.resolve(root, '.' + pathname);
    const relative = path.relative(root, target);
    if (relative.startsWith('..') || path.isAbsolute(relative)) { res.writeHead(403); res.end(); return; }
    let info = await stat(target);
    if (info.isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(308, {'Location':pathname+'/'+new URL(req.url,'http://localhost').search}); res.end(); return; }
      target = path.join(target,'index.html');
      info = await stat(target);
    }
    if (!info.isFile()) throw new Error('Not a file');
    res.writeHead(200, {'Content-Type':types[path.extname(target)] || 'application/octet-stream','Cache-Control':'no-cache'});
    res.end(await readFile(target));
  } catch { res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'}); try {res.end(await readFile(path.join(root,'404.html')));} catch {res.end('Not found');} }
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${server.address().port}`));
