# PAINEL DO SYSTEM

> **Para o Claude Code:** este é o estado oficial do projeto. Leia antes de começar e atualize ao terminar cada sub-passo e cada etapa.
> Mantenha `painel-dados.js` igual a este arquivo (mesmos status, próximo passo e diário).
> Status: ✅ concluído · 🔄 em andamento · ⬜ aberto

**Atualizado em:** 23/11/2026
**Etapa atual:** 1.8 (uso real; v1.0 publicada)
**Próximo passo:** Uso real por 5 dias úteis. Anote o que incomoda e use o Prompt B (modelo da etapa 1.8).

---

## Progresso

| Versão | Etapas | Progresso |
|---|---|---|
| Etapa 0: Preparação | 4/4 | ██████████ 100% |
| v1: Primeiro SYSTEM no celular | 7/8 | ████████░░ 90% |
| v2: Diagnóstico + Dinheiro | 0/7 | ░░░░░░░░░░ 0% |
| v3: Corpo + Gestão | 0/7 | ░░░░░░░░░░ 0% |
| v4: Mente + Sombras + Relacionamentos | 0/6 | ░░░░░░░░░░ 0% |
| v5: Profissional + Espiritualidade + Progressão | 0/7 | ░░░░░░░░░░ 0% |
| v6: Portais Ocultos + Arte e Som | 0/6 | ░░░░░░░░░░ 0% |
| **Geral** | **11/45** | **██░░░░░░░░ 25%** |

> O progresso é pesado pelos dias de cada etapa (🔄 conta metade). O painel visual (`painel.html`) calcula sozinho.

---

## Etapa 0: Preparação

| | # | Etapa | Dias | Arquivo |
|---|---|---|---|---|
| ✅ | 0.1 | Arquivo de prompts | 2 | `00-COMO-USAR.md` |
| ✅ | 0.2 | Ferramentas e anti-trava | 3 | `v1/0.2-preparar-ferramentas.md` |
| ✅ | 0.3 | Identidade visual | 0 | `../../design/` |
| ✅ | 0.4 | Textos da v1 | 1 | `../textos-v1.md` |

## v1: Primeiro SYSTEM no celular

| | # | Etapa | Dias | Arquivo |
|---|---|---|---|---|
| ✅ | 1.1 | Esqueleto do app | 2 | `v1/1.1-esqueleto.md` |
| ✅ | 1.2 | Memória do app + Backup | 2 | `v1/1.2-memoria.md` |
| ✅ | 1.3 | Despertar Rápido + Status | 3 | `v1/1.3-despertar-status.md` |
| ✅ | 1.4 | Missões diárias | 3 | `v1/1.4-missoes.md` |
| ✅ | 1.5 | Registro do Ouro | 2 | `v1/1.5-registro-ouro.md` |
| ✅ | 1.6 | Treino + Check-in + Ritual | 3 | `v1/1.6-treino-mente.md` |
| ✅ | 1.7 | Instalar e fechar a v1 | 2 | `v1/1.7-publicar.md` |
| 🔄 | 1.8 | Uso real e ajustes (5 dias) | 5 | `v1/B-modelo-conserto.md` |

### Sub-passos da etapa em andamento

_(O Claude Code preenche aqui os sub-passos da etapa atual, marcando ✅ a cada commit. Exemplo: `✅ 1.1.a manifest e ícones`.)_

## v2 a v6 (em esboço)

Os nomes das etapas estão em `painel-dados.js` e os esboços em `v2/` … `v6/esboco.md`. Cada esboço vira arquivos detalhados só quando a versão anterior estiver em uso real.

---

## Decisões tomadas pelo Claude Code (sem perguntar)

| Data | Etapa | Decisão | Por quê |
|---|---|---|---|
| 21/11/2026 | arquitetura | Missão 5 (sono) do dia D = "dormi antes das 23h na noite anterior", marcada de manhã | cada dia se avalia sozinho |

## Diário de Bordo

