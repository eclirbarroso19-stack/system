// Migração de dados por VERSAO_DADOS. Lógica pura, sem DOM.
// REGRA: MIGRAÇÃO NUNCA APAGA DADOS.
// Cada item: { de, para, transformar(dadosExportados) } e devolve os dados novos.
import { VERSAO_DADOS } from "../config.js";

export const MIGRACOES = [];

// Aplica, em ordem, as migrações que faltam até a versão atual.
// `dados` é um backup { versaoDados, stores, ... }. Devolve uma cópia atualizada.
export function migrarDados(dados, migracoes = MIGRACOES, alvo = VERSAO_DADOS) {
  let atual = structuredClone(dados);
  let v = atual.versaoDados;
  while (v < alvo) {
    const m = migracoes.find((x) => x.de === v);
    if (!m) throw new Error(`Sem migração de ${v} para ${v + 1}`);
    atual = m.transformar(atual);
    atual.versaoDados = m.para;
    v = m.para;
  }
  return atual;
}
