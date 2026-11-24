// Dia do jogo: vira às 4h da manhã (hora local). Nunca use toISOString().
const QUATRO_HORAS = 4 * 60 * 60 * 1000;

export function diaDoJogo(data = agora()) {
  const d = new Date(data.getTime() - QUATRO_HORAS);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Horas inteiras (arredondadas para cima) até as próximas 4h.
export function horasAteVirada(data = agora()) {
  const prox = new Date(data.getFullYear(), data.getMonth(), data.getDate(), 4, 0, 0, 0);
  if (data.getTime() >= prox.getTime()) prox.setDate(prox.getDate() + 1);
  return Math.ceil((prox.getTime() - data.getTime()) / 3600000);
}

// Quantos dias há de a até b (chaves "AAAA-MM-DD"). Positivo se b é depois de a.
export function diasEntre(a, b) {
  const t = (c) => { const [y, m, d] = c.split("-").map(Number); return Date.UTC(y, m - 1, d); };
  return Math.round((t(b) - t(a)) / 86400000);
}

// 0 = domingo ... 5 = sexta ... 6 = sábado, para uma chave "AAAA-MM-DD".
export function diaDaSemana(dia) {
  const [y, m, d] = dia.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

// "AAAA-MM-DD" + n dias (n pode ser negativo), sem fuso.
export function somarDias(dia, n) {
  const [y, m, d] = dia.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  const p = (x) => String(x).padStart(2, "0");
  return `${t.getUTCFullYear()}-${p(t.getUTCMonth() + 1)}-${p(t.getUTCDate())}`;
}

// ---- Relógio do app (com deslocamento só no modo de teste) ----
// O deslocamento fica no localStorage (vale em todas as abas e depois de fechar o app).
export const CHAVE_DESLOCAMENTO = "system-teste-deslocamento";
const UM_DIA = 24 * 3600000;

function modoTeste() {
  return typeof location !== "undefined" && new URLSearchParams(location.search).get("teste") === "1";
}

export function deslocamentoTeste() {
  if (!modoTeste()) return 0;
  try {
    const n = Number(localStorage.getItem(CHAVE_DESLOCAMENTO) || 0);
    return Number.isFinite(n) ? n : 0;
  } catch { return 0; }
}

export function avancarDiaTeste() {
  if (!modoTeste()) return;
  try { localStorage.setItem(CHAVE_DESLOCAMENTO, String(deslocamentoTeste() + UM_DIA)); } catch { /* sem localStorage */ }
}

export function zerarDeslocamentoTeste() {
  if (!modoTeste()) return;
  try { localStorage.removeItem(CHAVE_DESLOCAMENTO); } catch { /* sem localStorage */ }
}

// Texto do banner amarelo, ex.: "MODO DE TESTE · 01/12/2026" (data local simulada).
export function textoFaixaTeste() {
  const d = agora();
  const p = (n) => String(n).padStart(2, "0");
  return `MODO DE TESTE · ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function agora() {
  return new Date(Date.now() + deslocamentoTeste());
}

// Hora local entre 21h e 4h: o dia do jogo está acabando.
export function noiteDoDia(data = agora()) {
  const h = data.getHours();
  return h >= 21 || h < 4;
}
