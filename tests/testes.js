import { testesRaid } from "./testes-raid.js";
import { testesTreino } from "./testes-treino.js";
import { testesTeto } from "./testes-teto.js";
import { testesOuro } from "./testes-ouro.js";
import { avaliarDia, avaliarPunicao, aplicarHPeZona, processarDiaEncerrado, diasParaAvaliar, missoesPendentes, recompensaDaMissao, MISSOES_V1 } from "../js/nucleo/regras.js";
import { somarDias, noiteDoDia } from "../js/nucleo/dia.js";
import { nivelDe, rankDaNota, notaDaOpcao, aplicarXP, xpParaProximo, criarCacadorInicial, criarDiaVazio, corDoRank, areasMaisFracas, calcularGanho, LIMITE_XP_DIA } from "../js/nucleo/regras.js";
import { diaDoJogo, horasAteVirada } from "../js/nucleo/dia.js";
import { formatarReais, lerReais, formatarData, nomeDiaSemana } from "../js/nucleo/formato.js";
import { dataMaisRecente, validarBackup, montarBackup, nomeArquivoBackup, deveLembrarBackup } from "../js/nucleo/backup.js";
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

testes.push(
  { nome: "backup: mantém a data de backup mais recente ao restaurar", rodar() {
    igual(dataMaisRecente("2026-11-20", "2026-11-25"), "2026-11-25");
    igual(dataMaisRecente("2026-11-25", "2026-11-20"), "2026-11-25");
    igual(dataMaisRecente(undefined, "2026-11-20"), "2026-11-20");
    igual(dataMaisRecente("2026-11-20", undefined), "2026-11-20");
    igual(dataMaisRecente(undefined, undefined), undefined);
  } },
);

testes.push(
  { nome: "xpParaProximo e nivelDe", rodar() {
    igual(xpParaProximo(1), 80);
    igual(xpParaProximo(10), 350);
    igual(nivelDe(0).nivel, 1);
    igual(nivelDe(79).nivel, 1);
    igual(nivelDe(80).nivel, 2);
    igual(nivelDe(190).nivel, 3);
    igual(nivelDe(190).xpNoNivel, 0);
    igual(nivelDe(100).xpNoNivel, 20);
    igual(nivelDe(100).xpParaProximo, 110);
  } },
  { nome: "rankDaNota: limites de cada rank", rodar() {
    const esperado = [[0, "E"], [19, "E"], [20, "D"], [39, "D"], [40, "C"], [59, "C"], [60, "B"], [74, "B"], [75, "A"], [89, "A"], [90, "S"], [100, "S"]];
    for (const [n, r] of esperado) igual(rankDaNota(n), r);
  } },
  { nome: "notaDaOpcao: 0 a 4 vira 0 a 100", rodar() {
    igual([0, 1, 2, 3, 4].map(notaDaOpcao).join(","), "0,25,50,75,100");
  } },
  { nome: "aplicarXP: limite de 300 por dia", rodar() {
    igual(LIMITE_XP_DIA, 300);
    igual(aplicarXP(0, 290, 30).xpGanho, 10);
    igual(aplicarXP(0, 300, 30).xpGanho, 0);
    igual(aplicarXP(100, 0, 30).xpTotal, 130);
  } },
  { nome: "aplicarXP: metade na Zona e foraDoLimite", rodar() {
    igual(aplicarXP(0, 0, 30, { zona: true }).xpGanho, 15);
    igual(aplicarXP(0, 300, 100, { foraDoLimite: true }).xpGanho, 100);
    igual(aplicarXP(0, 300, 100, { foraDoLimite: true, zona: true }).xpGanho, 50);
  } },
  { nome: "aplicarXP: subir 2 níveis de uma vez e XP nunca diminui", rodar() {
    const r = aplicarXP(70, 0, 130, { foraDoLimite: true }); // 200 no total: nível 3
    igual(r.subiuPara.join(","), "2,3");
    igual(aplicarXP(50, 0, -20).xpTotal, 50);
  } },
  { nome: "criarCacadorInicial: valores do Livro 2", rodar() {
    const c = criarCacadorInicial("Teste");
    igual(c.id, "eu"); igual(c.nivel, 1); igual(c.hp, 100); igual(c.cristais, 0);
    igual(c.rankCacador, "E"); igual(c.titulo, "O Mais Fraco de Todos");
    igual(c.atributos.forca, null); igual(Object.keys(c.atributos).length, 8);
  } },
  { nome: "calcularGanho: level up dá 3 Pontos de Foco; HP e Cristais limitados", rodar() {
    const c = criarCacadorInicial("T");
    const r = calcularGanho(c, criarDiaVazio("2026-11-24"), { xp: 80, cristais: 1, hp: 10, tipo: "teste" });
    igual(r.cacador.nivel, 2); igual(r.cacador.pontosFoco, 3);
    igual(r.cacador.hp, 100); igual(r.evento.hp, 0);
    igual(r.dia.xpDia, 80); igual(r.subiuPara.join(","), "2");
    const r2 = calcularGanho(c, criarDiaVazio("2026-11-24"), { cristais: -10, hp: -500 });
    igual(r2.cacador.cristais, 0); igual(r2.cacador.hp, 0);
  } },
);

