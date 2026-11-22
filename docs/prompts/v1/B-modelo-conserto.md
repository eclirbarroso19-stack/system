# Prompt B: modelos de conserto, retomada e avanço

Use a **segunda mensagem do dia** com um destes modelos. Copie, preencha o que está entre `< >` e cole no Claude Code.

---

## B1. Consertar o que você testou (o mais comum)

```
Etapa <X.X> do SYSTEM, conserto. Leia CLAUDE.md e docs/prompts/PAINEL.md. Testei e encontrei:

1. Tela <qual>: fiz <o que fiz>, esperava <o que devia acontecer>, mas aconteceu <o que aconteceu>.
2. <...>

Corrija tudo, crie um teste para cada regra que estava errada, rode os testes, aumente VERSAO_APP, atualize PAINEL.md e painel-dados.js (registre no Diário de Bordo), faça commit e git push. Trabalhe sem perguntar e me dê o resumo.
```

**Como descrever bem um problema** (vale ouro, porque cada mensagem é preciosa):

- **Onde:** a tela e o botão.
- **O que fez:** os passos, na ordem.
- **O que esperava:** e o que aconteceu de fato.
- **Erro:** se houver, F12 → Console no Edge, copie o texto vermelho, ou use o botão "copiar detalhes" do `[ERRO DO SISTEMA]` (a partir da 1.7).
- **Junte tudo numa mensagem só.** Até 5 problemas por Prompt B.

---

## B2. Tudo passou, seguir para a próxima etapa

```
A etapa <X.X> passou no checklist. Execute agora a etapa <Y.Y> do SYSTEM: siga a seção "Especificação para o Claude Code" de docs/prompts/v1/<arquivo>.md, sub-passo por sub-passo, com commit a cada um. Trabalhe sem perguntar. No fim: testes, PAINEL, painel-dados.js, commit, push e resumo.
```

---

## B3. Retomar (a mensagem anterior foi cortada ou você ficou dias parado)

```
Leia CLAUDE.md e docs/prompts/PAINEL.md. Retome a etapa em andamento do ponto onde parou, seguindo o arquivo da etapa. Não refaça o que já está marcado como ✅. No fim, atualize o PAINEL, faça commit e push e me dê o resumo.
```

---

## B4. Etapa 1.8: uso real e ajustes (5 dias úteis)

Use o app de verdade. Toda noite, anote no bloco de notas do celular o que incomodou, por exemplo:

- "demorou para registrar o gasto"
- "a mensagem X é chata"
- "o cronômetro não vibrou"

**Regra:** só entram **ajustes** do que já existe. Ideia nova vai para o **Baú de Ideias** (Livro, seção 15) e é conversada com o Claude no projeto, para não virar bola de neve.

```
Etapa 1.8 do SYSTEM (uso real). Leia CLAUDE.md e docs/prompts/PAINEL.md. Depois de <N> dias de uso, estes são os ajustes:

1. <...>
2. <...>

Faça só ajustes do que já existe (nada de função nova). Teste, aumente VERSAO_APP, atualize PAINEL.md e painel-dados.js, commit e push. Trabalhe sem perguntar e me dê o resumo.
```

**No último dia de uso:**
- Peça ao Claude Code para marcar 1.8 = ✅ e criar a tag `v1.1`, se houve ajustes.
- Traga para o Claude no projeto: "v1 fechada, bora detalhar a v2". Eu transformo o `v2/esboco.md` em etapas detalhadas, igual às da v1.
