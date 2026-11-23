// TODOS os textos do app. Fonte: docs/textos-v1.md (aprovado) e Livro seção 13.
// Placeholders: {N} {H} {X} {MP} {TÍTULO}

export function preencher(texto, valores = {}) {
  return texto.replace(/\{([^}]+)\}/g, (m, chave) => (chave in valores ? String(valores[chave]) : m));
}

export const abertura = {
  deteccao: "[O SISTEMA DETECTOU UM CAÇADOR ADORMECIDO.]",
  iniciar: "[INICIAR O DESPERTAR?]",
  aceitar: "ACEITAR",
  agoraNao: "Agora não",
  perguntaNome: "Como o Sistema deve te chamar?",
  honestidade: "[NÃO EXISTE RESPOSTA CERTA. O SISTEMA SÓ FUNCIONA COM A VERDADE.]",
};

// Cada opção vale 0, 25, 50, 75 ou 100 pontos (da primeira para a última).
export const PONTOS_OPCAO = [0, 25, 50, 75, 100];

export const perguntasDespertar = [
  { area: "financas", emoji: "💰", nome: "Finanças",
    pergunta: "Chega o fim do mês. Como costuma ficar o seu dinheiro?",
    opcoes: ["Falta, e eu me endivido (cartão, empréstimo, fiado)", "Fica no zero, contando moeda", "Sobra um pouco, mas acabo gastando", "Sobra e às vezes eu guardo", "Sobra, eu guardo todo mês e tenho uma reserva"] },
  { area: "corpo", emoji: "⚔️", nome: "Corpo",
    pergunta: "Na última semana, em quantos dias você se exercitou por pelo menos 20 minutos?",
    opcoes: ["Nenhum", "1 dia", "2 dias", "3 ou 4 dias", "5 dias ou mais"] },
  { area: "mente", emoji: "🌑", nome: "Mente",
    pergunta: "Nas últimas 2 semanas, com que frequência você se sentiu animado e de bom humor?",
    opcoes: ["Nunca", "Poucas vezes", "Metade do tempo", "Na maior parte do tempo", "O tempo todo"] },
  { area: "gestao", emoji: "🎯", nome: "Gestão pessoal",
    pergunta: "Pense no dia de ontem. Você planejou o que ia fazer e cumpriu?",
    opcoes: ["Não planejo meus dias", "Planejei, mas quase nada saiu", "Cumpri mais ou menos a metade", "Cumpri quase tudo", "Cumpri tudo e ainda revisei o dia"] },
  { area: "profissional", emoji: "🧠", nome: "Profissional",
    pergunta: "Nos últimos 30 dias, você aprendeu algo novo para a sua carreira e colocou em prática?",
    opcoes: ["Não aprendi nada novo", "Pensei em estudar, mas não comecei", "Estudei, mas não pratiquei", "Estudei e pratiquei um pouco", "Estudei, pratiquei e entreguei algo"] },
  { area: "relacionamentos", emoji: "💬", nome: "Relacionamentos",
    pergunta: "Se você tivesse um problema sério hoje às 3h da manhã, quantas pessoas poderia chamar?",
    opcoes: ["Nenhuma", "Uma, mas com receio", "Uma, com confiança", "Duas ou três", "Quatro ou mais"] },
  { area: "espiritualidade", emoji: "✨", nome: "Espiritualidade",
    pergunta: "Hoje, quanto você sente que a sua vida tem um propósito claro?",
    opcoes: ["Nada", "Pouco", "Mais ou menos", "Bastante", "Totalmente"] },
];

export const resultadoDespertar = {
  concluida: "[ANÁLISE CONCLUÍDA.]",
  area: "[{ÁREA}: RANK {RANK} (PROVISÓRIO)]",
  rankCacador: "[RANK DO CAÇADOR: E · TÍTULO: O MAIS FRACO DE TODOS]",
  jornada: "[SUA JORNADA COMEÇA AGORA.]",
};

export const checagemSeguranca = {
  perguntas: [
    "Algum médico já disse que você tem problema no coração ou pressão alta?",
    "Você sente dor no peito em repouso, no dia a dia ou quando faz exercício?",
    "Você já perdeu o equilíbrio por tontura ou desmaiou no último ano?",
    "Você tem alguma doença crônica (diabetes, asma, outra) diagnosticada?",
    "Você toma remédio contínuo para alguma doença?",
    "Você tem algum problema nos ossos, articulações ou coluna que piora com exercício?",
    "Algum médico já disse que você só deve fazer exercício com acompanhamento?",
  ],
  opcoes: ["Sim", "Não"],
  liberado: "[CORPO LIBERADO PARA O TREINO.]",
  atencao: "[ATENÇÃO, CAÇADOR. CONVERSE COM UM MÉDICO ANTES DE TREINAR PESADO.]",
  caminhadaLeve: "Caminhada leve de 15 min",
  liberadoMedico: "Fui liberado pelo médico",
};

