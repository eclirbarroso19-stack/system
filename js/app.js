// Inicia o app: rotas por hash, menu e service worker.
import { montarNovaVersao } from "./atualizacao.js";
import { aoAbrir } from "./abertura.js";
import { emModoTeste } from "./nucleo/db.js";
import { lerCacador } from "./nucleo/cacador.js";
import { abrirDia } from "./nucleo/diario.js";
import { iniciarInstalacao } from "./instalacao.js";

import { iniciarErros, mostrarErro } from "./erros.js";

iniciarErros(); // erros globais viram [ERRO DO SISTEMA: ...]
iniciarInstalacao(); // captura beforeinstallprompt cedo, antes de abrir Ajustes

const ROTAS = ["missoes", "status", "ouro", "corpo", "mente", "ajustes", "despertar"];
const PADRAO = "missoes";
const tela = document.getElementById("tela");

// "#despertar/refazer" -> { rota: "despertar", arg: "refazer" }
function rotaAtual() {
  const [r, arg] = location.hash.replace("#", "").split("/");
  return { rota: ROTAS.includes(r) ? r : PADRAO, arg };
}

async function mostrar() {
  let { rota, arg } = rotaAtual();
  try {
    // Sem caçador: o app abre sempre no Despertar, com o menu escondido.
    const existe = !!(await lerCacador());
    if (!existe) {
      rota = "despertar";
      arg = undefined;
    } else if (rota === "despertar" && arg !== "refazer") {
      rota = PADRAO;
    }
    document.body.classList.toggle("sem-menu", rota === "despertar");

    document.querySelectorAll("[data-rota]").forEach((a) => a.classList.toggle("ativo", a.dataset.rota === rota));
    document.getElementById("engrenagem").classList.toggle("ativo", rota === "ajustes");

    const modulo = await import(`./telas/${rota}.js`);
    tela.style.animation = "none";
    void tela.offsetWidth; // reinicia a animação de entrada
    tela.style.animation = "";
    await modulo.montar(tela, arg);
    window.scrollTo(0, 0);
  } catch (erro) {
    tela.textContent = "[ERRO AO CARREGAR A TELA]";
    mostrarErro(erro, "tela " + rota);
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

// Ao voltar do segundo plano: avalia dias que viraram e redesenha as Missões.
document.addEventListener("visibilitychange", async () => {
  if (document.hidden) return;
  await abrirDia().catch(() => {});
  if (rotaAtual().rota === "missoes") mostrar();
});
mostrar();
aoAbrir();

if ("serviceWorker" in navigator) {
  montarNovaVersao();
}