const rk = (o) => Object.fromEntries(Object.entries(o).map(([k, r]) => [k, { rank: r }]));
testes.push(
  { nome: "corDoRank: escada E cinza até S dourado", rodar() {
    igual(["E", "D", "C", "B", "A", "S"].map(corDoRank).join(","), "#8A9BB0,#2BE38B,#00D4FF,#B57BFF,#FF8A3D,#FFD34D");
    igual(corDoRank("?"), "#8A9BB0");
  } },
  { nome: "areasMaisFracas: uma só, empate e todas iguais", rodar() {
    igual(areasMaisFracas(rk({ a: "C", b: "D", c: "B" })).join(","), "b");
    igual(areasMaisFracas(rk({ a: "D", b: "D", c: "B", d: "A" })).join(","), "a,b");
    igual(areasMaisFracas(rk({ a: "E", b: "E", c: "E" })).length, 0);
    igual(areasMaisFracas({}).length, 0);
    igual(areasMaisFracas(rk({ a: "S", b: "E" })).join(","), "b");
  } },
);

const diaCom = (n, extra = {}) => {
  const d = criarDiaVazio("2026-11-24");
  ["treino", "agua", "principal", "ouro", "sono"].slice(0, n).forEach((m) => { d.missoes[m] = true; });
  return { ...d, ...extra };
};
const cac = (hp, extra = {}) => ({ ...criarCacadorInicial("T"), hp, ...extra });

