// O dia a dia do jogo: avaliação dos dias encerrados, missões e desfazer.
import { obter, salvar, adicionar, apagar, listarPorDia, lerMeta, gravarMeta } from "./db.js";
import { diaDoJogo, somarDias, agora } from "./dia.js";
import { ganhar, lerCacador, lerDia } from "./cacador.js";
import {
  criarDiaVazio, diasParaAvaliar, processarDiaEncerrado, recompensaDaMissao,
  MISSOES_V1, MISSOES_ZONA, RECOMPENSAS, RAID_XP, raidTerminou, registrarRaidConcluido, resumoRaids,
} from "./regras.js";
import { statusMissaoOuro, planoDoOuro, criarLancamento } from "./ouro.js";

let _rodando = null;

// Roda ao iniciar o app e ao voltar do segundo plano. Seguro chamar várias vezes.
export function abrirDia() {
  if (_rodando) return _rodando;
  _rodando = _abrirDia().finally(() => { _rodando = null; });
  return _rodando;
}

async function _abrirDia() {
  let cacador = await lerCacador();
  if (!cacador) return;
  const hoje = diaDoJogo();

  let diaHoje = await obter("dias", hoje);
  if (!diaHoje) { diaHoje = criarDiaVazio(hoje); await salvar("dias", diaHoje); }

  let ultimo = await lerMeta("ultimoDiaAvaliado");
  if (!ultimo) { ultimo = somarDias(hoje, -1); await gravarMeta("ultimoDiaAvaliado", ultimo); }

  const pendentes = diasParaAvaliar(ultimo, hoje);
  const fila = [];
  if (pendentes.length) {
    const anterior = await obter("dias", somarDias(pendentes[0], -1));
    let carregaPunicao = !!anterior?.resultado?.gerarPunicao;
    for (const d of pendentes) {
      const reg = (await obter("dias", d)) || criarDiaVazio(d);
      if (carregaPunicao && !reg.punicao.ativa) reg.punicao = { ativa: true, feita: false };
      const r = processarDiaEncerrado(cacador, reg);
      cacador = r.cacador;
      reg.avaliado = true;
      reg.resultado = r.resultado;
      await salvar("dias", reg);
      for (const ev of r.eventos) await adicionar("eventos", { dia: d, quando: agora().getTime(), xp: 0, ...ev });
      fila.push(...r.mensagens);
      carregaPunicao = r.resultado.gerarPunicao;
    }
    await salvar("cacador", cacador);
    await gravarMeta("ultimoDiaAvaliado", pendentes[pendentes.length - 1]);
  } else if (ultimo < somarDias(hoje, -1)) {
    await gravarMeta("ultimoDiaAvaliado", somarDias(hoje, -1));
  }

  // Punição de hoje, se o dia anterior gerou uma.
  const ontem = await obter("dias", somarDias(hoje, -1));
  diaHoje = await obter("dias", hoje);
  if (ontem?.resultado?.gerarPunicao && !diaHoje.punicaoGerada) {
    diaHoje.punicao = { ativa: true, feita: false };
    diaHoje.punicaoGerada = true;
    await salvar("dias", diaHoje);
  }

  if (fila.length) await gravarMeta("filaMensagens", [...((await lerMeta("filaMensagens")) || []), ...fila]);
}

// Devolve as chaves de mensagens pendentes (penalidade, hpZerou, saiuDaZona) e limpa a fila.
export async function consumirFila() {
  const fila = (await lerMeta("filaMensagens")) || [];
  if (fila.length) await gravarMeta("filaMensagens", []);
  return fila;
}

// true só na primeira vez que o app é aberto em cada dia do jogo.
export async function primeiraAberturaDoDia() {
  const hoje = diaDoJogo();
  if ((await lerMeta("ultimoDiaMensagem")) === hoje) return false;
  await gravarMeta("ultimoDiaMensagem", hoje);
  return true;
}

function listaDoDia(cacador) {
  return cacador.zona?.ativa ? MISSOES_ZONA : MISSOES_V1;
}

