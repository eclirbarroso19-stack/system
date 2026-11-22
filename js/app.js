// Inicia o app: rotas por hash, menu e service worker.
import { montarNovaVersao } from "./atualizacao.js";

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

window.addEventListener("hashchange", mostrar);
mostrar();

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().catch(() => {});
}

if ("serviceWorker" in navigator) {
  montarNovaVersao();
}
