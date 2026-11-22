// Tela STATUS: ficha do caçador, radar, áreas e atributos.
import { el, barra } from "../ui.js";
import { lerCacador } from "../nucleo/cacador.js";
import { nivelDe, AREAS } from "../nucleo/regras.js";
import { perguntasDespertar } from "../textos.js";
import { radar } from "../radar.js";

const NOMES_ATRIBUTO = {
  forca: "FORÇA", agilidade: "AGILIDADE", vitalidade: "VITALIDADE", financas: "FINANÇAS",
  disciplina: "DISCIPLINA", inteligencia: "INTELIGÊNCIA", carisma: "CARISMA", espirito: "ESPÍRITO",
};

function linhaBarra(rotulo, valorTexto, barraEl) {
  return el("div", { class: "linha-barra" }, [
    el("div", { class: "linha-ajuste" }, [el("span", { texto: rotulo }), el("strong", { texto: valorTexto })]),
    barraEl,
  ]);
}

export async function montar(elemento) {
  const c = await lerCacador();
  if (!c) { elemento.textContent = ""; return; }
  const { nivel, xpNoNivel, xpParaProximo } = nivelDe(c.xpTotal);

  const ficha = el("div", { class: "cartao ficha" }, [
    el("div", { class: "ficha-topo" }, [
      el("div", { class: "rank-gigante", texto: c.rankCacador, "aria-label": `Rank ${c.rankCacador}` }),
      el("div", {}, [
        el("div", { class: "ficha-nome", texto: c.nome }),
        el("div", { class: "ficha-classe", texto: `${c.classe} · Nível ${nivel}` }),
        el("div", { class: "ficha-titulo", texto: c.titulo }),
      ]),
    ]),
    linhaBarra("XP", `${xpNoNivel}/${xpParaProximo}`, barra(xpNoNivel, xpParaProximo, "xp")),
    linhaBarra("HP", `${c.hp}/100`, barra(c.hp, 100, "hp")),
    linhaBarra("MP", "—", barra(0, 100, "mp")),
    el("div", { class: "linha-ajuste" }, [el("span", { texto: "💎 Cristais de Mana" }), el("strong", { texto: String(c.cristais) })]),
    el("div", { class: "linha-ajuste" }, [el("span", { texto: "Pontos de Foco" }), el("strong", { texto: String(c.pontosFoco) })]),
    el("p", { class: "aviso", texto: "A distribuição dos Pontos de Foco chega numa versão futura." }),
  ]);

  const notas = Object.fromEntries(AREAS.map((a) => [a, c.ranksArea[a]?.nota ?? 0]));
  const areas = el("div", { class: "cartao" }, AREAS.map((a) => {
    const p = perguntasDespertar.find((q) => q.area === a);
    const r = c.ranksArea[a];
    return el("div", { class: "linha-ajuste" }, [
      el("span", { texto: `${p.emoji} ${p.nome}` }),
      el("span", {}, [
        el("strong", { texto: r ? `RANK ${r.rank}` : "—" }),
        ...(r && r.provisorio ? [el("span", { class: "tag", texto: "PROVISÓRIO" })] : []),
      ]),
    ]);
  }));

  const atributos = el("div", { class: "cartao" }, Object.keys(NOMES_ATRIBUTO).map((k) => {
    const v = c.atributos[k];
    return el("div", { class: "linha-ajuste" }, [
      el("span", { texto: NOMES_ATRIBUTO[k] }),
      el("strong", { class: v === null || v === undefined ? "apagado" : "", texto: v === null || v === undefined ? "não medido" : String(v) }),
    ]);
  }));

  elemento.replaceChildren(
    el("h1", { class: "titulo-tela", texto: "STATUS" }),
    ficha,
    el("div", { class: "cartao" }, [radar(notas)]),
    el("h2", { class: "subtitulo azul", texto: "ÁREAS" }),
    areas,
    el("h2", { class: "subtitulo azul", texto: "ATRIBUTOS" }),
    atributos,
  );
}