// Conclui uma missão do dia: XP, Cristais (e bônus se foi a última).
// Devolve null se já estava concluída, ou { xpGanho, cristais, subiuPara, todas, recuperacao, snapshot }.
export async function concluirMissao(id, { recuperacao = false } = {}) {
  const cacador = await lerCacador();
  const dia = await lerDia();
  if (dia.missoes[id]) return null;

  const antesDia = structuredClone(dia);
  const eventoIds = [];
  const rec = recompensaDaMissao(id, recuperacao);

  dia.missoes[id] = true;
  if (id === "treino") dia.recuperacao = recuperacao;
  await salvar("dias", dia);

  const g1 = await ganhar({
    xp: rec.xp, cristais: rec.cristais, hp: recuperacao ? 10 : 0,
    tipo: recuperacao ? "recuperacao" : "missao", descricao: id,
  });
  eventoIds.push(g1.eventoId);
  const subiuPara = [...g1.subiuPara];

  const atual = await lerDia();
  const todas = listaDoDia(g1.cacador).every((m) => atual.missoes[m.id]) && !atual.bonusDado;
  if (todas) {
    atual.bonusDado = true;
    await salvar("dias", atual);
    const g2 = await ganhar({ ...RECOMPENSAS.todasMissoes, tipo: "todas-missoes", descricao: "bônus do dia" });
    eventoIds.push(g2.eventoId);
    subiuPara.push(...g2.subiuPara);
  }
  return {
    xpGanho: g1.evento.xp, cristais: g1.evento.cristais, subiuPara, todas, recuperacao,
    snapshot: { cacador, dia: antesDia, eventoIds },
  };
}

// Desfaz uma conclusão (só para corrigir toque errado): restaura o estado e apaga os eventos.
export async function desfazerConclusao(snapshot) {
  await salvar("cacador", snapshot.cacador);
  await salvar("dias", snapshot.dia);
  for (const id of snapshot.eventoIds) await apagar("eventos", id);
}

export async function salvarPrincipalTexto(texto) {
  const dia = await lerDia();
  dia.principalTexto = texto;
  await salvar("dias", dia);
}

// Raid de Foco: guarda o início para o cronômetro sobreviver ao app fechado.
export async function iniciarRaid(minutos) {
  const dia = await lerDia();
  dia.raid = { inicio: agora().getTime(), minutos };
  await salvar("dias", dia);
}

// Cancelar não dá XP e não entra na lista de raids.
export async function cancelarRaid() {
  const dia = await lerDia();
  delete dia.raid;
  await salvar("dias", dia);
}

// Se o cronômetro do Raid acabou (app aberto ou fechado): registra na lista do dia e paga +5 XP
// (só os 4 primeiros do dia). NÃO conclui a Missão Principal.
// Devolve null (nada a fazer) ou { daXP, subiuPara, n, minutos }.
export async function finalizarRaidSeTerminou() {
  const dia = await lerDia();
  if (!raidTerminou(dia.raid, agora().getTime())) return null;
  const { raids, daXP } = registrarRaidConcluido(dia.raids, dia.raid);
  dia.raids = raids;
  delete dia.raid; // remove antes de pagar: assim nunca paga duas vezes
  await salvar("dias", dia);
  let subiuPara = [];
  if (daXP) {
    const g = await ganhar({ xp: RAID_XP, tipo: "raid", descricao: `Raid de Foco ${raids[raids.length - 1].minutos} min` });
    subiuPara = g.subiuPara;
  }
  const r = resumoRaids(raids);
  return { daXP, subiuPara, n: r.n, minutos: r.minutos };
}

// Missão 4: cumprida com >=1 registro (ou "não gastei nada") e nenhum gasto por impulso.
export async function ouroCumprido() {
  const dia = await lerDia();
  return statusMissaoOuro(await listarPorDia("ouro", dia.dia), dia.semGastos).cumprida;
}

