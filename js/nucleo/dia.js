// Dia do jogo: vira às 4h da manhã (hora local). Nunca use toISOString().
const QUATRO_HORAS = 4 * 60 * 60 * 1000;

export function diaDoJogo(data = new Date()) {
  const d = new Date(data.getTime() - QUATRO_HORAS);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Horas inteiras (arredondadas para cima) até as próximas 4h.
export function horasAteVirada(data = new Date()) {
  const prox = new Date(data.getFullYear(), data.getMonth(), data.getDate(), 4, 0, 0, 0);
  if (data.getTime() >= prox.getTime()) prox.setDate(prox.getDate() + 1);
  return Math.ceil((prox.getTime() - data.getTime()) / 3600000);
}
