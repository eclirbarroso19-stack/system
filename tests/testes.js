import { diaDoJogo, horasAteVirada } from "../js/nucleo/dia.js";
import { preencher, mensagens, perguntasDespertar, categoriasSaida } from "../js/textos.js";

function igual(real, esperado) {
  if (real !== esperado) throw new Error(`esperado ${esperado}, veio ${real}`);
}

const noNode = typeof process !== "undefined" && !!process.versions?.node;

// 24/11/2026 é terça-feira (mês 10 = novembro)
export const testes = [
  { nome: "03:59 de terça conta como segunda", rodar() { igual(diaDoJogo(new Date(2026, 10, 24, 3, 59)), "2026-11-23"); } },
  { nome: "04:00 de terça conta como terça", rodar() { igual(diaDoJogo(new Date(2026, 10, 24, 4, 0)), "2026-11-24"); } },
  { nome: "23:30 conta como o mesmo dia", rodar() { igual(diaDoJogo(new Date(2026, 10, 24, 23, 30)), "2026-11-24"); } },
  { nome: "21:00 -> faltam 7 horas para a virada", rodar() { igual(horasAteVirada(new Date(2026, 10, 24, 21, 0)), 7); } },
  { nome: "preencher() troca os placeholders", rodar() {
    igual(preencher(mensagens.alerta21h, { H: 7, X: 3 }), "[ALERTA: O DIA TERMINA EM 7 HORAS. MISSÕES PENDENTES: 3]");
  } },
  { nome: "textos: 7 perguntas com 5 opções e 11 categorias de saída", rodar() {
    igual(perguntasDespertar.length, 7);
    igual(perguntasDespertar.every((p) => p.opcoes.length === 5), true);
    igual(categoriasSaida.length, 11);
  } },
  { nome: "VERSAO_APP do sw.js é igual à de config.js", async rodar() {
    if (!noNode) return; // no navegador, este teste é pulado
    const fs = await import("node:fs");
    const cfg = fs.readFileSync(new URL("../js/config.js", import.meta.url), "utf8").match(/VERSAO_APP\s*=\s*"([^"]+)"/)?.[1];
    const sw = fs.readFileSync(new URL("../sw.js", import.meta.url), "utf8").match(/VERSAO_APP\s*=\s*"([^"]+)"/)?.[1];
    if (!cfg || cfg !== sw) throw new Error(`config.js=${cfg} sw.js=${sw}`);
  } },
  { nome: "todos os arquivos do cache do sw.js existem", async rodar() {
    if (!noNode) return;
    const fs = await import("node:fs");
    const src = fs.readFileSync(new URL("../sw.js", import.meta.url), "utf8");
    const lista = [...src.matchAll(/^\s*"\.\/([^"]+)",?$/gm)].map((m) => m[1]);
    const faltam = lista.filter((f) => !fs.existsSync(new URL("../" + f, import.meta.url)));
    if (faltam.length) throw new Error("faltam: " + faltam.join(", "));
  } },
];
