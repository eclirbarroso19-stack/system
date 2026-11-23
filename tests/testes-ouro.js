// Testes do Registro do Ouro (etapa 1.5). Importado por tests/testes.js.
import {
  CATEGORIAS_SAIDA, CATEGORIAS_ENTRADA, criarLancamento, resumoPeriodo, statusMissaoOuro, planoDoOuro,
  mesDoDia, limitesDoMes, somarMes, nomeDoMes,
} from "../js/nucleo/ouro.js";
import { diaDoJogo } from "../js/nucleo/dia.js";
import { formatarReais } from "../js/nucleo/formato.js";

function igual(real, esperado) {
  if (real !== esperado) throw new Error(`esperado ${esperado}, veio ${real}`);
}

const saida = (v, categoria = "mercado", extra = {}) => ({ tipo: "saida", valorCentavos: v, categoria, essencial: true, impulso: false, ...extra });
const entrada = (v) => ({ tipo: "entrada", valorCentavos: v, categoria: "salario" });

export const testesOuro = [
  { nome: "Ouro: 11 categorias de saída e 4 de entrada, com essencialPadrao", rodar() {
    igual(CATEGORIAS_SAIDA.length, 11);
    igual(CATEGORIAS_ENTRADA.length, 4);
    igual(CATEGORIAS_SAIDA.find((c) => c.id === "mercado").essencialPadrao, true);
    igual(CATEGORIAS_SAIDA.find((c) => c.id === "lazer").essencialPadrao, false);
    igual(CATEGORIAS_SAIDA.find((c) => c.id === "outros").essencialPadrao, null);
  } },
  { nome: "Ouro: resumo soma entrou, saiu e sobrou em centavos", rodar() {
    const r = resumoPeriodo([entrada(150000), saida(20000), saida(3550, "lazer", { essencial: false }), entrada(5000)]);
    igual(r.entrou, 155000);
    igual(r.saiu, 23550);
    igual(r.sobrou, 131450);
    igual(r.essencial, 20000);
    igual(r.naoEssencial, 3550);
    igual(formatarReais(r.sobrou), "R$ 1.314,50");
  } },
  { nome: "Ouro: sobrou negativo", rodar() {
    const r = resumoPeriodo([entrada(10000), saida(25000)]);
    igual(r.sobrou, -15000);
    igual(formatarReais(r.sobrou), "-R$ 150,00");
  } },
  { nome: "Ouro: impulsos e top de categorias", rodar() {
    const r = resumoPeriodo([
      saida(1000, "comida-fora", { essencial: false, impulso: true }),
      saida(2500, "comida-fora", { essencial: false }),
      saida(9000, "mercado"),
      saida(500, "lazer", { essencial: false, impulso: true }),
    ]);
    igual(r.impulsos, 1500);
    igual(r.qtdImpulsos, 2);
    igual(r.porCategoria[0].categoria, "mercado");
    igual(r.porCategoria[1].categoria, "comida-fora");
    igual(r.porCategoria[1].total, 3500);
  } },
  { nome: "Ouro: resumo vazio zera tudo", rodar() {
    const r = resumoPeriodo([]);
    igual(r.entrou + r.saiu + r.sobrou + r.qtdImpulsos, 0);
    igual(r.porCategoria.length, 0);
  } },
  { nome: "Ouro: missão 4 com registro sem impulso", rodar() {
    igual(statusMissaoOuro([saida(500)], false).cumprida, true);
  } },
  { nome: "Ouro: impulso derruba a missão 4", rodar() {
    const s = statusMissaoOuro([saida(500), saida(900, "lazer", { essencial: false, impulso: true })], false);
    igual(s.cumprida, false);
    igual(s.motivo, "impulso");
    igual(statusMissaoOuro([saida(500, "lazer", { impulso: true })], true).cumprida, false); // nem "não gastei" salva
  } },
  { nome: "Ouro: 'Hoje não gastei nada' cumpre; sem nada não cumpre; só entrada não cumpre", rodar() {
    igual(statusMissaoOuro([], true).cumprida, true);
    igual(statusMissaoOuro([], false).motivo, "sem-registro");
    igual(statusMissaoOuro([entrada(1000)], false).cumprida, false);
  } },
  { nome: "Ouro: recompensa paga no máximo uma vez por dia", rodar() {
    // sem impulso: paga como missão 4
    let p = planoDoOuro({ lancamentosDoDia: [saida(500)] });
    igual(p.completarMissao, true); igual(p.pagaMissao, true); igual(p.pagarRegistro, false);
    // com impulso: não conta a missão, mas paga o Registro do Ouro
    p = planoDoOuro({ lancamentosDoDia: [saida(500, "lazer", { impulso: true })] });
    igual(p.completarMissao, false); igual(p.pagarRegistro, true);
    // impulso depois da missão paga: desmarca, sem pagar de novo
    p = planoDoOuro({ lancamentosDoDia: [saida(500), saida(300, "lazer", { impulso: true })], missaoMarcada: true, jaPagou: true });
    igual(p.desmarcarMissao, true); igual(p.pagarRegistro, false);
    // impulso corrigido: remarca sem pagar de novo
    p = planoDoOuro({ lancamentosDoDia: [saida(500)], missaoMarcada: false, jaPagou: true });
    igual(p.completarMissao, true); igual(p.pagaMissao, false);
  } },
  { nome: "Ouro: lançamento às 02:00 conta no dia anterior", rodar() {
    const dia = diaDoJogo(new Date(2026, 10, 24, 2, 0));
    igual(dia, "2026-11-23");
    const l = criarLancamento({ tipo: "saida", valorCentavos: 1000, categoria: "lazer" }, dia, 1);
    igual(l.dia, "2026-11-23");
  } },
  { nome: "Ouro: criarLancamento usa o essencial padrão e valida", rodar() {
    igual(criarLancamento({ tipo: "saida", valorCentavos: 500, categoria: "mercado" }, "2026-11-23", 1).essencial, true);
    igual(criarLancamento({ tipo: "saida", valorCentavos: 500, categoria: "outros", essencial: false }, "2026-11-23", 1).essencial, false);
    const e = criarLancamento({ tipo: "entrada", valorCentavos: 500, categoria: "salario", impulso: true }, "2026-11-23", 1);
    igual(e.impulso, false);
    igual(e.essencial, null);
    let erro = false;
    try { criarLancamento({ tipo: "saida", valorCentavos: 0, categoria: "mercado" }, "x", 1); } catch { erro = true; }
    igual(erro, true);
  } },
  { nome: "Ouro: meses (limites, anterior e próximo, nome)", rodar() {
    igual(mesDoDia("2026-11-23"), "2026-11");
    igual(limitesDoMes("2026-11").inicio, "2026-11-01");
    igual(somarMes("2026-12", 1), "2027-01");
    igual(somarMes("2026-01", -1), "2025-12");
    igual(nomeDoMes("2026-11"), "novembro de 2026");
    igual("2026-11-30" <= limitesDoMes("2026-11").fim, true);
    igual("2026-12-01" <= limitesDoMes("2026-11").fim, false);
  } },
];
