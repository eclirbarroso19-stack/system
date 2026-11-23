// Serviço do caçador: TODO ganho/perda de XP, HP e Cristais passa por ganhar().
import { obter, salvar, adicionar } from "./db.js";
import { diaDoJogo, agora } from "./dia.js";
import { calcularGanho, criarDiaVazio } from "./regras.js";

export async function lerCacador() {
  return obter("cacador", "eu");
}

export async function lerDia(dia = diaDoJogo()) {
  return (await obter("dias", dia)) || criarDiaVazio(dia);
}

// Aplica as regras, grava caçador, dia e evento.
// Devolve { cacador, subiuPara, evento, eventoId, antes: {cacador, dia} } (antes serve para desfazer).
export async function ganhar({ xp = 0, cristais = 0, hp = 0, tipo = "", descricao = "", foraDoLimite = false } = {}) {
  const cacador = await lerCacador();
  if (!cacador) throw new Error("Caçador ainda não existe.");
  const dia = await lerDia();
  const r = calcularGanho(cacador, dia, { xp, cristais, hp, tipo, descricao, foraDoLimite }, agora().getTime());
  await salvar("cacador", r.cacador);
  await salvar("dias", r.dia);
  const eventoId = await adicionar("eventos", r.evento);
  return { cacador: r.cacador, subiuPara: r.subiuPara, evento: r.evento, eventoId, antes: { cacador, dia } };
}
