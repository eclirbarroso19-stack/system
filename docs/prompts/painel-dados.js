// SYSTEM: dados do PAINEL. Lido pelo painel.html (abra com duplo clique no Edge).
// O Claude Code atualiza este arquivo junto com o PAINEL.md ao fim de cada etapa.
// status: "feito" | "andamento" | "aberto"
window.PAINEL = {
  atualizadoEm: "23/11/2026",
  etapaAtual: "1.6",
  proximoPasso: "Eclir: testar o checklist da 1.6 (CORPO e MENTE). Depois, etapa 1.7.",
  versoes: [
    {
      id: "0", nome: "Etapa 0", subtitulo: "Preparação",
      etapas: [
        { id: "0.1", nome: "Arquivo de prompts", dias: 2, status: "feito", arquivo: "00-COMO-USAR.md" },
        { id: "0.2", nome: "Ferramentas e anti-trava", dias: 3, status: "feito", arquivo: "v1/0.2-preparar-ferramentas.md" },
        { id: "0.3", nome: "Identidade visual", dias: 0, status: "feito", arquivo: "" },
        { id: "0.4", nome: "Textos da v1", dias: 1, status: "feito", arquivo: "" }
      ]
    },
    {
      id: "1", nome: "v1", subtitulo: "Primeiro SYSTEM no celular",
      etapas: [
        { id: "1.1", nome: "Esqueleto do app", dias: 2, status: "feito", arquivo: "v1/1.1-esqueleto.md" },
        { id: "1.2", nome: "Memória do app + Backup", dias: 2, status: "feito", arquivo: "v1/1.2-memoria.md" },
        { id: "1.3", nome: "Despertar Rápido + Status", dias: 3, status: "feito", arquivo: "v1/1.3-despertar-status.md" },
        { id: "1.4", nome: "Missões diárias", dias: 3, status: "feito", arquivo: "v1/1.4-missoes.md" },
        { id: "1.5", nome: "Registro do Ouro", dias: 2, status: "feito", arquivo: "v1/1.5-registro-ouro.md" },
        { id: "1.6", nome: "Treino + Check-in + Ritual", dias: 3, status: "feito", arquivo: "v1/1.6-treino-mente.md" },
        { id: "1.7", nome: "Instalar e fechar a v1", dias: 2, status: "aberto", arquivo: "v1/1.7-publicar.md" },
        { id: "1.8", nome: "Uso real e ajustes", dias: 5, status: "aberto", arquivo: "v1/B-modelo-conserto.md" }
      ]
    },
    {
      id: "2", nome: "v2", subtitulo: "Diagnóstico completo + Dinheiro",
      etapas: [
        { id: "2.1", nome: "Teste do Despertar completo", dias: 5, status: "aberto", arquivo: "v2/esboco.md" },
        { id: "2.2", nome: "FOFA em jogo + vilão pessoal", dias: 3, status: "aberto", arquivo: "v2/esboco.md" },
        { id: "2.3", nome: "Espelho do Dinheiro", dias: 2, status: "aberto", arquivo: "v2/esboco.md" },
        { id: "2.4", nome: "Dungeon do Ouro + 6 Baús", dias: 4, status: "aberto", arquivo: "v2/esboco.md" },
        { id: "2.5", nome: "Monstros + Missão da Reserva", dias: 3, status: "aberto", arquivo: "v2/esboco.md" },
        { id: "2.6", nome: "Relatório do Mês", dias: 3, status: "aberto", arquivo: "v2/esboco.md" },
        { id: "2.7", nome: "Uso real e ajustes", dias: 5, status: "aberto", arquivo: "v2/esboco.md" }
      ]
    },
    {
      id: "3", nome: "v3", subtitulo: "Corpo + Gestão",
      etapas: [
        { id: "3.1", nome: "Árvore do Corpo (6 × 6)", dias: 5, status: "aberto", arquivo: "v3/esboco.md" },
        { id: "3.2", nome: "3 modos + tela de treino", dias: 4, status: "aberto", arquivo: "v3/esboco.md" },
        { id: "3.3", nome: "Exame do Corpo + Fadiga", dias: 3, status: "aberto", arquivo: "v3/esboco.md" },
        { id: "3.4", nome: "Árvore do Destino + WOOP", dias: 4, status: "aberto", arquivo: "v3/esboco.md" },
        { id: "3.5", nome: "Missões Principais + Raid de Foco", dias: 3, status: "aberto", arquivo: "v3/esboco.md" },
        { id: "3.6", nome: "Conselho de Sexta + Pontos de Foco", dias: 3, status: "aberto", arquivo: "v3/esboco.md" },
        { id: "3.7", nome: "Uso real e ajustes", dias: 5, status: "aberto", arquivo: "v3/esboco.md" }
      ]
    },
    {
      id: "4", nome: "v4", subtitulo: "Mente + Sombras + Relacionamentos",
      etapas: [
        { id: "4.1", nome: "Grimório + feitiços", dias: 4, status: "aberto", arquivo: "v4/esboco.md" },
        { id: "4.2", nome: "Registro de Batalha (4 tipos)", dias: 4, status: "aberto", arquivo: "v4/esboco.md" },
        { id: "4.3", nome: "WHO-5 e segurança", dias: 2, status: "aberto", arquivo: "v4/esboco.md" },
        { id: "4.4", nome: "Exército das Sombras", dias: 5, status: "aberto", arquivo: "v4/esboco.md" },
        { id: "4.5", nome: "Círculo de Aliados + Fala de Paz", dias: 5, status: "aberto", arquivo: "v4/esboco.md" },
        { id: "4.6", nome: "Uso real e ajustes", dias: 5, status: "aberto", arquivo: "v4/esboco.md" }
      ]
    },
    {
      id: "5", nome: "v5", subtitulo: "Profissional + Espiritualidade + Progressão",
      etapas: [
        { id: "5.1", nome: "Missão de Estudo + revisão", dias: 4, status: "aberto", arquivo: "v5/esboco.md" },
        { id: "5.2", nome: "Dungeons de carreira + Conquistas", dias: 3, status: "aberto", arquivo: "v5/esboco.md" },
        { id: "5.3", nome: "Espiritualidade", dias: 4, status: "aberto", arquivo: "v5/esboco.md" },
        { id: "5.4", nome: "Boss Semanal + Loja", dias: 3, status: "aberto", arquivo: "v5/esboco.md" },
        { id: "5.5", nome: "Títulos + Exames de Promoção", dias: 3, status: "aberto", arquivo: "v5/esboco.md" },
        { id: "5.6", nome: "Reavaliação de 90 dias", dias: 3, status: "aberto", arquivo: "v5/esboco.md" },
        { id: "5.7", nome: "Uso real e ajustes", dias: 5, status: "aberto", arquivo: "v5/esboco.md" }
      ]
    },
    {
      id: "6", nome: "v6", subtitulo: "Portais Ocultos + Arte e Som",
      etapas: [
        { id: "6.1", nome: "Motor dos portais + Alquimista", dias: 6, status: "aberto", arquivo: "v6/esboco.md" },
        { id: "6.2", nome: "Silêncio + Corte Oculta", dias: 5, status: "aberto", arquivo: "v6/esboco.md" },
        { id: "6.3", nome: "Mercador + Fundador + Guerreiro", dias: 6, status: "aberto", arquivo: "v6/esboco.md" },
        { id: "6.4", nome: "Vilões ilustrados", dias: 4, status: "aberto", arquivo: "v6/esboco.md" },
        { id: "6.5", nome: "Sons e animações", dias: 4, status: "aberto", arquivo: "v6/esboco.md" },
        { id: "6.6", nome: "Uso real e ajustes", dias: 5, status: "aberto", arquivo: "v6/esboco.md" }
      ]
    }
  ],
  diario: [
{ data: "23/11/2026", texto: "Etapa 1.6 concluída: regras de MP, Fadiga e treino do dia; telas CORPO (Checagem de Segurança, treino, descanso, histórico) e MENTE (check-in, Ritual da Noite, CVV 188); MP no STATUS e em MISSÕES; 69 testes. Antes, ajustes da 1.5 (teto do diagnóstico 74, botões, mês, XP do Raid). Decisões: dias de treino vazios = seg/qua/sex; Fadiga só com 28 dias de histórico; o ritual só pergunta do sono se a missão 5 ainda está aberta." },
    { data: "23/11/2026", texto: "Etapa 1.5 concluída: regras puras do Ouro, tela OURO com registro rápido, lista do dia, editar/apagar e resumo do mês; missão 4 ligada aos registros; 56 testes. Antes, ajuste da 1.4: Raid de Foco não conclui a Missão Principal (+5 XP, só os 4 primeiros do dia). Decisão: o Ouro paga no máximo +10 XP +1 Cristal por dia; com impulso a missão 4 não conta mas o registro paga; sem estorno." },
    { data: "23/11/2026", texto: "Etapa 1.4 concluída: regras do dia e da Zona; avaliação dos dias ao abrir; tela MISSÕES com Raid de Foco, punição, level up e alerta das 21h; modo de teste com AVANÇAR 1 DIA e dados fictícios; 39 testes. Antes, ajustes da 1.3: cores dos ranks, marca MAIS FRACA e selo sem quebra de linha. Decisões: TREINEI dá 30 XP e 3 Cristais; o alerta das 21h vale também de 0h às 4h." },
    { data: "22/11/2026", texto: "Etapa 1.3 concluída: regras de XP, nível e rank; serviço do caçador; Despertar Rápido com resultado e radar; tela STATUS; refazer nos Ajustes; 26 testes. Antes, ajuste da 1.2: a data do backup agora vai dentro do arquivo e a mais recente é mantida ao restaurar. Versão do app 0.1.7." },
    { data: "22/11/2026", texto: "Etapa 1.2 concluída: banco IndexedDB (20 stores, modo ?teste=1), migrações, backup/restaurar/apagar tudo, lembrete da sexta, formato.js e 17 testes verdes. Antes, ajustes da 1.1: fonte Audiowide no lugar da Orbitron, cores do tests.html e id no manifesto. Versão do app 0.1.3." },
    { data: "22/11/2026", texto: "Etapa 1.1 concluída: bibliotecas, fontes e ícones locais; manifesto; CSS neon; casca com 6 rotas; ui.js; textos.js; service worker com aviso de nova versão; 8 testes verdes. Etapa 0.2 marcada como feita." },
    { data: "22/11/2026", texto: "Etapa 0.2 (parte do Claude Code): criados package.json, página de teste (index.html), js/nucleo/dia.js, testes (tests/testes.js, tests/rodar.mjs, tests.html) e primeiro commit. Sem push: falta o Eclir fazer o push e ligar o Pages." },
    { data: "22/11/2026", texto: "Painel melhorado: as etapas abrem formatadas dentro do painel, com botão COPIAR, checklist marcável e botão TESTEI E ESTÁ OK, que mostra o prompt da próxima. O progresso é marcado só pelo Claude Code." },
    { data: "21/11/2026", texto: "Arquivo de prompts montado pelo Claude: CLAUDE.md, permissões, .gitignore, PAINEL e etapas da v1. Aguardando revisão do Eclir." },
    { data: "21/11/2026", texto: "Logo, paleta, fontes e textos da v1 aprovados. Livro de Regras v0.3 com a seção 16 (técnica e anti-trava)." }
  ]
};
