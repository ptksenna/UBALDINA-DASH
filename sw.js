// Service worker do Rua Ubaldina Dash: deixa o jogo abrir como app e funcionar offline.
const V='ubaldina-v1';
const BASE=['./','index.html','manifest.json','icon-192.png','icon-512.png','icon-maskable.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  const mesmo=u.origin===location.origin,cdn=/(^|\.)(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)$/.test(u.hostname);
  if(!mesmo&&!cdn)return;                       // salas online (PeerJS) passam direto
  if(r.mode==='navigate'||(mesmo&&/\/(index\.html)?$/.test(u.pathname))){
    // pagina do jogo: tenta a internet primeiro (pega atualizacoes), senao usa a copia salva
    e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put('index.html',c));return x}).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque')){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x})));
});
