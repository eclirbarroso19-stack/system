// Regras de treino, Fadiga, MP e Checagem de Segurança (Livro 2.2, 6.1, 7.2). Lógica pura, sem DOM e sem banco.
import { somarDias, diaDaSemana } from "./dia.js";

// Dias padrão de treino: segunda, quarta e sexta (0 = domingo ... 6 = sábado).
export const DIAS_TREINO_PADRAO = [1, 3, 5];

// Lista vazia = ainda não escolheu = padrão.
export function diasTreinoEfetivos(diasTreino) {
  return Array.isArray(diasTreino) && diasTreino.length ? diasTreino : DIAS_TREINO_PADRAO;
}

// Checagem de Segurança: respostas = array de booleans (true = SIM). Qualquer SIM = risco.
export function avaliarParq(respostas) {
  return { temRisco: respostas.some(Boolean) };
}

// MP = média dos 3 últimos humores (1–5) × 20, +10 se dormiu antes das 23h, máximo 100.
// checkins: [{humor, quando}] em qualquer ordem. Sem check-ins -> null.
export function calcularMP(checkins, dormiuAntes23 = false) {
  const validos = (checkins || []).filter((c) => Number.isFinite(c?.humor));
  if (!validos.length) return null;
  const ultimos = [...validos].sort((a, b) => (b.quando || 0) - (a.quando || 0)).slice(0, 3);
  const media = ultimos.reduce((s, c) => s + c.humor, 0) / ultimos.length;
  return Math.min(100, Math.round(media * 20 + (dormiuAntes23 ? 10 : 0)));
}

export function cargaTreino(esforco, minutos) {
  return esforco * minutos;
}

// Fadiga 0–100: carga dos últimos 7 dias ÷ média semanal das 4 semanas anteriores.
// Razão 1,0 = 50; razão >= 1,6 = 100; razão 0 = 0 (linear entre os pontos).
// Sem 4 semanas de histórico (nenhum treino com 28 dias ou mais) -> null ("calibrando").
// treinos: [{dia, esforco, minutos}]
export function calcularFadiga(treinos, hoje) {
  const lista = treinos || [];
  if (!lista.length) return null;
  const maisAntigo = lista.reduce((m, t) => (t.dia < m ? t.dia : m), lista[0].dia);
  if (maisAntigo > somarDias(hoje, -28)) return null;

  const inicioRecente = somarDias(hoje, -6);
  const inicioBase = somarDias(hoje, -34);
  let recente = 0, base = 0;
  for (const t of lista) {
    const c = cargaTreino(t.esforco, t.minutos);
    if (t.dia >= inicioRecente && t.dia <= hoje) recente += c;
    else if (t.dia >= inicioBase && t.dia < inicioRecente) base += c;
  }
  const mediaSemanal = base / 4;
  if (mediaSemanal === 0) return recente > 0 ? 100 : 0;
  const razao = recente / mediaSemanal;
  const valor = razao <= 1 ? razao * 50 : 50 + ((razao - 1) / 0.6) * 50;
  return Math.max(0, Math.min(100, Math.round(valor)));
}

// Carga total dos últimos 7 dias (incluindo hoje).
export function cargaDaSemana(treinos, hoje) {
  const inicio = somarDias(hoje, -6);
  return (treinos || []).filter((t) => t.dia >= inicio && t.dia <= hoje).reduce((s, t) => s + cargaTreino(t.esforco, t.minutos), 0);
}

// O que mostrar hoje: "treino" | "descanso" | "caminhadaLeve".
export function treinoDoDia(diasTreino, dia, parq) {
  if (parq?.temRisco && !parq?.liberadoMedico) return "caminhadaLeve";
  return diasTreinoEfetivos(diasTreino).includes(diaDaSemana(dia)) ? "treino" : "descanso";
}

// Dia de treino planejado em que não houve treino registrado nem descanso.
export function faltouTreinoPlanejado(dia, diasTreino, treinosDoDia, teveDescanso = false) {
  const planejado = diasTreinoEfetivos(diasTreino).includes(diaDaSemana(dia));
  return planejado && (treinosDoDia || []).length === 0 && !teveDescanso;
}
