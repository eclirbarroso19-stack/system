import { diaDoJogo, horasAteVirada } from "../js/nucleo/dia.js";
import { formatarReais, lerReais, formatarData, nomeDiaSemana } from "../js/nucleo/formato.js";
import { validarBackup, montarBackup, nomeArquivoBackup, deveLembrarBackup } from "../js/nucleo/backup.js";
import { migrarDados } from "../js/nucleo/migracoes.js";
import { NOMES_STORES } from "../js/nucleo/db.js";
import { diasEntre } from "../js/nucleo/dia.js";
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

const backupOk = () => montarBackup(Object.fromEntries(NOMES_STORES.map((n) => [n, []])));

testes.push(
  { nome: "banco tem as 20 stores", rodar() { igual(NOMES_STORES.length, 20); } },
  { nome: "formatarReais: 0, 5, 100000, 123456 e negativo", rodar() {
    igual(formatarReais(0), "R$ 0,00");
    igual(formatarReais(5), "R$ 0,05");
    igual(formatarReais(100000), "R$ 1.000,00");
    igual(formatarReais(123456), "R$ 1.234,56");
    igual(formatarReais(-550), "-R$ 5,50");
  } },
  { nome: "lerReais: vírgula, ponto, R$, espaços, milhar e inválidos", rodar() {
    igual(lerReais("12,50"), 1250);
    igual(lerReais("12.50"), 1250);
    igual(lerReais("R$ 12,5"), 1250);
    igual(lerReais(" 7 "), 700);
    igual(lerReais("1.234,56"), 123456);
    igual(lerReais("1.234"), 123400);
    igual(lerReais("0,05"), 5);
    igual(lerReais("-3,00"), -300);
    igual(lerReais("abc"), null);
    igual(lerReais(""), null);
    igual(lerReais("1,234"), null);
  } },
  { nome: "formatarData e nomeDiaSemana", rodar() {
    igual(formatarData("2026-11-21"), "21/11/2026");
    igual(nomeDiaSemana("2026-11-21"), "sábado");
    igual(nomeDiaSemana("2026-11-24"), "terça-feira");
  } },
  { nome: "validarBackup: válido, app errado, versão futura, faltando stores", rodar() {
    igual(validarBackup(backupOk()).ok, true);
    igual(validarBackup({ ...backupOk(), app: "OUTRO" }).ok, false);
    igual(validarBackup({ ...backupOk(), versaoDados: 99 }).ok, false);
    const b = backupOk(); delete b.stores.ouro;
    igual(validarBackup(b).ok, false);
    igual(validarBackup(null).ok, false);
  } },
  { nome: "migrarDados: backup versão 1 passa sem mudanças", rodar() {
    const b = backupOk();
    b.stores.ouro.push({ id: 1, valorCentavos: 500 });
    const m = migrarDados(b);
    igual(JSON.stringify(m), JSON.stringify(b));
  } },
  { nome: "migrarDados: aplica migrações em ordem e não apaga dados", rodar() {
    const migs = [
      { de: 1, para: 2, transformar(d) { d.stores.ouro.forEach((r) => { r.novo = true; }); return d; } },
      { de: 2, para: 3, transformar(d) { return d; } },
    ];
    const b = backupOk(); b.stores.ouro.push({ id: 1 });
    const m = migrarDados(b, migs, 3);
    igual(m.versaoDados, 3);
    igual(m.stores.ouro.length, 1);
    igual(m.stores.ouro[0].novo, true);
    igual(b.versaoDados, 1); // original intacto
  } },
  { nome: "nome do arquivo de backup usa a data local", rodar() {
    igual(nomeArquivoBackup(new Date(2026, 10, 24, 23, 30)), "system-backup-2026-11-24.json");
  } },
  { nome: "lembrete de backup: só sexta, >6 dias ou nunca, 1x por dia", rodar() {
    igual(diasEntre("2026-11-20", "2026-11-27"), 7);
    igual(deveLembrarBackup({ dia: "2026-11-27", ultimoBackup: undefined }), true);        // sexta, nunca
    igual(deveLembrarBackup({ dia: "2026-11-27", ultimoBackup: "2026-11-20" }), true);     // 7 dias
    igual(deveLembrarBackup({ dia: "2026-11-27", ultimoBackup: "2026-11-21" }), false);    // 6 dias
    igual(deveLembrarBackup({ dia: "2026-11-27", ultimoBackup: "2026-11-01", ultimoLembrete: "2026-11-27" }), false);
    igual(deveLembrarBackup({ dia: "2026-11-26", ultimoBackup: undefined }), false);       // quinta
  } },
);
