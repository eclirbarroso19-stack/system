// Formatação de dinheiro e datas. Puro, sem DOM.

// 123456 -> "R$ 1.234,56" · negativo -> "-R$ 5,00"
export function formatarReais(centavos) {
  const neg = centavos < 0;
  const abs = Math.abs(Math.round(centavos));
  const reais = String(Math.floor(abs / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const cents = String(abs % 100).padStart(2, "0");
  return `${neg ? "-" : ""}R$ ${reais},${cents}`;
}

// "12,50" -> 1250 · aceita vírgula ou ponto, ignora "R$" e espaços. Inválido -> null.
export function lerReais(texto) {
  let t = String(texto).replace(/R\$/gi, "").replace(/\s/g, "");
  let neg = false;
  if (t.startsWith("-")) { neg = true; t = t.slice(1); }
  if (!/^[\d.,]+$/.test(t) || !/\d/.test(t)) return null;
  let inteiro, frac = "";
  const ultVirg = t.lastIndexOf(",");
  if (ultVirg >= 0) {
    inteiro = t.slice(0, ultVirg).replace(/\./g, "");
    frac = t.slice(ultVirg + 1);
    if (frac.includes(".")) return null;
  } else {
    const ultPonto = t.lastIndexOf(".");
    const depois = ultPonto >= 0 ? t.slice(ultPonto + 1) : "";
    if (ultPonto >= 0 && depois.length !== 3) { // "12.50" é decimal; "1.234" é milhar
      inteiro = t.slice(0, ultPonto).replace(/\./g, "");
      frac = depois;
    } else {
      inteiro = t.replace(/\./g, "");
    }
  }
  if (!/^\d*$/.test(inteiro) || !/^\d*$/.test(frac) || frac.length > 2) return null;
  const centavos = Number(inteiro || "0") * 100 + Number(frac.padEnd(2, "0") || "0");
  return neg ? -centavos : centavos;
}

// "2026-11-21" -> "21/11/2026"
export function formatarData(dia) {
  const [a, m, d] = dia.split("-");
  return `${d}/${m}/${a}`;
}

const SEMANA = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];

export function nomeDiaSemana(dia) {
  const [y, m, d] = dia.split("-").map(Number);
  return SEMANA[new Date(y, m - 1, d).getDay()];
}