testes.push(
  { nome: "avaliarDia: 5/5 +5, 3/5 +5, 2/5 -10 com punição", rodar() {
    igual(avaliarDia(diaCom(5)).deltaHP, 5);
    igual(avaliarDia(diaCom(3)).deltaHP, 5);
    igual(avaliarDia(diaCom(3)).gerarPunicao, false);
    const r = avaliarDia(diaCom(2));
    igual(r.deltaHP, -10); igual(r.gerarPunicao, true); igual(r.total, 5);
    igual(avaliarDia(diaCom(0)).deltaHP, -10);
  } },
  { nome: "avaliarDia na Zona: sem perda de HP e conta só com as 3 mínimas", rodar() {
    const parcial = criarDiaVazio("2026-11-24"); parcial.missoes.agua = true;
    const a = avaliarDia(parcial, { zona: true });
    igual(a.deltaHP, 0); igual(a.gerarPunicao, false); igual(a.contaParaZona, false);
    const cheio = criarDiaVazio("2026-11-24"); Object.assign(cheio.missoes, { agua: true, sono: true, caminhada10: true });
    igual(avaliarDia(cheio, { zona: true }).contaParaZona, true);
  } },
  { nome: "avaliarPunicao: não feita = -10 HP e -10 Cristais", rodar() {
    const r = avaliarPunicao({ punicao: { ativa: true, feita: false } });
    igual(r.deltaHP, -10); igual(r.deltaCristais, -10);
    igual(avaliarPunicao({ punicao: { ativa: true, feita: true } }).deltaHP, 0);
    igual(avaliarPunicao({ punicao: { ativa: false, feita: false } }).deltaCristais, 0);
  } },
  { nome: "processarDiaEncerrado: Cristais nunca abaixo de 0 e XP intacto", rodar() {
    const d = diaCom(5, { punicao: { ativa: true, feita: false } });
    const r = processarDiaEncerrado(cac(100, { cristais: 4, xpTotal: 500 }), d);
    igual(r.cacador.cristais, 0);
    igual(r.cacador.hp, 95); // +5 -10
    igual(r.cacador.xpTotal, 500);
    igual(r.eventos.find((e) => e.tipo === "punicao-nao-feita").cristais, -4);
  } },
  { nome: "HP 10 com falha vai a 0 e entra na Zona", rodar() {
    const r = processarDiaEncerrado(cac(10), diaCom(1));
    igual(r.cacador.hp, 0);
    igual(r.cacador.zona.ativa, true);
    igual(r.mensagens.includes("hpZerou"), true);
    igual(r.mensagens.includes("penalidade"), true);
  } },
  { nome: "Zona: 3 dias cumpridos devolvem HP 50", rodar() {
    let c = cac(0, { zona: { ativa: true, diasCumpridos: 0 } });
    const bom = criarDiaVazio("2026-11-24"); Object.assign(bom.missoes, { agua: true, sono: true, caminhada10: true });
    for (let i = 0; i < 2; i++) { c = processarDiaEncerrado(c, bom).cacador; igual(c.zona.ativa, true); igual(c.hp, 0); }
    const r = processarDiaEncerrado(c, bom);
    igual(r.cacador.zona.ativa, false); igual(r.cacador.hp, 50);
    igual(r.mensagens.includes("saiuDaZona"), true);
    // dia ruim na Zona não conta e não tira HP
    const ruim = processarDiaEncerrado(cac(0, { zona: { ativa: true, diasCumpridos: 2 } }), criarDiaVazio("2026-11-24"));
    igual(ruim.cacador.zona.diasCumpridos, 2); igual(ruim.cacador.hp, 0);
  } },
  { nome: "aplicarHPeZona: limita 0 a 100", rodar() {
    igual(aplicarHPeZona(cac(98), 5).cacador.hp, 100);
    igual(aplicarHPeZona(cac(5), -50).cacador.hp, 0);
    igual(aplicarHPeZona(cac(5), -50).entrouNaZona, true);
  } },
  { nome: "diasParaAvaliar: só dias encerrados, no máximo 7 (os últimos)", rodar() {
    igual(diasParaAvaliar("2026-11-23", "2026-11-24").length, 0);
    igual(diasParaAvaliar("2026-11-22", "2026-11-24").join(","), "2026-11-23");
    const lista = diasParaAvaliar("2026-11-10", "2026-11-24"); // 13 dias encerrados
    igual(lista.length, 7); igual(lista[0], "2026-11-17"); igual(lista[6], "2026-11-23");
    igual(diasParaAvaliar(undefined, "2026-11-24").length, 0);
  } },
  { nome: "somarDias atravessa mês e ano", rodar() {
    igual(somarDias("2026-11-30", 1), "2026-12-01");
    igual(somarDias("2026-12-31", 1), "2027-01-01");
    igual(somarDias("2026-03-01", -1), "2026-02-28");
  } },
  { nome: "missoesPendentes e recompensas das missões", rodar() {
    igual(missoesPendentes(diaCom(2)).length, 3);
    igual(missoesPendentes(criarDiaVazio("x"), { zona: true }).length, 3);
    igual(recompensaDaMissao("agua").xp, 10);
    igual(recompensaDaMissao("treino", true).xp, 15);
    igual(MISSOES_V1.length, 5);
  } },
  { nome: "noiteDoDia: a partir das 21h até as 4h", rodar() {
    igual(noiteDoDia(new Date(2026, 10, 24, 20, 59)), false);
    igual(noiteDoDia(new Date(2026, 10, 24, 21, 0)), true);
    igual(noiteDoDia(new Date(2026, 10, 24, 3, 30)), true);
    igual(noiteDoDia(new Date(2026, 10, 24, 4, 0)), false);
  } },
);

testes.push(...testesRaid);
testes.push(...testesOuro);
testes.push(...testesTeto);
testes.push(...testesTreino);
