// 말랑블록 오프라인 실행 — 한 번 열면 저장해 두고, 인터넷이 없어도 저장본으로 실행
const CACHE='mallang-puzzle-5';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('mallang-puzzle')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
// 인터넷이 되면 (브라우저 보관본 말고) 서버에서 새 판을 확인해 받아 저장, 안 되면 저장본
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;})
  .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));});