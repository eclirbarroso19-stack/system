import { sistema } from "./textos.js";
import { corDoRank } from "./nucleo/regras.js";

// Componentes reutilizáveis da interface.

export function el(tag, atributos = {}, filhos = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(atributos)) {
    if (k === "class") e.className = v;
    else if (k === "texto") e.textContent = v;
    else e.setAttribute(k, v);
  }
  for (const f of [].concat(filhos)) e.append(f);
  return e;
}

// Mensagem do Sistema: borda neon, MAIÚSCULAS, com efeito de digitação opcional.
export function mensagemSistema(texto, { digitar = false } = {}) {
  const caixa = el("div", { class: "msg-sistema", role: "status" });
  const semAnimacao = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!digitar || semAnimacao) {
    caixa.textContent = texto;
    return caixa;
  }
  caixa.textContent = "";
  let i = 0;
  const passo = () => {
    caixa.textContent = texto.slice(0, ++i);
    if (i < texto.length) setTimeout(passo, 18);
  };
  passo();
  return caixa;
}

// Barra de progresso. tipo: "xp" | "hp" | "mp". HP fica vermelho abaixo de 30.
export function barra(valor, maximo, tipo = "xp") {
  const pct = maximo > 0 ? Math.max(0, Math.min(100, (valor / maximo) * 100)) : 0;
  const baixo = tipo === "hp" && valor < 30 ? " baixo" : "";
  const b = el("div", { class: `barra barra-${tipo}${baixo}`, role: "progressbar", "aria-valuenow": String(valor), "aria-valuemax": String(maximo) });
  const i = el("i");
  b.append(i);
  requestAnimationFrame(() => { i.style.width = pct + "%"; });
  return b;
}

// Botão. tipo: "primario" | "fantasma" | "perigo" | "" (padrão).
export function botao(rotulo, tipo = "", aoClicar) {
  const b = el("button", { class: `botao ${tipo}`.trim(), type: "button", texto: rotulo });
  if (aoClicar) b.addEventListener("click", aoClicar);
  return b;
}

// Janela modal. botoes: [{rotulo, tipo, aoClicar}]. Devolve {fechar}.
export function modal({ titulo, conteudo, botoes = [] }) {
  const fundo = el("div", { class: "modal-fundo" });
  const caixa = el("div", { class: "modal", role: "dialog", "aria-modal": "true" });
  const fechar = () => fundo.remove();
  caixa.append(el("h2", { texto: titulo || "" }));
  if (conteudo) caixa.append(typeof conteudo === "string" ? el("p", { texto: conteudo }) : conteudo);
  const area = el("div", { class: "botoes" });
  for (const b of botoes) {
    area.append(botao(b.rotulo, b.tipo || "", () => { fechar(); if (b.aoClicar) b.aoClicar(); }));
  }
  caixa.append(area);
  fundo.append(caixa);
  fundo.addEventListener("click", (e) => { if (e.target === fundo) fechar(); });
  document.body.append(fundo);
  return { fechar };
}

// Aviso rápido embaixo da tela. desfazer: função opcional (mostra o botão DESFAZER).
export function toast(texto, { desfazer, duracao = 5000 } = {}) {
  const t = el("div", { class: "toast", role: "status" }, [el("span", { texto })]);
  const fechar = () => t.remove();
  if (desfazer) t.append(botao("DESFAZER", "fantasma", () => { fechar(); desfazer(); }));
  document.body.append(t);
  setTimeout(fechar, duracao);
  return { fechar };
}


// Estrutura padrão de uma tela vazia.
export function telaVazia(elemento, titulo) {
  elemento.replaceChildren(
    el("h1", { class: "titulo-tela", texto: titulo }),
    mensagemSistema(sistema.emConstrucao, { digitar: true }),
  );
}

// Letra de rank colorida (a cor vem de corDoRank; só o S brilha). A letra sempre aparece escrita.
export function letraRank(rank, extra = "") {
  const s = el("span", { class: `rank-letra${rank === "S" ? " rank-s" : ""} ${extra}`.trim(), texto: rank });
  s.style.color = corDoRank(rank);
  return s;
}

// Mensagem do Sistema em que o marcador \u0001 vira a letra do rank colorida.
export function mensagemComRank(texto, rank) {
  const caixa = el("div", { class: "msg-sistema", role: "status" });
  const partes = texto.split("\u0001");
  partes.forEach((p, i) => {
    caixa.append(p);
    if (i < partes.length - 1) caixa.append(letraRank(rank));
  });
  return caixa;
}

// Tela cheia de LEVEL UP: número crescendo, brilho e vibração.
export function levelUp(nivel, texto) {
  const fundo = el("div", { class: "levelup", role: "alertdialog" }, [
    el("div", { class: "levelup-numero", texto: String(nivel) }),
    el("div", { class: "msg-sistema", texto }),
  ]);
  const fechar = () => fundo.remove();
  fundo.append(botao("CONTINUAR", "primario", fechar));
  document.body.append(fundo);
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  return { fechar };
}
