import { diaDoJogo, horasAteVirada } from "../js/nucleo/dia.js";

function igual(real, esperado) {
  if (real !== esperado) throw new Error(`esperado ${esperado}, veio ${real}`);
}

// 24/11/2026 é terça-feira (mês 10 = novembro)
export const testes = [
  { nome: "03:59 de terça conta como segunda", rodar() { igual(diaDoJogo(new Date(2026, 10, 24, 3, 59)), "2026-11-23"); } },
  { nome: "04:00 de terça conta como terça", rodar() { igual(diaDoJogo(new Date(2026, 10, 24, 4, 0)), "2026-11-24"); } },
  { nome: "23:30 conta como o mesmo dia", rodar() { igual(diaDoJogo(new Date(2026, 10, 24, 23, 30)), "2026-11-24"); } },
  { nome: "21:00 -> faltam 7 horas para a virada", rodar() { igual(horasAteVirada(new Date(2026, 10, 24, 21, 0)), 7); } },
];