export const mensagens = {
  missaoDisponivel: "[MISSÃO DIÁRIA DISPONÍVEL]",
  missaoConcluida: "[MISSÃO CONCLUÍDA: +10 XP · +1 CRISTAL]",
  todasConcluidas: "[MISSÃO DIÁRIA CONCLUÍDA. RECOMPENSA: +30 XP · +5 CRISTAIS]",
  raidConcluido: "[RAID CONCLUÍDO: +5 XP]",
  raidConcluidoSemXP: "[RAID CONCLUÍDO. O LIMITE DE XP DE RAIDS DE HOJE FOI ATINGIDO.]",
  levelUp: "[LEVEL UP! NÍVEL {N} ALCANÇADO. +3 PONTOS DE FOCO]",
  alerta21h: "[ALERTA: O DIA TERMINA EM {H} HORAS. MISSÕES PENDENTES: {X}]",
  penalidade: "[PENALIDADE: −10 HP. MISSÃO DE PUNIÇÃO LIBERADA.]",
  punicaoCumprida: "[PUNIÇÃO CUMPRIDA. O SISTEMA RECONHECE SEU ESFORÇO.]",
  hpZerou: "[HP CRÍTICO. VOCÊ ENTROU NA ZONA DE PENALIDADE. 3 DIAS PARA SAIR.]",
  saiuDaZona: "[VOCÊ SOBREVIVEU. HP RESTAURADO PARA 50.]",
  descanso: "[RECUPERAÇÃO CONCLUÍDA. O DESCANSO TAMBÉM É TREINO.]",
  faltouTreino: "[VOCÊ ESTÁ FICANDO FRACO. VOLTE A TREINAR.]",
  impulso: "[IMPULSO DETECTADO. DA PRÓXIMA VEZ, ESPERE 24 HORAS.]",
  ouroConcluido: "[REGISTRO DO OURO CONCLUÍDO.]",
  checkinManha: "[CHECK-IN REGISTRADO. MP: {MP}]",
  ritualNoite: "[RITUAL DA NOITE CONCLUÍDO. DESCANSE, CAÇADOR.]",
  sexta: "[DIA DO CONSELHO. FAÇA O BACKUP DOS SEUS DADOS.]",
  backupFeito: "[MEMÓRIA DO SISTEMA PROTEGIDA.]",
  tituloNovo: "[TÍTULO DESBLOQUEADO: {TÍTULO}]",
};

// Mensagens da casca do app (etapa 1.1)
export const sistema = {
  emConstrucao: "[ÁREA EM CONSTRUÇÃO]",
  novaVersao: "[NOVA VERSÃO DISPONÍVEL]",
  atualizar: "ATUALIZAR",
};

// Avisos obrigatórios (Livro 13)
export const avisos = {
  emocoes: "O SYSTEM ajuda no autoconhecimento, mas não substitui um psicólogo.",
  treino: "O SYSTEM orienta, mas não substitui um profissional de educação física.",
  financas: "O SYSTEM educa sobre dinheiro e não recomenda produtos de investimento.",
  geral: "O SYSTEM orienta e não substitui psicólogo, profissional de educação física ou consultor financeiro",
  cvv: "CVV 188",
  cvvTel: "tel:188",
};

// Categorias de saída (tipo: "essencial" | "nao-essencial" | "escolhe")
export const categoriasSaida = [
  { id: "moradia", emoji: "🏠", nome: "Moradia", tipo: "essencial", exemplos: "aluguel, condomínio, IPTU" },
  { id: "contas", emoji: "💡", nome: "Contas da casa", tipo: "essencial", exemplos: "luz, água, gás, internet, celular" },
  { id: "mercado", emoji: "🛒", nome: "Mercado e feira", tipo: "essencial", exemplos: "supermercado, feira, padaria" },
  { id: "transporte", emoji: "🏍️", nome: "Transporte", tipo: "essencial", exemplos: "gasolina da moto, manutenção, moto-táxi, passagem" },
  { id: "saude", emoji: "💊", nome: "Saúde", tipo: "essencial", exemplos: "farmácia, consulta, plano" },
  { id: "educacao", emoji: "📚", nome: "Educação", tipo: "essencial", exemplos: "faculdade, cursos, livros" },
  { id: "dividas", emoji: "💳", nome: "Dívidas e parcelas", tipo: "essencial", exemplos: "cartão, empréstimo, financiamento, fiado" },
  { id: "comida-fora", emoji: "🍔", nome: "Comida fora e delivery", tipo: "nao-essencial", exemplos: "lanche, restaurante, iFood" },
  { id: "lazer", emoji: "🎮", nome: "Lazer e assinaturas", tipo: "nao-essencial", exemplos: "streaming, jogos, passeios, apps" },
  { id: "compras", emoji: "👕", nome: "Compras pessoais", tipo: "nao-essencial", exemplos: "roupa, salão, eletrônicos" },
  { id: "outros", emoji: "📦", nome: "Outros", tipo: "escolhe", exemplos: "o que não couber acima" },
];

export const categoriasEntrada = [
  { id: "salario", emoji: "💼", nome: "Salário", exemplos: "" },
  { id: "renda-extra", emoji: "💰", nome: "Renda extra", exemplos: "vendas, bicos, serviços" },
  { id: "beneficios", emoji: "🏛️", nome: "Benefícios", exemplos: "Bolsa Família, Pé-de-Meia etc." },
  { id: "outros", emoji: "🎁", nome: "Outros", exemplos: "" },
];

// "[MISSÃO CONCLUÍDA: +10 XP · +1 CRISTAL]" com os valores reais (a Zona pode reduzir o XP).
export function msgMissaoConcluida(xp, cristais) {
  if (xp === 10 && cristais === 1) return mensagens.missaoConcluida;
  const c = cristais === 1 ? "CRISTAL" : "CRISTAIS";
  return `[MISSÃO CONCLUÍDA: +${xp} XP · +${cristais} ${c}]`;
}
