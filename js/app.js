// Inicia o app: rotas por hash, menu e service worker.
import { montarNovaVersao } from "./atualizacao.js";

import { emModoTeste } from "./nucleo/db.js";

const ROTAS = ["missoes", "status", "ouro", "corpo", "mente", "ajustes"];
const PADRAO = "missoes";
const tela = document.getElementById("tela");

function rotaAtual() {
  const r = location.hash.replace("#", "");
  return ROTAS.includes(r) ? r : PADRAO;
}

async function mostrar() {
  const rota = rotaAtual();
  document.querySelectorAll("[data-rota]").forEach((a) => a.classList.toggle("ativo", a.dataset.rota === rota));
  document.getElementById("engrenagem").classList.toggle("ativo", rota === "ajustes");
  try {
    const modulo = await import(`./telas/${rota}.js`);
    tela.style.animation = "none";
    void tela.offsetWidth; // reinicia a animação de entrada
    tela.style.animation = "";
    await modulo.montar(tela);
    window.scrollTo(0, 0);
  } catch (erro) {
    console.error(erro);
    tela.textContent = "[ERRO AO CARREGAR A TELA]";
  }
}

if (emModoTeste()) {
  document.body.classList.add("modo-teste");
  const faixa = document.createElement("div");
  faixa.className = "faixa-teste";
  faixa.textContent = "MODO DE TESTE";
  document.body.prepend(faixa);
}

window.addEventListener("hashchange", mostrar);
mostrar();

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().catch(() => {});
}

if ("serviceWorker" in navigator) {
  montarNovaVersao();
}
