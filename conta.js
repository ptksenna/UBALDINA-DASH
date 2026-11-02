/* Conta do jogador — login com Google (Firebase) no visual do jogo. Patraca Games.
   Todo mundo entra com a conta Google antes de jogar. Cada um tem um documento em
   jogadores/{uid} com nome, foto, moedas (começa em 0) e skins (começa vazio).
   Moedas e skins só podem ser mudadas pelo servidor no futuro (regras do Firestore). */
(function(){
'use strict';
var FB={apiKey:"AIzaSyByjCW0jYfJwu8NQ8fgqIXY9_8MfVUT9WQ",authDomain:"ubaldina-dash.firebaseapp.com",projectId:"ubaldina-dash",storageBucket:"ubaldina-dash.firebasestorage.app",messagingSenderId:"44248904835",appId:"1:44248904835:web:4bc8f11c7e8a09b75bd7b6"};
var SDK='https://www.gstatic.com/firebasejs/10.12.2/';
var LS='ub-conta';
function lsGet(){try{return JSON.parse(localStorage.getItem(LS)||'null')}catch(e){return null}}
function lsSet(v){try{if(v)localStorage.setItem(LS,JSON.stringify(v));else localStorage.removeItem(LS)}catch(e){}}
var cache=lsGet();
var C=window.CONTA={user:null,perfil:cache,offline:false,_cb:[],
  onPerfil:function(cb){this._cb.push(cb);if(this.perfil)try{cb(this.perfil)}catch(e){}},
  sair:function(){lsSet(null);C.perfil=null;try{firebase.auth().signOut()}catch(e){}abrir('login')},
  salvarNome:function(n){n=limpa(n);if(!n||!C.user||!C.db||!C.perfil||C.perfil.nome===n)return;C.perfil.nome=n;lsSet(C.perfil);chip();
    C.db.collection('jogadores').doc(C.user.uid).set({nome:n},{merge:true}).catch(function(){})}};
function limpa(n){return String(n||'').toUpperCase().replace(/[^A-Z0-9ÁÂÃÀÉÊÍÓÔÕÚÇ ]/g,'').replace(/\s+/g,' ').trim().slice(0,12)}

/* ---------- visual ---------- */
var css=document.createElement('style');css.textContent=[
'#cg{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:#050806;color:#eafff0;font-family:Rubik,system-ui,-apple-system,"Segoe UI",sans-serif;overflow:auto;-webkit-user-select:none;user-select:none}',
'#cg[hidden]{display:none}',
'#cg::before{content:"";position:fixed;inset:0;background:radial-gradient(ellipse at 50% 120%,rgba(61,255,116,.22),transparent 60%),linear-gradient(rgba(61,255,116,.07) 1px,transparent 1px) 0 0/100% 34px,linear-gradient(90deg,rgba(61,255,116,.07) 1px,transparent 1px) 0 0/34px 100%;pointer-events:none}',
'#cg .cx{position:relative;width:min(420px,100%);text-align:center}',
'#cg .ey{font:500 12px/1.2 Rubik,system-ui,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#3dff74;margin-bottom:10px}',
'#cg h1{font-family:Bungee,Impact,"Arial Black",sans-serif;font-weight:400;font-size:clamp(30px,8vw,46px);line-height:.95;margin:0 0 6px;color:#eafff0;text-shadow:0 0 18px rgba(61,255,116,.35)}',
'#cg h1 em{font-style:normal;color:#3dff74;text-shadow:0 0 14px rgba(61,255,116,.8),0 0 34px rgba(61,255,116,.45)}',
'#cg .cd{margin-top:22px;padding:22px 20px;border:1px solid rgba(61,255,116,.38);border-radius:16px;background:rgba(8,18,11,.9);box-shadow:0 0 0 1px rgba(0,0,0,.6),0 0 40px rgba(61,255,116,.12) inset}',
'#cg p{margin:0 0 16px;font-size:15px;line-height:1.45;color:#b9cfc0}',
'#cg .gb{display:flex;align-items:center;justify-content:center;gap:12px;width:100%;min-height:56px;padding:0 18px;border:2px solid #3dff74;border-radius:12px;background:#0b1a10;color:#eafff0;font:400 16px/1 Bungee,Impact,sans-serif;letter-spacing:.04em;cursor:pointer;box-shadow:0 0 16px rgba(61,255,116,.35);transition:transform .08s,box-shadow .2s,background .2s}',
'#cg .gb:hover{background:#10261a;box-shadow:0 0 26px rgba(61,255,116,.6)}',
'#cg .gb:active{transform:scale(.97)}',
'#cg .gb[disabled]{opacity:.55;cursor:wait}',
'#cg .gb .gi{flex:none;width:30px;height:30px;border-radius:50%;background:#fff;display:grid;place-items:center}',
'#cg .gb.alt{border-color:rgba(234,255,240,.35);box-shadow:none;font-size:13px;min-height:44px;margin-top:10px;background:transparent}',
'#cg .gb.ok{background:#3dff74;color:#03140a}',
'#cg input{width:100%;box-sizing:border-box;min-height:52px;margin:0 0 12px;padding:0 14px;border:2px solid rgba(61,255,116,.5);border-radius:12px;background:#030805;color:#eafff0;font:400 20px/1 Bungee,Impact,sans-serif;text-align:center;letter-spacing:.06em;outline:none;-webkit-user-select:text;user-select:text}',
'#cg input:focus{border-color:#3dff74;box-shadow:0 0 14px rgba(61,255,116,.45)}',
'#cg .er{min-height:18px;margin-top:12px;font-size:13px;color:#ff6b78}',
'#cg .ft{margin-top:14px;font-size:12px;color:#7f968a}',
'#cg .av{width:64px;height:64px;border-radius:50%;border:2px solid #3dff74;box-shadow:0 0 14px rgba(61,255,116,.5);object-fit:cover;margin:0 auto 12px;display:block;background:#0b1a10}',
'#cg .sp{display:inline-block;width:18px;height:18px;border:3px solid rgba(61,255,116,.25);border-top-color:#3dff74;border-radius:50%;animation:cgsp .8s linear infinite;vertical-align:middle}',
'@keyframes cgsp{to{transform:rotate(360deg)}}',
'#cchip{position:fixed;z-index:2147482000;top:max(10px,env(safe-area-inset-top,0px));right:max(10px,env(safe-area-inset-right,0px));display:flex;align-items:center;gap:8px;padding:5px 12px 5px 5px;border:1px solid rgba(61,255,116,.45);border-radius:999px;background:rgba(5,10,7,.9);color:#eafff0;font:700 13px/1 Rubik,system-ui,sans-serif;cursor:pointer;box-shadow:0 0 12px rgba(61,255,116,.25);-webkit-user-select:none;user-select:none}',
'#cchip[hidden]{display:none}',
'#cchip img,#cchip .ai{width:28px;height:28px;border-radius:50%;object-fit:cover;background:#0b1a10;border:1px solid #3dff74;display:grid;place-items:center;font:400 13px Bungee,sans-serif;color:#3dff74}',
'#cchip .mo{color:#ffd23a;font-weight:800}',
'#cmenu{position:fixed;z-index:2147482001;top:calc(max(10px,env(safe-area-inset-top,0px)) + 46px);right:max(10px,env(safe-area-inset-right,0px));min-width:200px;padding:12px;border:1px solid rgba(61,255,116,.45);border-radius:12px;background:rgba(5,10,7,.96);color:#eafff0;font:500 13px/1.4 Rubik,system-ui,sans-serif}',
'#cmenu[hidden]{display:none}',
'#cmenu b{display:block;font:400 15px Bungee,sans-serif;color:#3dff74;margin-bottom:2px}',
'#cmenu small{display:block;color:#9db3a4;margin-bottom:10px}',
'#cmenu button{width:100%;min-height:40px;border:1px solid rgba(255,107,120,.6);border-radius:10px;background:transparent;color:#ff8a94;font:700 13px Rubik,sans-serif;cursor:pointer}'
].join('\n');

var G,CH,MN;
function el(t,a,txt){var e=document.createElement(t);if(a)for(var k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;return e}
var GSVG='<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>';

function montar(){
  if(G)return;document.head.appendChild(css);
  G=el('div',{id:'cg',role:'dialog','aria-modal':'true','aria-label':'Entrar no jogo'});G.hidden=true;
  G.innerHTML='<div class="cx"><div class="ey">Patraca Games</div><h1>RUA <em>UBALDINA</em><br>DASH</h1><div class="cd" id="cgc"></div><div class="ft">A gente só usa seu nome e sua foto do Google.</div></div>';
  document.body.appendChild(G);
  CH=el('button',{id:'cchip',type:'button','aria-label':'Sua conta'});CH.hidden=true;document.body.appendChild(CH);
  MN=el('div',{id:'cmenu'});MN.hidden=true;document.body.appendChild(MN);
  CH.onclick=function(e){e.stopPropagation();MN.hidden=!MN.hidden;if(!MN.hidden)menu()};
  document.addEventListener('click',function(e){if(MN&&!MN.hidden&&!MN.contains(e.target)&&e.target!==CH)MN.hidden=true},true);
  // não deixa o toque na tela de login "vazar" pro jogo por baixo
  ['keydown','keyup','pointerdown','touchstart','mousedown'].forEach(function(t){G.addEventListener(t,function(e){e.stopPropagation()},{passive:true})});
  setInterval(mostrarChip,600);
}
function card(){return document.getElementById('cgc')}
function erro(t){var e=card().querySelector('.er');if(e)e.textContent=t||''}

function abrir(modo,dado){
  montar();G.hidden=false;if(CH)CH.hidden=true;if(MN)MN.hidden=true;var c=card();c.textContent='';
  if(modo==='carregando'){c.innerHTML='<p style="margin:0"><span class="sp"></span>&nbsp; Conectando…</p>';return}
  if(modo==='login'){
    c.appendChild(el('p',null,'Entre com sua conta Google pra jogar. Seu nome, suas vitórias e, em breve, suas moedas e skins ficam salvos na sua conta.'));
    var b=el('button',{class:'gb',type:'button'});b.innerHTML='<span class="gi">'+GSVG+'</span><span>ENTRAR COM GOOGLE</span>';c.appendChild(b);
    c.appendChild(el('div',{class:'er',role:'alert'}));
    b.onclick=function(){entrar(b)};
    if(dado)erro(dado);return}
  if(modo==='nome'){
    if(dado&&dado.foto){var im=el('img',{class:'av',alt:'',referrerpolicy:'no-referrer',src:dado.foto});c.appendChild(im)}
    c.appendChild(el('p',null,'Como vão te chamar na rua?'));
    var i=el('input',{maxlength:'12',autocomplete:'off',autocapitalize:'characters',spellcheck:'false','aria-label':'Seu apelido no jogo'});i.value=limpa(dado&&dado.sugestao);c.appendChild(i);
    var ok=el('button',{class:'gb ok',type:'button'},'BORA JOGAR');c.appendChild(ok);
    c.appendChild(el('div',{class:'er',role:'alert'}));
    i.addEventListener('input',function(){var p=i.selectionStart;i.value=i.value.toUpperCase();try{i.setSelectionRange(p,p)}catch(e){}});
    i.addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Enter')ok.click()});
    ok.onclick=function(){var n=limpa(i.value);if(n.length<2){erro('O apelido precisa de pelo menos 2 letras.');return}criarPerfil(n,ok)};
    setTimeout(function(){try{i.focus()}catch(e){}},150);return}
  if(modo==='offline'){
    c.appendChild(el('p',null,'Sem internet agora, então não deu pra entrar na sua conta.'));
    var t=el('button',{class:'gb',type:'button'},'TENTAR DE NOVO');t.onclick=function(){location.reload()};c.appendChild(t);
    var o=el('button',{class:'gb alt',type:'button'},'Jogar offline (sem salvar)');o.onclick=function(){C.offline=true;fechar()};c.appendChild(o);return}
}
function fechar(){if(G)G.hidden=true;mostrarChip()}

function emMenu(){
  if(G&&!G.hidden)return false;
  var ids=['menu','scr-menu'];
  for(var k=0;k<ids.length;k++){var m=document.getElementById(ids[k]);if(m&&!m.hidden&&m.getClientRects().length&&getComputedStyle(m).visibility!=='hidden'&&+getComputedStyle(m).opacity>0.05)return true}
  return false}
function mostrarChip(){if(!CH)return;var p=C.perfil;var show=!!(p&&C.user)&&emMenu();if(CH.hidden===!show){if(!show&&MN)MN.hidden=true;return}CH.hidden=!show;if(!show&&MN)MN.hidden=true;if(show)chip()}
function chip(){if(!CH||!C.perfil)return;var p=C.perfil;CH.textContent='';
  if(p.foto){var im=el('img',{alt:'',referrerpolicy:'no-referrer',src:p.foto});im.onerror=function(){im.replaceWith(el('span',{class:'ai'},(p.nome||'?')[0]))};CH.appendChild(im)}else CH.appendChild(el('span',{class:'ai'},(p.nome||'?')[0]));
  CH.appendChild(el('span',null,p.nome||''));CH.appendChild(el('span',{class:'mo'},'🪙 '+(p.moedas|0)))}
function menu(){var p=C.perfil||{};MN.textContent='';MN.appendChild(el('b',null,p.nome||''));MN.appendChild(el('small',null,(C.user&&C.user.email)||''));
  MN.appendChild(el('small',null,'Moedas: '+(p.moedas|0)+' · a loja chega em breve'));
  var s=el('button',{type:'button'},'Sair da conta');s.onclick=function(){MN.hidden=true;C.sair()};MN.appendChild(s)}

/* ---------- jogo: põe o apelido no campo de nome ---------- */
function aplicarNome(p){var nm=document.getElementById('nm');if(!nm||!p||!p.nome)return;
  if(nm.value!==p.nome){nm.value=p.nome;try{nm.dispatchEvent(new Event('input',{bubbles:true}))}catch(e){}}
  if(!nm.__conta){nm.__conta=1;nm.addEventListener('change',function(){C.salvarNome(nm.value)})}}
function pronto(p){C.perfil=p;lsSet(p);chip();fechar();C._cb.forEach(function(cb){try{cb(p)}catch(e){}});aplicarNome(p)}

/* ---------- Firebase ---------- */
function carregar(src){return new Promise(function(ok,no){var s=document.createElement('script');s.src=src;s.async=false;s.onload=ok;s.onerror=function(){no(new Error('sdk'))};document.head.appendChild(s)})}
function entrar(b){
  if(!window.firebase||!firebase.auth){abrir('offline');return}
  b.disabled=true;b.querySelector('span:last-child').textContent='ABRINDO O GOOGLE…';erro('');
  var pr=new firebase.auth.GoogleAuthProvider();pr.setCustomParameters({prompt:'select_account'});
  firebase.auth().signInWithPopup(pr).catch(function(e){
    var c=e&&e.code||'';
    if(c==='auth/popup-blocked'||c==='auth/operation-not-supported-in-this-environment'){return firebase.auth().signInWithRedirect(pr)}
    b.disabled=false;b.querySelector('span:last-child').textContent='ENTRAR COM GOOGLE';
    if(c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request')erro('Você fechou a janela do Google. Toque de novo pra entrar.');
    else if(c==='auth/network-request-failed')erro('Sem internet. Confira a conexão e tente de novo.');
    else if(c==='auth/unauthorized-domain')erro('Esse endereço ainda não está liberado no Firebase.');
    else erro('Não deu pra entrar ('+(c||'erro')+'). Tente de novo.')})}
function ref(){return C.db.collection('jogadores').doc(C.user.uid)}
function buscarPerfil(u){
  return ref().get().then(function(d){
    if(!d.exists){abrir('nome',{foto:u.photoURL,sugestao:(cache&&cache.uid===u.uid&&cache.nome)||(u.displayName||'').split(' ')[0]});return}
    var x=d.data();var p={uid:u.uid,nome:x.nome||limpa(u.displayName),foto:x.foto||u.photoURL||'',moedas:x.moedas|0,skins:x.skins||[]};
    pronto(p);
    var up={ultimo:firebase.firestore.FieldValue.serverTimestamp()};if(u.photoURL&&u.photoURL!==x.foto)up.foto=u.photoURL;ref().set(up,{merge:true}).catch(function(){})})}
function criarPerfil(n,b){b.disabled=true;b.textContent='SALVANDO…';var u=C.user;
  var doc={nome:n,foto:u.photoURL||'',moedas:0,skins:[],criado:firebase.firestore.FieldValue.serverTimestamp(),ultimo:firebase.firestore.FieldValue.serverTimestamp()};
  ref().set(doc).then(function(){pronto({uid:u.uid,nome:n,foto:doc.foto,moedas:0,skins:[]})}).catch(function(e){b.disabled=false;b.textContent='BORA JOGAR';erro('Não deu pra salvar ('+(e&&e.code||'erro')+'). Tente de novo.')})}

function iniciar(){
  montar();
  // quem já entrou antes não vê a tela enquanto o Firebase confere a conta
  if(!cache)abrir('carregando');
  var to=setTimeout(function(){if(!window.firebase&&!C.user)abrir('offline')},12000);
  carregar(SDK+'firebase-app-compat.js').then(function(){return carregar(SDK+'firebase-auth-compat.js')}).then(function(){return carregar(SDK+'firebase-firestore-compat.js')}).then(function(){
    clearTimeout(to);
    if(!firebase.apps.length)firebase.initializeApp(FB);
    C.db=firebase.firestore();
    firebase.auth().getRedirectResult().catch(function(e){abrir('login','Não deu pra entrar ('+(e&&e.code||'erro')+').')});
    firebase.auth().onAuthStateChanged(function(u){
      C.user=u||null;
      if(!u){lsSet(null);C.perfil=null;cache=null;abrir('login');return}
      if(cache&&cache.uid!==u.uid)cache=null;
      buscarPerfil(u).catch(function(e){
        // sem internet mas já tinha a conta salva: deixa jogar com o que está guardado
        if(cache&&cache.uid===u.uid){pronto(cache)}else abrir('offline')})})
  }).catch(function(){clearTimeout(to);if(cache){C.offline=true;fechar()}else abrir('offline')})}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
