// Service worker do Rua Ubaldina Dash: deixa o jogo abrir como app e funcionar offline.
const V='ubaldina-v11';
const BASE=['./','index.html','flavio.html','guerra.html','conta.js','manifest.json','icon-192.png','icon-512.png','icon-maskable.png','apple-touch-icon.png'];
// Ubaldina Fighter inteiro (página + imagens) pra lutar sozinho sem internet
const LUTA=['luta/','luta/img/bar.jpg','luta/img/bar_p.jpg','luta/img/bus.png','luta/img/bus_r.png','luta/img/c1/block.png','luta/img/c1/crouch.png','luta/img/c1/fireball.png','luta/img/c1/highkick.png','luta/img/c1/hit.png','luta/img/c1/idle.png','luta/img/c1/jab.png','luta/img/c1/jump.png','luta/img/c1/ko.png','luta/img/c1/lowkick.png','luta/img/c1/punch.png','luta/img/c1/special.png','luta/img/c1/walk.png','luta/img/c1/win.png','luta/img/c1/winbig.png','luta/img/c2/block.png','luta/img/c2/crouch.png','luta/img/c2/fireball.png','luta/img/c2/highkick.png','luta/img/c2/hit.png','luta/img/c2/idle.png','luta/img/c2/jab.png','luta/img/c2/jump.png','luta/img/c2/ko.png','luta/img/c2/lowkick.png','luta/img/c2/punch.png','luta/img/c2/special.png','luta/img/c2/walk.png','luta/img/c2/win.png','luta/img/c2/winbig.png','luta/img/c3/block.png','luta/img/c3/crouch.png','luta/img/c3/highkick.png','luta/img/c3/hit.png','luta/img/c3/idle.png','luta/img/c3/jab.png','luta/img/c3/jump.png','luta/img/c3/ko.png','luta/img/c3/lowkick.png','luta/img/c3/punch.png','luta/img/c3/special.png','luta/img/c3/walk.png','luta/img/c3/win.png','luta/img/c3/winbig.png','luta/img/c4/block.png','luta/img/c4/crouch.png','luta/img/c4/fireball.png','luta/img/c4/highkick.png','luta/img/c4/hit.png','luta/img/c4/idle.png','luta/img/c4/jab.png','luta/img/c4/jump.png','luta/img/c4/ko.png','luta/img/c4/lowkick.png','luta/img/c4/punch.png','luta/img/c4/special.png','luta/img/c4/walk.png','luta/img/c4/win.png','luta/img/c4/winbig.png','luta/img/muro.jpg','luta/img/muro_p.jpg','luta/img/praca.jpg','luta/img/praca_p.jpg','luta/img/rua.jpg','luta/img/rua_p.jpg','luta/img/sel/c1.jpg','luta/img/sel/c2.jpg','luta/img/sel/c3.jpg','luta/img/sel/c4.jpg','luta/img/sel/mapa.jpg'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js'];
const abs=p=>new URL(p,location).href;
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(BASE).then(()=>Promise.all(LUTA.concat(CDN).map(p=>c.add(p).catch(()=>{}))))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  const mesmo=u.origin===location.origin,cdn=/(^|\.)(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|www\.gstatic\.com)$/.test(u.hostname);
  if(!mesmo&&!cdn)return;                       // salas online (PeerJS), login e Firebase passam direto
  if(r.mode==='navigate'||(mesmo&&/\/(index\.html)?$/.test(u.pathname))){
    // página do jogo: tenta a internet primeiro (pega atualizações), senão usa a cópia salva
    // cada página fica salva pelo caminho completo (index, luta/, flavio, guerra), sem misturar
    const nome=abs(u.pathname.endsWith('/')?u.pathname+'index.html':u.pathname);
    e.respondWith(fetch(r.url,{cache:'no-cache',credentials:'same-origin'}).then(x=>{if(x&&x.ok){const c=x.clone();caches.open(V).then(h=>h.put(nome,c))}return x}).catch(()=>caches.match(nome).then(h=>h||caches.match(abs(u.pathname)).then(h2=>h2||caches.match(abs('index.html'))))));return}
  e.respondWith(caches.match(r,{ignoreSearch:mesmo}).then(h=>h||fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque')){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x})));
});
