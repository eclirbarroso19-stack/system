# Como usar o arquivo de prompts do SYSTEM

> Leia isto uma vez. Depois, o dia a dia é só a seção "Rotina de um dia".

## 1. O que tem aqui

| Arquivo | Para quem | Para quê |
|---|---|---|
| `../../CLAUDE.md` | Claude Code | contexto fixo: regras técnicas, pastas, modelo de dados. Ele lê sozinho |
| `../../.claude/settings.json` | Claude Code | permissões, para ele não parar pedindo autorização (você copia de `v1/settings-claude.json` na etapa 0.2) |
| `PAINEL.md` | Claude Code | estado oficial: o que está feito, em andamento e o próximo passo |
| `painel.html` | **você** | o painel com o visual do app. Toque numa etapa para ler e copiar o prompt. Abra com duplo clique no Edge |
| `painel-dados.js` + `etapas-dados.js` | painel | os dados que o painel mostra. O segundo é gerado por `gerar-painel.mjs`, não edite à mão |
| `v1/0.2-…md` a `v1/1.7-…md` | você + Claude Code | uma etapa por arquivo: objetivo, prompt pronto, checklist e "se travar" |
| `v1/B-modelo-conserto.md` | você | modelo do Prompt B (consertar o que você testou) e do prompt de retomar |
| `v2/` … `v6/esboco.md` | você + Claude | esboço das próximas versões. Vira etapas detalhadas quando a anterior estiver em uso |

**Analogia:** o Livro de Regras é a planta da casa. O CLAUDE.md é o mestre de obras que já conhece a planta. Cada arquivo de etapa é a ordem de serviço do dia. O PAINEL é o quadro na parede da obra mostrando o que já levantou.

## 2. Rotina de um dia (1 a 2 horas, das 16h às 18h)

1. **Abra o `painel.html`** e toque em **ABRIR ETAPA** no `[PRÓXIMO PASSO]`.
2. Leia o "Objetivo" e o "Antes de começar". A parte técnica fica fechada no fim: é para o Claude Code, você não precisa ler.
3. **Prompt A (construir):** abra a pasta `system` no VS Code e a extensão do **Claude Code** (ícone ✳). Toque em **COPIAR** no bloco do PROMPT A e cole numa conversa nova. Deixe trabalhar.
   - Use **uma conversa nova por etapa**. O Prompt B do mesmo dia vai na mesma conversa.
   - Deixe o modo de permissão em **Auto**.
4. **Enquanto espera** (~60 min até liberar a próxima mensagem): quando ele terminar, teste usando o **Checklist** da etapa.
   - No notebook: `npx serve` na pasta `system` e abra o endereço que aparecer no Edge.
   - No celular: abra `https://eclirbarroso19-stack.github.io/system` (1 a 2 min depois do push).
5. **Marque o checklist** no próprio painel (as caixinhas ficam salvas).
6. **Prompt B:**
   - deu erro → use o modelo B1 (botão MODELOS DO PROMPT B, no rodapé do painel);
   - tudo ok → no fim da etapa, toque em **✅ TESTEI E ESTÁ OK**. O painel mostra o prompt da próxima etapa pronto para copiar.
   - Quem marca o progresso (✅) é o Claude Code, ao terminar cada prompt. Você não precisa marcar nada.
7. **Pronto.** O Claude Code já atualizou o PAINEL e salvou no GitHub.

> **Regra de ouro:** nunca abra o `index.html` do app com duplo clique. Use sempre o `npx serve`. (O `painel.html` pode abrir com duplo clique.)

## 3. Retomar de onde parou

O PAINEL guarda tudo. Se passou dias sem mexer, ou se uma mensagem foi cortada no meio:

```
Leia CLAUDE.md e docs/prompts/PAINEL.md. Retome a etapa em andamento do ponto onde parou, seguindo o arquivo da etapa. Não refaça o que já está marcado como ✅. No fim, atualize o PAINEL, faça commit e push.
```

## 4. Se travar (Plano B, sem gastar mensagem do Claude Code)

1. Tire print do erro, ou copie o texto do terminal ou do console do Edge (F12 → Console).
2. Traga para o Claude aqui no projeto: "travou na etapa X, olha o erro".
3. Eu leio os arquivos do seu notebook e devolvo um prompt de conserto pronto.

## 5. Quantos dias leva

| Fase | Dias úteis | Previsão |
|---|---|---|
| Etapa 0 | ~6 | até ~02/12/2026 |
| v1 (7 etapas + 5 dias de uso) | ~22 | ~05/01/2027 |
| v2 a v6 | ~135 | até ~jul/2027 |

Cada etapa tem 2 ou 3 dias porque cada dia tem só 2 mensagens. Se uma etapa terminar antes, siga para a próxima no Prompt B. Se atrasar, tudo bem: o PAINEL segura o lugar.

## 6. Construindo em público (segunda-feira de conteúdo)

Toda segunda, 1 publicação mostrando a construção. Sugestões por etapa:

| Etapa | Ideia de post |
|---|---|
| 0.2 | "Vou construir um app de RPG para a minha própria vida, do zero, usando IA. Dia 1." |
| 1.1 | Vídeo curto (15 s) do app abrindo no celular com a tela neon vazia |
| 1.3 | O quiz do Despertar e o radar das 7 áreas (sem mostrar suas notas reais, se preferir) |
| 1.4 | "O app me deu −10 de HP porque não bebi água" (humor + lição de hábito) |
| 1.5 | "Registrar um gasto em 3 toques": tela gravada |
| 1.7 | O ícone instalado na tela do Android + o que aprendi construindo |

**Cuidado:** não mostre valores reais de dinheiro nem respostas emocionais nos vídeos.
