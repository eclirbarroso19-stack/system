// Regras do jogo (Livro 2, 3, 4). Lógica pura, sem DOM e sem banco.

export const LIMITE_XP_DIA = 300;

// Livro 3.1: { xp, cristais }
export const RECOMPENSAS = {
  missao: { xp: 10, cristais: 1 },
  todasMissoes: { xp: 30, cristais: 5 },
  principal: { xp: 25, cristais: 3 },
  secundaria: { xp: 5, cristais: 0 },
  treino: { xp: 30, cristais: 3 },
  recuperacao: { xp: 15, cristais: 1 },
  registroOuro: { xp: 10, cristais: 1 },
  checkinManha: { xp: 5, cristais: 0 },
  ritualNoite: { xp: 10, cristais: 1 },
  registroBatalha: { xp: 15, cristais: 1 },
  estudo: { xp: 20, cristais: 2 },
  revisao: { xp: 5, cristais: 0 },
  conexao: { xp: 10, cristais: 1 },
  ritualEspiritual: { xp: 10, cristais: 1 },
  bossSemanal: { cristais: 20 }, // o XP é o que falta para o próximo nível
};

export const AREAS = ["financas", "corpo", "mente", "gestao", "profissional", "relacionamentos", "espiritualidade"];
export const ATRIBUTOS = ["forca", "agilidade", "vitalidade", "financas", "disciplina", "inteligencia", "carisma", "espirito"];

// XP para sair do nível n e ir para n+1.
export function xpParaProximo(n) {
  return 50 + 30 * n;
}

// Nível a partir do XP total (começa no nível 1).
export function nivelDe(xpTotal) {
  let nivel = 1;
  let resto = Math.max(0, xpTotal);
  while (resto >= xpParaProximo(nivel)) {
    resto -= xpParaProximo(nivel);
    nivel++;
  }
  return { nivel, xpNoNivel: resto, xpParaProximo: xpParaProximo(nivel) };
}

export function rankDaNota(nota) {
  if (nota >= 90) return "S";
  if (nota >= 75) return "A";
  if (nota >= 60) return "B";
  if (nota >= 40) return "C";
  if (nota >= 20) return "D";
  return "E";
}

// Opção 0..4 vale 0, 25, 50, 75, 100.
export function notaDaOpcao(indice) {
  return indice * 25;
}

// Aplica XP com o limite diário e a Zona de Penalidade.
// Devolve { xpGanho, xpTotal, subiuPara: [níveis novos] }. O XP nunca diminui.
export function aplicarXP(xpTotal, xpJaGanhoHoje, xp, { foraDoLimite = false, zona = false } = {}) {
  let ganho = Math.max(0, xp);
  if (zona) ganho = Math.floor(ganho / 2);
  if (!foraDoLimite) ganho = Math.min(ganho, Math.max(0, LIMITE_XP_DIA - xpJaGanhoHoje));
  const antes = nivelDe(xpTotal).nivel;
  const novoTotal = xpTotal + ganho;
  const depois = nivelDe(novoTotal).nivel;
  const subiuPara = [];
  for (let n = antes + 1; n <= depois; n++) subiuPara.push(n);
  return { xpGanho: ganho, xpTotal: novoTotal, subiuPara };
}

export function criarCacadorInicial(nome) {
  return {
    id: "eu",
    nome,
    nivel: 1,
    xpTotal: 0,
    hp: 100,
    cristais: 0,
    rankCacador: "E",
    titulo: "O Mais Fraco de Todos",
    classe: "Caçador",
    pontosFoco: 0,
    ranksArea: {},
    atributos: Object.fromEntries(ATRIBUTOS.map((a) => [a, null])), // null = não medido
    parq: { respondido: false, temRisco: false, liberadoMedico: false },
    diasTreino: [],
    zona: { ativa: false, diasCumpridos: 0 },
  };
}

export function criarDiaVazio(dia) {
  return {
    dia,
    missoes: { treino: false, agua: false, principal: false, ouro: false, sono: false },
    principalTexto: "",
    semGastos: false,
    punicao: { ativa: false, feita: false },
    xpDia: 0,
    avaliado: false,
    resultado: null,
  };
}

const limitar = (v, min, max) => Math.max(min, Math.min(max, v));

// Calcula o efeito de um ganho/perda sobre o caçador e o dia, sem gravar nada.
// Devolve { cacador, dia, evento, subiuPara } (novos objetos).
export function calcularGanho(cacador, diaReg, { xp = 0, cristais = 0, hp = 0, tipo = "", descricao = "", foraDoLimite = false } = {}, quando = Date.now()) {
  const r = aplicarXP(cacador.xpTotal, diaReg.xpDia || 0, xp, { foraDoLimite, zona: !!cacador.zona?.ativa });
  const novo = { ...cacador };
  novo.xpTotal = r.xpTotal;
  novo.nivel = nivelDe(r.xpTotal).nivel;
  novo.pontosFoco = (cacador.pontosFoco || 0) + 3 * r.subiuPara.length;
  const hpNovo = limitar(cacador.hp + hp, 0, 100);
  const cristaisNovo = Math.max(0, cacador.cristais + cristais);
  novo.hp = hpNovo;
  novo.cristais = cristaisNovo;
  // Se o XP não conta para o limite do dia (Boss, meta mensal), o contador do dia não cresce.
  const dia = { ...diaReg, xpDia: foraDoLimite ? diaReg.xpDia || 0 : (diaReg.xpDia || 0) + r.xpGanho };
  const evento = {
    dia: diaReg.dia, quando, tipo, descricao,
    xp: r.xpGanho, cristais: cristaisNovo - cacador.cristais, hp: hpNovo - cacador.hp,
  };
  return { cacador: novo, dia, evento, subiuPara: r.subiuPara };
}

// ---- Cores e marca dos ranks (CLAUDE.md seção 5) ----
export const ORDEM_RANKS = ["E", "D", "C", "B", "A", "S"];

const CORES_RANK = { E: "#8A9BB0", D: "#2BE38B", C: "#00D4FF", B: "#B57BFF", A: "#FF8A3D", S: "#FFD34D" };

// ÚNICA fonte da cor de um rank. Só a letra usa essa cor; só o S brilha.
export function corDoRank(rank) {
  return CORES_RANK[rank] || CORES_RANK.E;
}

// Áreas que ganham a marca "⚠ MAIS FRACA": as de rank mais baixo.
// Em empate, todas as empatadas; nenhuma se todas tiverem o mesmo rank.
// ranksArea: { area: { rank } }. Considera só as áreas que têm rank.
export function areasMaisFracas(ranksArea) {
  const lista = Object.entries(ranksArea || {}).filter(([, v]) => v && ORDEM_RANKS.includes(v.rank));
  if (lista.length === 0) return [];
  const indices = lista.map(([, v]) => ORDEM_RANKS.indexOf(v.rank));
  const menor = Math.min(...indices);
  if (menor === Math.max(...indices)) return [];
  return lista.filter(([, v]) => ORDEM_RANKS.indexOf(v.rank) === menor).map(([area]) => area);
}
