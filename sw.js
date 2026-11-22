// Service worker do SYSTEM: cache-first, versionado.
// VERSAO_APP deve ser igual à de js/config.js (um teste confere).
const VERSAO_APP = "0.1.1";
const CACHE = `system-v${VERSAO_APP}`;

const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/estilo.css",
  "./js/app.js",
  "./js/atualizacao.js",
  "./js/config.js",
  "./js/textos.js",
  "./js/ui.js",
  "./js/nucleo/dia.js",
  "./js/telas/missoes.js",
  "./js/telas/status.js",
  "./js/telas/ouro.js",
  "./js/telas/corpo.js",
  "./js/telas/mente.js",
  "./js/telas/ajustes.js",
  "./lib/chart.umd.min.js",
  "./fontes/audiowide-400.woff2",
  "./fontes/rajdhani-500.woff2",
  "./fontes/rajdhani-700.woff2",
  "./icones/icon-192.png",
  "./icones/icon-512.png",
  "./design/logo-system.svg",
];

self.addEventListener("install", (evento) => {
  // Sem skipWaiting: a versão nova espera a mensagem PULAR_ESPERA.
  evento.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)));
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n.startsWith("system-v") && n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (evento) => {
  if (evento.data && evento.data.tipo === "PULAR_ESPERA") self.skipWaiting();
});

self.addEventListener("fetch", (evento) => {
  if (evento.request.method !== "GET") return;
  evento.respondWith(
    caches.match(evento.request).then((guardado) => {
      if (guardado) return guardado;
      return fetch(evento.request).then((resposta) => {
        if (resposta.ok && new URL(evento.request.url).origin === location.origin) {
          const copia = resposta.clone();
          caches.open(CACHE).then((c) => c.put(evento.request, copia));
        }
        return resposta;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
