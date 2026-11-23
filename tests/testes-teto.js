// Testes do teto do diagnóstico (Livro 12). Importado por tests/testes.js.
import { notaDespertarRapido, aplicarTetoDiagnostico, rankDaNota, TETO_DESPERTAR_RAPIDO } from "../js/nucleo/regras.js";

function igual(real, esperado) {
  if (real !== esperado) throw new Error(`esperado ${esperado}, veio ${real}`);
}

export const testesTeto = [
  { nome: "Teto: Despertar Rápido limita a nota a 74 (rank máximo B)", rodar() {
    igual(TETO_DESPERTAR_RAPIDO, 74);
    const notas = [0, 1, 2, 3, 4].map(notaDespertarRapido);
    igual(notas.join(","), "0,25,50,74,74");
    igual(rankDaNota(notaDespertarRapido(4)), "B");
    for (let i = 0; i <= 4; i++) igual(rankDaNota(notaDespertarRapido(i)) === "A" || rankDaNota(notaDespertarRapido(i)) === "S", false);
  } },
  { nome: "Teto: STATUS e radar usam a nota limitada (inclusive dados antigos)", rodar() {
    const antigo = { financas: { nota: 100, rank: "S", provisorio: true }, corpo: { nota: 75, rank: "A", provisorio: true }, mente: { nota: 50, rank: "C", provisorio: true } };
    const r = aplicarTetoDiagnostico(antigo);
    igual(r.financas.nota, 74); igual(r.financas.rank, "B");
    igual(r.corpo.nota, 74); igual(r.corpo.rank, "B");
    igual(r.mente.nota, 50); igual(r.mente.rank, "C");
    igual(antigo.financas.nota, 100); // não altera o original
  } },
  { nome: "Teto: área já conquistada (não provisória) não é limitada", rodar() {
    const r = aplicarTetoDiagnostico({ corpo: { nota: 95, rank: "S", provisorio: false } });
    igual(r.corpo.nota, 95); igual(r.corpo.rank, "S");
  } },
];
