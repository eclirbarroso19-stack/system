// Backup: exportar / validar / importar. Sem DOM (o download fica em telas/ajustes.js).
import { VERSAO_APP, VERSAO_DADOS } from "../config.js";
import { NOMES_STORES, exportarTudo, importarTudo, gravarMeta, lerMeta } from "./db.js";
import { migrarDados } from "./migracoes.js";
import { diasEntre, diaDaSemana } from "./dia.js";

const p2 = (n) => String(n).padStart(2, "0");

// Data local legível: "22/11/2026 16:30"
export function dataLegivel(d = new Date()) {
  return `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
}

// "system-backup-AAAA-MM-DD.json" com a data LOCAL (nunca toISOString).
export function nomeArquivoBackup(d = new Date(), sufixo = "") {
  return `system-backup-${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}${sufixo}.json`;
}

export function montarBackup(stores, agora = new Date()) {
  return { app: "SYSTEM", versaoDados: VERSAO_DADOS, versaoApp: VERSAO_APP, exportadoEm: dataLegivel(agora), stores };
}

// Função pura: { ok, erro }.
export function validarBackup(obj, versaoAtual = VERSAO_DADOS, nomes = NOMES_STORES) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return { ok: false, erro: "Arquivo não é um backup do SYSTEM." };
  if (obj.app !== "SYSTEM") return { ok: false, erro: "Este arquivo não é um backup do SYSTEM." };
  if (!Number.isInteger(obj.versaoDados) || obj.versaoDados < 1) return { ok: false, erro: "Versão dos dados inválida." };
  if (obj.versaoDados > versaoAtual) return { ok: false, erro: "Este backup é de uma versão mais nova do SYSTEM. Atualize o app antes." };
  if (!obj.stores || typeof obj.stores !== "object") return { ok: false, erro: "O backup está sem dados." };
  const faltam = nomes.filter((n) => !Array.isArray(obj.stores[n]));
  if (faltam.length) return { ok: false, erro: `Faltam gavetas no backup: ${faltam.join(", ")}.` };
  return { ok: true };
}

// Cria o objeto de backup com o estado atual do banco.
export async function criarBackup() {
  return montarBackup(await exportarTudo());
}

// Grava a data do último backup (dia local "AAAA-MM-DD", passado por quem chama).
export async function registrarBackupFeito(dia) {
  await gravarMeta("ultimoBackup", dia);
}

// A data mais recente entre duas chaves "AAAA-MM-DD" (qualquer uma pode faltar).
export function dataMaisRecente(a, b) {
  if (!a) return b;
  if (!b) return a;
  return a >= b ? a : b;
}

// Valida, migra e substitui TUDO pelo conteúdo do backup. Lança erro se inválido.
// Mantém a data de backup mais recente entre a do arquivo e a atual.
export async function restaurarBackup(obj) {
  const v = validarBackup(obj);
  if (!v.ok) throw new Error(v.erro);
  const migrado = migrarDados(obj);
  const atual = await lerMeta("ultimoBackup");
  await importarTudo(migrado.stores);
  const doArquivo = (migrado.stores.meta.find((m) => m.chave === "ultimoBackup") || {}).valor;
  const mais = dataMaisRecente(atual, doArquivo);
  if (mais) await gravarMeta("ultimoBackup", mais);
}

// Pura: devo mostrar o lembrete de backup hoje?
// Sexta (dia do jogo), último backup com mais de 6 dias (ou nunca) e ainda não mostrado hoje.
export function deveLembrarBackup({ dia, ultimoBackup, ultimoLembrete }) {
  if (diaDaSemana(dia) !== 5) return false;
  if (ultimoLembrete === dia) return false;
  if (!ultimoBackup) return true;
  return diasEntre(ultimoBackup, dia) > 6;
}

export async function lerEstadoBackup() {
  return { ultimoBackup: await lerMeta("ultimoBackup"), ultimoLembrete: await lerMeta("ultimoLembreteBackup") };
}

export async function marcarLembreteMostrado(dia) {
  await gravarMeta("ultimoLembreteBackup", dia);
}
