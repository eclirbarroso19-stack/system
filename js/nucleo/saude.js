// Dados de Corpo e Mente: treinos, Checagem de Segurança, check-in, Ritual da Noite e MP.
// Privacidade: nada daqui vai para log ou console. Só IndexedDB e backup.
import { salvar, adicionar, listar, listarPorDia, listarEntreDias } from "./db.js";
import { diaDoJogo, somarDias, agora } from "./dia.js";
import { ganhar, lerCacador, lerDia } from "./cacador.js";
import { concluirMissao, registrarSono } from "./diario.js";
import { RECOMPENSAS } from "./regras.js";
import { avaliarParq, calcularMP, calcularFadiga } from "./treino.js";

// ---- Corpo ----

// Grava a Checagem de Segurança. respostas = 7 booleans (true = SIM).
export async function salvarParq(respostas) {
  const cacador = await lerCacador();
  const { temRisco } = avaliarParq(respostas);
  cacador.parq = { respondido: true, temRisco, liberadoMedico: false };
  await salvar("cacador", cacador);
  return cacador.parq;
}

export async function marcarLiberadoMedico(liberado) {
  const cacador = await lerCacador();
  cacador.parq = { ...cacador.parq, liberadoMedico: !!liberado };
  await salvar("cacador", cacador);
}

export async function salvarDiasTreino(dias) {
  const cacador = await lerCacador();
  cacador.diasTreino = [...dias].sort((a, b) => a - b);
  await salvar("cacador", cacador);
}

// Registra um treino. Cumpre a missão 1 (+30 XP +3 Cristais) se ainda não estava cumprida.
// Devolve { registro, concluida (resultado de concluirMissao ou null) }.
export async function registrarTreino({ modalidade, minutos, esforco, exercicios = [], nota = "" }) {
  const dia = diaDoJogo();
  const registro = {
    dia, quando: agora().getTime(), modalidade, minutos, esforco, recuperacao: false,
    exercicios, nota,
  };
  registro.id = await adicionar("treinos", registro);
  const concluida = await concluirMissao("treino");
  return { registro, concluida };
}

export async function treinosRecentes(n = 14) {
  const todos = await listar("treinos");
  return todos.sort((a, b) => b.quando - a.quando).slice(0, n);
}

export async function fadigaAtual() {
  const treinos = (await listar("treinos")).filter((t) => !t.recuperacao);
  return calcularFadiga(treinos, diaDoJogo());
}

// Descanso planejado: +15 XP +1 Cristal +10 HP, uma vez por dia (via missão 1).
export async function registrarDescanso() {
  const concluida = await concluirMissao("treino", { recuperacao: true });
  if (concluida) {
    await adicionar("treinos", {
      dia: diaDoJogo(), quando: agora().getTime(), modalidade: "Descanso", minutos: 0, esforco: 0,
      recuperacao: true, exercicios: [], nota: "",
    });
  }
  return concluida;
}

// ---- Mente ----

export async function checkinDeHoje(periodo) {
  const regs = await listarPorDia("checkins", diaDoJogo());
  return regs.find((c) => c.periodo === periodo) || null;
}

// MP atual (ou null). Usa os 3 últimos check-ins e o sono de hoje.
export async function lerMP() {
  const todos = await listar("checkins");
  const dia = await lerDia();
  return calcularMP(todos, !!dia.missoes.sono);
}

// Check-in da manhã: 1 toque. +5 XP. Devolve null se já foi feito hoje.
export async function registrarCheckinManha(humor) {
  if (await checkinDeHoje("manha")) return null;
  await adicionar("checkins", {
    dia: diaDoJogo(), quando: agora().getTime(), periodo: "manha", humor,
    emocao: null, intensidade: null, coisasBoas: [], motivo: "",
  });
  const g = await ganhar({ ...RECOMPENSAS.checkinManha, tipo: "checkin", descricao: "Check-in da manhã" });
  return { mp: await lerMP(), subiuPara: g.subiuPara };
}

// Ritual da Noite: +10 XP +1 Cristal. dormiu: true/false/null (null = não perguntado).
// Devolve null se já foi feito hoje.
export async function registrarRitualNoite({ humor, emocao, intensidade, coisasBoas, motivo, dormiu = null }) {
  if (await checkinDeHoje("noite")) return null;
  await adicionar("checkins", {
    dia: diaDoJogo(), quando: agora().getTime(), periodo: "noite", humor, emocao, intensidade,
    coisasBoas, motivo,
  });
  const g = await ganhar({ ...RECOMPENSAS.ritualNoite, tipo: "ritual-noite", descricao: "Ritual da Noite" });
  const subiuPara = [...g.subiuPara];
  if (dormiu !== null) {
    const r = await registrarSono(dormiu);
    if (r) subiuPara.push(...r.subiuPara);
  }
  return { subiuPara, mp: await lerMP() };
}

// Humor médio por dia dos últimos 7 dias: [{dia, humor|null}]
export async function humorUltimos7Dias() {
  const hoje = diaDoJogo();
  const regs = await listarEntreDias("checkins", somarDias(hoje, -6), hoje);
  const saida = [];
  for (let i = 6; i >= 0; i--) {
    const d = somarDias(hoje, -i);
    const doDia = regs.filter((c) => c.dia === d && Number.isFinite(c.humor));
    saida.push({ dia: d, humor: doDia.length ? doDia.reduce((s, c) => s + c.humor, 0) / doDia.length : null });
  }
  return saida;
}

// "Refazer Checagem": volta ao estado não respondido (a tela CORPO pergunta de novo).
export async function salvarParqVazio() {
  const cacador = await lerCacador();
  cacador.parq = { respondido: false, temRisco: false, liberadoMedico: false };
  await salvar("cacador", cacador);
}
