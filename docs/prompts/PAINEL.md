# PAINEL DO SYSTEM

> **Para o Claude Code:** este é o estado oficial do projeto. Leia antes de começar e atualize ao terminar cada sub-passo e cada etapa.
> Mantenha `painel-dados.js` igual a este arquivo (mesmos status, próximo passo e diário).
> Status: ✅ concluído · 🔄 em andamento · ⬜ aberto

**Atualizado em:** 23/11/2026
**Etapa atual:** 1.4 (concluída; aguardando teste do Eclir)
**Próximo passo:** Eclir testar o checklist da 1.4 (com ?teste=1 e AVANÇAR 1 DIA). Depois, etapa 1.5.

---

## Progresso

| Versão | Etapas | Progresso |
|---|---|---|
| Etapa 0: Preparação | 4/4 | ██████████ 100% |
| v1: Primeiro SYSTEM no celular | 4/8 | █████░░░░░ 50% |
| v2: Diagnóstico + Dinheiro | 0/7 | ░░░░░░░░░░ 0% |
| v3: Corpo + Gestão | 0/7 | ░░░░░░░░░░ 0% |
| v4: Mente + Sombras + Relacionamentos | 0/6 | ░░░░░░░░░░ 0% |
| v5: Profissional + Espiritualidade + Progressão | 0/7 | ░░░░░░░░░░ 0% |
| v6: Portais Ocultos + Arte e Som | 0/6 | ░░░░░░░░░░ 0% |
| **Geral** | **8/45** | **██░░░░░░░░ 16%** |

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
| ⬜ | 1.5 | Registro do Ouro | 2 | `v1/1.5-registro-ouro.md` |
| ⬜ | 1.6 | Treino + Check-in + Ritual | 3 | `v1/1.6-treino-mente.md` |
| ⬜ | 1.7 | Instalar e fechar a v1 | 2 | `v1/1.7-publicar.md` |
| ⬜ | 1.8 | Uso real e ajustes (5 dias) | 5 | `v1/B-modelo-conserto.md` |

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
| 22/11/2026 | Painel melhorado: etapas abrem formatadas no painel, com COPIAR, checklist marcável e TESTEI E ESTÁ OK (o progresso é marcado só pelo Claude Code). Novo `gerar-painel.mjs` gera o `etapas-dados.js`. |
| 23/11/2026 | Etapa 1.4 concluída: regras do dia e da Zona (avaliarDia, punição, processarDiaEncerrado), diario.js (avaliação ao abrir, missões, desfazer), tela MISSÕES com Raid de Foco, punição, level up e alerta das 21h, modo de teste com AVANÇAR 1 DIA e dados fictícios. 39 testes. Antes: ajustes da 1.3 (cores dos ranks por função única, marca ⚠ MAIS FRACA, selo sem quebra de linha). Decisões: TREINEI dá 30 XP + 3 Cristais (Livro 3.1, treino concluído); as outras missões dão 10 XP + 1; o alerta das 21h vale também de 0h às 4h (o dia do jogo ainda não virou); mensagens da fila (penalidade, HP crítico) aparecem uma por vez com botão OK. |
| 22/11/2026 | Etapa 1.3 concluída: regras.js (XP, nível, rank, ganhos), cacador.js (ganhar), Despertar Rápido com resultado e radar, STATUS, refazer nos Ajustes, 26 testes. Antes: ajuste da 1.2 (a data do backup agora vai dentro do arquivo e a mais recente é mantida ao restaurar). Versão do app 0.1.7. Decisão: "Agora não" mostra uma tela de espera com botão Despertar. |
| 22/11/2026 | Etapa 1.2 concluída: banco IndexedDB (20 stores, modo ?teste=1), migrações, backup/restaurar/apagar tudo, lembrete da sexta, formato.js e 17 testes verdes. Antes: ajustes da 1.1 (fonte Audiowide no lugar da Orbitron, cores do tests.html, id no manifesto). Versão do app 0.1.3. |
| 22/11/2026 | Etapa 1.1 concluída: Chart.js, fontes e ícones locais; manifesto; CSS neon; casca com 6 rotas; ui.js; textos.js; service worker com aviso [NOVA VERSÃO DISPONÍVEL]; 8 testes verdes. 0.2 marcada ✅ (Eclir já fez o push). |
| 22/11/2026 | Etapa 0.2 (parte do Claude Code): criados package.json, página de teste (index.html), js/nucleo/dia.js, testes (tests/testes.js, tests/rodar.mjs, tests.html) e primeiro commit. Sem push: falta o Eclir fazer o push e ligar o Pages. |
| 21/11/2026 | Arquivo de prompts montado pelo Claude: CLAUDE.md, permissões, .gitignore, PAINEL e etapas da v1. Aguardando revisão do Eclir. |
| 21/11/2026 | Logo, paleta, fontes e textos da v1 aprovados. Livro de Regras v0.3 com a seção 16 (técnica e anti-trava). |
