import { el } from "../ui.js";
import { VERSAO_APP } from "../config.js";
import { avisos } from "../textos.js";

export async function montar(elemento) {
  elemento.replaceChildren(
    el("h1", { class: "titulo-tela", texto: "AJUSTES" }),
    el("div", { class: "cartao" }, [el("div", { texto: `SYSTEM · versão ${VERSAO_APP}` })]),
    el("p", { class: "aviso", texto: avisos.geral + "." }),
  );
}