// Ajusta a missão 4 e a recompensa do Ouro (no máximo +10 XP +1 Cristal por dia) conforme os registros.
// Devolve { concluida (resultado de concluirMissao ou null), pagouRegistro, subiuPara, impulso }.
export async function sincronizarOuro() {
  const cacador = await lerCacador();
  const saida = { concluida: null, pagouRegistro: false, subiuPara: [], impulso: false };
  if (!cacador) return saida;
  const dia = await lerDia();
  const regs = await listarPorDia("ouro", dia.dia);
  const zona = !!cacador.zona?.ativa;
  const plano = planoDoOuro({
    lancamentosDoDia: regs, semGastos: dia.semGastos,
    missaoMarcada: !!dia.missoes.ouro, jaPagou: !!dia.ouroPago,
  });
  saida.impulso = plano.status.motivo === "impulso";

  if (zona) {
    // Na Zona a missão 4 não existe: só paga o registro do dia, uma vez.
    if (!dia.ouroPago && regs.length > 0) {
      dia.ouroPago = true;
      await salvar("dias", dia);
      const g = await ganhar({ ...RECOMPENSAS.registroOuro, tipo: "registro-ouro", descricao: "Registro do Ouro do dia" });
      saida.pagouRegistro = true;
      saida.subiuPara = g.subiuPara;
    }
    return saida;
  }

  if (plano.completarMissao) {
    if (plano.pagaMissao) {
      dia.ouroPago = true;
      await salvar("dias", dia);
      saida.concluida = await concluirMissao("ouro");
      saida.pagouRegistro = !!saida.concluida;
      if (saida.concluida) saida.subiuPara = saida.concluida.subiuPara;
    } else { // já pago antes (impulso corrigido): só remarca, sem pagar de novo
      dia.missoes.ouro = true;
      await salvar("dias", dia);
    }
  } else if (plano.desmarcarMissao) {
    dia.missoes.ouro = false; // a recompensa já paga não é estornada
    await salvar("dias", dia);
  } else if (plano.pagarRegistro) {
    dia.ouroPago = true;
    await salvar("dias", dia);
    const g = await ganhar({ ...RECOMPENSAS.registroOuro, tipo: "registro-ouro", descricao: "Registro do Ouro do dia (com impulso)" });
    saida.pagouRegistro = true;
    saida.subiuPara = g.subiuPara;
  }
  return saida;
}

export async function marcarSemGastos() {
  const dia = await lerDia();
  dia.semGastos = true;
  await salvar("dias", dia);
  return sincronizarOuro();
}

// Registra um lançamento no dia do jogo atual. Devolve { lancamento, sync }.
export async function registrarLancamento(dados) {
  const lancamento = criarLancamento(dados, diaDoJogo(), agora().getTime());
  lancamento.id = await adicionar("ouro", lancamento);
  return { lancamento, sync: await sincronizarOuro() };
}

export async function editarLancamento(id, mudancas) {
  const atual = await obter("ouro", id);
  if (!atual) return null;
  const novo = criarLancamento({ ...atual, ...mudancas }, atual.dia, atual.quando);
  novo.id = id;
  await salvar("ouro", novo);
  return { lancamento: novo, sync: await sincronizarOuro() };
}

export async function apagarLancamento(id) {
  await apagar("ouro", id);
  return sincronizarOuro();
}

export async function registrarSono(dormiuCedo) {
  if (dormiuCedo) return concluirMissao("sono");
  const dia = await lerDia();
  dia.sonoRespondido = "nao";
  await salvar("dias", dia);
  return null;
}

// Missão de Punição: sem XP.
export async function concluirPunicao() {
  const dia = await lerDia();
  if (!dia.punicao?.ativa || dia.punicao.feita) return false;
  dia.punicao.feita = true;
  await salvar("dias", dia);
  await adicionar("eventos", { dia: dia.dia, quando: agora().getTime(), tipo: "punicao-cumprida", xp: 0, cristais: 0, hp: 0, descricao: "20 min de caminhada extra" });
  return true;
}
