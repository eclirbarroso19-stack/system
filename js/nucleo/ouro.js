// Regras do Registro do Ouro (Livro 7.1). Lógica pura, sem DOM e sem banco. Dinheiro em centavos.
import { categoriasSaida, categoriasEntrada } from "../textos.js";

// essencialPadrao: true, false, ou null quando o jogador precisa escolher ("Outros").
export const CATEGORIAS_SAIDA = categoriasSaida.map((c) => ({
  ...c,
  essencialPadrao: c.tipo === "essencial" ? true : c.tipo === "nao-essencial" ? false : null,
}));
export const CATEGORIAS_ENTRADA = categoriasEntrada.map((c) => ({ ...c, essencialPadrao: null }));

export function categoriaPorId(tipo, id) {
  const lista = tipo === "entrada" ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA;
  return lista.find((c) => c.id === id) || null;
}

// Monta o registro do banco. `dia` vem de diaDoJogo() (madrugada até 4h conta no dia anterior).
export function criarLancamento({ tipo, valorCentavos, categoria, essencial = null, impulso = false, nota = "" }, dia, quando) {
  if (tipo !== "saida" && tipo !== "entrada") throw new Error("Tipo inválido.");
  if (!Number.isInteger(valorCentavos) || valorCentavos <= 0) throw new Error("Valor inválido.");
  const cat = categoriaPorId(tipo, categoria);
  if (!cat) throw new Error("Categoria inválida.");
  const ehSaida = tipo === "saida";
  return {
    dia, quando, tipo, valorCentavos, categoria,
    essencial: ehSaida ? (essencial === null || essencial === undefined ? cat.essencialPadrao : !!essencial) : null,
    impulso: ehSaida ? !!impulso : false,
    nota: nota || "",
  };
}

// Totais de um período. Tudo em centavos.
// essencial = saídas essenciais; naoEssencial = as demais saídas. impulsos = soma das saídas por impulso.
export function resumoPeriodo(lancamentos = []) {
  let entrou = 0, saiu = 0, essencial = 0, naoEssencial = 0, impulsos = 0, qtdImpulsos = 0;
  const porCat = {};
  for (const l of lancamentos) {
    if (l.tipo === "entrada") { entrou += l.valorCentavos; continue; }
    if (l.tipo !== "saida") continue;
    saiu += l.valorCentavos;
    if (l.essencial === true) essencial += l.valorCentavos; else naoEssencial += l.valorCentavos;
    if (l.impulso) { impulsos += l.valorCentavos; qtdImpulsos++; }
    porCat[l.categoria] = (porCat[l.categoria] || 0) + l.valorCentavos;
  }
  const porCategoria = Object.entries(porCat)
    .map(([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total || a.categoria.localeCompare(b.categoria));
  return { entrou, saiu, sobrou: entrou - saiu, essencial, naoEssencial, impulsos, qtdImpulsos, porCategoria };
}

// Missão 4: >=1 registro de saída (ou "Hoje não gastei nada") e nenhum gasto por impulso.
// motivo: "impulso" | "sem-registro" | "registros" | "sem-gastos"
export function statusMissaoOuro(lancamentosDoDia = [], semGastos = false) {
  const saidas = lancamentosDoDia.filter((l) => l.tipo === "saida");
  if (saidas.some((l) => l.impulso)) return { cumprida: false, motivo: "impulso" };
  if (saidas.length > 0) return { cumprida: true, motivo: "registros" };
  if (semGastos) return { cumprida: true, motivo: "sem-gastos" };
  return { cumprida: false, motivo: "sem-registro" };
}

// O Ouro paga no máximo +10 XP +1 Cristal por dia.
// Devolve o que fazer agora, dado o estado do dia:
//  - completarMissao: marcar a missão 4 (e pagá-la, se ainda não pagou)
//  - desmarcarMissao: um impulso derrubou a missão (a recompensa já paga NÃO é estornada)
//  - pagarRegistro: pagar "Registro do Ouro do dia" (quando há impulso e nada foi pago)
export function planoDoOuro({ lancamentosDoDia = [], semGastos = false, missaoMarcada = false, jaPagou = false }) {
  const st = statusMissaoOuro(lancamentosDoDia, semGastos);
  const temRegistro = lancamentosDoDia.length > 0;
  return {
    status: st,
    completarMissao: st.cumprida && !missaoMarcada,
    desmarcarMissao: !st.cumprida && missaoMarcada,
    pagarRegistro: !jaPagou && !st.cumprida && temRegistro,
    pagaMissao: st.cumprida && !missaoMarcada && !jaPagou,
  };
}

// ---- Meses ("AAAA-MM") ----
export function mesDoDia(dia) {
  return dia.slice(0, 7);
}

export function limitesDoMes(ym) {
  return { inicio: `${ym}-01`, fim: `${ym}-31` }; // "AAAA-MM-31" compara certo como texto
}

export function somarMes(ym, n) {
  const [a, m] = ym.split("-").map(Number);
  const total = a * 12 + (m - 1) + n;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
}

const NOMES_MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
export function nomeDoMes(ym) {
  const [a, m] = ym.split("-").map(Number);
  const nome = NOMES_MESES[m - 1];
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)} de ${a}`;
}

// Aplica uma edição. Nunca altera "id", "dia" nem "quando" (a hora exata do lançamento).
export function aplicarEdicao(atual, mudancas = {}) {
  const novo = criarLancamento({ ...atual, ...mudancas }, atual.dia, atual.quando);
  if (atual.id !== undefined) novo.id = atual.id;
  return novo;
}