| Data | O que aconteceu |
|---|---|
| 24/11/2026 | Correção 1.0.1 do modo de teste: o deslocamento do AVANÇAR 1 DIA agora fica no localStorage (chave system-teste-deslocamento, só com ?teste=1) e vale em todas as abas; APAGAR TUDO no modo de teste também zera o deslocamento; o banner amarelo mostra a data simulada (ex.: MODO DE TESTE · 01/12/2026) e se atualiza sozinho; 7 testes novos (78 no total). Decisão: o banner se reescreve ao trocar de tela, ao voltar à aba e ao focar a janela. |
| 23/11/2026 | v1.0 publicada. Etapa 1.7 concluída: botão INSTALAR O SYSTEM e "App instalado ✓" em Ajustes (memória protegida pedida de novo após instalar), erros globais com [ERRO DO SISTEMA] e COPIAR DETALHES, revisão de telas de 320 px (grades sem estouro, botões de 48 px), cache do service worker conferido (com teste), versão 1.0.0, README público; 71 testes. Antes, correção da 1.6: a mensagem de penalidade mostra o total real (ex.: −20 HP · −10 CRISTAIS quando a Punição também não foi feita), com teste. Decisões: o erro mostra só mensagem, pilha, versão, tela e aparelho (sem dados pessoais); console.error de erros foi mantido só onde não há tela para avisar. |
| 23/11/2026 | Etapa 1.6 concluída: treino.js (MP, Fadiga, treino do dia, PAR-Q), saude.js (dados de Corpo e Mente), tela CORPO (Checagem de Segurança, dias de treino, treino do dia, descanso, histórico, Fadiga), tela MENTE (check-in, Ritual da Noite, gráfico de 7 dias, CVV 188), MP no STATUS e em MISSÕES, aviso de treino faltado; 69 testes. Antes, ajustes da 1.5: XP do Raid no topo, botão do Ouro some com gasto, mês com maiúscula, botões lado a lado, teto do diagnóstico (nota máx. 74 no Despertar Rápido), edição não muda dia nem hora. Decisões: lista vazia de dias de treino = padrão seg/qua/sex; registrar treino num dia que já teve descanso não paga de novo; ritual da noite só pergunta do sono se a missão 5 ainda não foi marcada; Fadiga só calcula com um treino de 28 dias ou mais atrás. |
| 23/11/2026 | Etapa 1.5 concluída: ouro.js (regras puras: resumo, missão 4, meses), tela OURO (+ GASTO / + ENTRADA, lista do dia, editar/apagar, resumo do mês, aviso de finanças) e missão 4 ligada aos registros; 56 testes. Antes, ajuste da 1.4: o Raid de Foco não conclui mais a Missão Principal (+5 XP por raid, só os 4 primeiros do dia, cancelar não dá XP, lista de raids no dia). Decisão: o Ouro paga no máximo +10 XP +1 Cristal por dia; com impulso a missão 4 não conta, mas o registro ainda paga; impulso depois da missão paga só desmarca, sem estorno. Raid além do 4º mostra mensagem sem XP. |
| 22/11/2026 | Painel melhorado: etapas abrem formatadas no painel, com COPIAR, checklist marcável e TESTEI E ESTÁ OK (o progresso é marcado só pelo Claude Code). Novo `gerar-painel.mjs` gera o `etapas-dados.js`. |
| 23/11/2026 | Etapa 1.4 concluída: regras do dia e da Zona (avaliarDia, punição, processarDiaEncerrado), diario.js (avaliação ao abrir, missões, desfazer), tela MISSÕES com Raid de Foco, punição, level up e alerta das 21h, modo de teste com AVANÇAR 1 DIA e dados fictícios. 39 testes. Antes: ajustes da 1.3 (cores dos ranks por função única, marca ⚠ MAIS FRACA, selo sem quebra de linha). Decisões: TREINEI dá 30 XP + 3 Cristais (Livro 3.1, treino concluído); as outras missões dão 10 XP + 1; o alerta das 21h vale também de 0h às 4h (o dia do jogo ainda não virou); mensagens da fila (penalidade, HP crítico) aparecem uma por vez com botão OK. |
| 22/11/2026 | Etapa 1.3 concluída: regras.js (XP, nível, rank, ganhos), cacador.js (ganhar), Despertar Rápido com resultado e radar, STATUS, refazer nos Ajustes, 26 testes. Antes: ajuste da 1.2 (a data do backup agora vai dentro do arquivo e a mais recente é mantida ao restaurar). Versão do app 0.1.7. Decisão: "Agora não" mostra uma tela de espera com botão Despertar. |
| 22/11/2026 | Etapa 1.2 concluída: banco IndexedDB (20 stores, modo ?teste=1), migrações, backup/restaurar/apagar tudo, lembrete da sexta, formato.js e 17 testes verdes. Antes: ajustes da 1.1 (fonte Audiowide no lugar da Orbitron, cores do tests.html, id no manifesto). Versão do app 0.1.3. |
| 22/11/2026 | Etapa 1.1 concluída: Chart.js, fontes e ícones locais; manifesto; CSS neon; casca com 6 rotas; ui.js; textos.js; service worker com aviso [NOVA VERSÃO DISPONÍVEL]; 8 testes verdes. 0.2 marcada ✅ (Eclir já fez o push). |
| 22/11/2026 | Etapa 0.2 (parte do Claude Code): criados package.json, página de teste (index.html), js/nucleo/dia.js, testes (tests/testes.js, tests/rodar.mjs, tests.html) e primeiro commit. Sem push: falta o Eclir fazer o push e ligar o Pages. |
| 21/11/2026 | Arquivo de prompts montado pelo Claude: CLAUDE.md, permissões, .gitignore, PAINEL e etapas da v1. Aguardando revisão do Eclir. |
| 21/11/2026 | Logo, paleta, fontes e textos da v1 aprovados. Livro de Regras v0.3 com a seção 16 (técnica e anti-trava). |
