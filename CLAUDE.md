# SYSTEM: contexto fixo para o Claude Code

Você está construindo o **SYSTEM**, um app pessoal gamificado (estilo "sistema de caçador": ranks E até S) que ajuda o dono, **Eclir**, a evoluir em 7 áreas da vida: Finanças, Corpo, Mente, Gestão pessoal, Profissional, Relacionamentos e Espiritualidade.

O Eclir é iniciante em programação (1º semestre de ADS), mora em Jutaí-AM (fuso UTC-4) e usa celular **Android com Chrome**.

---

## 1. Como trabalhar aqui (leia antes de tudo)

1. **Leia `docs/prompts/PAINEL.md`** para saber em que etapa estamos e o que já foi feito.
2. **Leia o arquivo da etapa** em `docs/prompts/vN/` e siga a seção "Especificação" à risca.
3. **Não faça perguntas.** O Eclir só consegue mandar cerca de 2 mensagens por dia. Dúvida de regra se resolve pelo Livro (`docs/livro-de-regras.md`). Dúvida de texto, por `docs/textos-v1.md`. Se nada resolver, escolha a opção mais simples, siga em frente e anote a decisão no Diário de Bordo do PAINEL.
4. **Trabalhe em sub-passos.** Ao terminar cada sub-passo da etapa: rode os testes, marque o sub-passo no PAINEL e faça um commit. Se a mensagem acabar no meio, o próximo prompt retoma do PAINEL.
5. **Ao terminar a etapa:**
   - atualize `docs/prompts/PAINEL.md` **e** `docs/prompts/painel-dados.js` (os dois sempre iguais);
   - rode `node docs/prompts/gerar-painel.mjs`. Ele gera o `etapas-dados.js`, que o `painel.html` usa para mostrar as etapas formatadas. Rode sempre que um `.md` de `docs/prompts` mudar;
   - faça commit e `git push`.
   - **Você é quem marca o progresso.** O painel só lê os arquivos. Marque a etapa como ✅ quando terminar a especificação dela.
6. **Termine sempre com um resumo curto em português simples**, para o Eclir:
   - o que foi feito;
   - como testar (passo a passo, no notebook e no celular);
   - o que ficou pendente ou foi decidido sozinho.

## 2. Ordem de autoridade

`docs/livro-de-regras.md` (regras do jogo) > arquivo da etapa > este CLAUDE.md > seu bom senso.
Textos que aparecem no app vêm **literalmente** de `docs/textos-v1.md`. Não invente textos de sistema novos sem necessidade.

## 3. Regras técnicas (não negociáveis)

- **HTML + CSS + JavaScript puro**, com módulos ES (`<script type="module">`).
  - **Proibido:** framework (React, Vue...), TypeScript, bundler, etapa de build, `npm install` de dependência.
  - As únicas bibliotecas externas são o **Chart.js** e as fontes **Audiowide/Rajdhani**, todas como **arquivos locais** em `lib/` e `fontes/`.
- **Offline total:** nada depende de internet depois de instalado.
- **Caminhos sempre relativos** (`./css/estilo.css`, nunca `/css/estilo.css`). O app mora em `https://eclirbarroso19-stack.github.io/system/`.
- **Dados no IndexedDB** (`js/nucleo/db.js`), com backup e restauração em arquivo `.json`. Nada sai do celular sem o usuário pedir.
- **Datas:**
  - Use a **hora local do aparelho**.
  - **Nunca** use `toISOString()` para descobrir o dia, porque dá o dia errado depois das 20h em Jutaí.
  - O **dia do jogo vira às 4h da manhã**: um registro às 2h de terça conta para segunda.
  - Use sempre `diaDoJogo()` de `js/nucleo/dia.js`. A chave do dia é `"AAAA-MM-DD"`.
- **Dinheiro em centavos** (inteiro). Mostre como `R$ 1.234,56`.
- **Service worker com cache versionado.** Ao mudar qualquer arquivo do app, aumente `VERSAO_APP` em `js/config.js`.
  - Nova versão disponível mostra `[NOVA VERSÃO DISPONÍVEL]` com botão **ATUALIZAR**.
- Peça `navigator.storage.persist()` na primeira abertura.
- **Celular primeiro:**
  - tela de 360 px de largura;
  - botões de no mínimo 48 px de altura;
  - registro de gasto em no máximo 3 toques.
- **Regras do jogo em módulos puros**, sem DOM, em `js/nucleo/`. Assim os testes rodam no Node e no navegador.
- Não rode `npx serve` nem nenhum servidor que fica aberto, porque isso trava a sua sessão. Quem roda é o Eclir.
- Para conferir o código: `node --check arquivo.js` e `node tests/rodar.mjs`.

## 4. Segurança e privacidade (repositório PÚBLICO)

- **Nunca** crie, copie ou faça commit de dados pessoais, de backups (`system-backup-*.json`) ou de planilhas.
- Arquivos de teste com dados devem ser **fictícios**.
- Não use `git push --force`, `git reset --hard` nem apague arquivos de `docs/` ou `design/`.
- **Avisos obrigatórios** (Livro, seção 13):
  - psicólogo + botão **CVV 188** (`tel:188`) em toda tela de emoções;
  - educador físico + Checagem de Segurança (PAR-Q) antes do 1º treino;
  - "não recomenda produtos de investimento" na área de finanças.

## 5. Visual (Livro 16.3)

| Elemento | Valor |
|---|---|
| Fundo | `#0A0A12` (cards um pouco mais claros: `#12121F`) |
| Roxo | `#7B2FF7` |
| Azul neon | `#00D4FF` |
| Texto | `#E8F7FF` (secundário `#8A9BB0`) |
| Perigo / HP baixo | `#FF3B5C` |
| Títulos | Audiowide |
| Texto corrido | Rajdhani |
| Cor da letra do rank | E `#8A9BB0` · D `#2BE38B` · C `#00D4FF` · B `#B57BFF` · A `#FF8A3D` · S `#FFD34D` com brilho pulsante (só o S brilha) |

- **Mensagens do Sistema:** caixa com borda azul neon, brilho suave (`box-shadow`), texto em MAIÚSCULAS entre colchetes, aparecendo com uma animação curta de "digitação" ou fade.
- **Ranks:** a cor vai só na letra do rank, nunca no cartão ou no nome da área. A letra sempre aparece escrita (a cor não pode ser a única informação). Na lista de áreas, a ordem é fixa (nunca ordenar por rank) e só a área de rank mais baixo ganha a marca `⚠ MAIS FRACA` (em empate, todas as empatadas, e nenhuma se todas tiverem o mesmo rank).
- **Barras** de XP, HP e MP com gradiente roxo → azul (o HP fica vermelho abaixo de 30).
- O estilo lembra uma interface de jogo, sem copiar telas de anime nenhum.
- **Ícones** já prontos em `design/`. O `icon-512.png` serve como "any" e "maskable", porque o desenho está dentro da zona segura.

## 6. Estrutura de pastas

```
system/
├─ index.html              # casca do app + menu inferior
├─ manifest.webmanifest    # (não use .json: o .gitignore bloqueia backups .json)
├─ sw.js                   # service worker
├─ package.json            # só "type": "module" e o script de teste. SEM dependências
├─ tests.html              # roda os testes no navegador
├─ css/estilo.css
├─ js/
│  ├─ config.js            # VERSAO_APP, VERSAO_DADOS
│  ├─ app.js               # inicia, rotas por hash (#missoes, #status...), menu
│  ├─ textos.js            # TODOS os textos do app (vindos de docs/textos-v1.md)
│  ├─ ui.js                # componentes: mensagemSistema(), barra(), botao(), modal()
│  ├─ nucleo/              # lógica pura, sem DOM
│  │  ├─ dia.js            # diaDoJogo(), virada às 4h, horasAteVirada()
│  │  ├─ regras.js         # XP, nível, rank, HP, penalidades, MP
│  │  ├─ db.js             # IndexedDB (abrir, ler, gravar, listar)
│  │  ├─ migracoes.js      # migração por VERSAO_DADOS
│  │  └─ backup.js         # exportar / validar / importar
│  └─ telas/               # uma tela por arquivo: missoes.js, status.js, ouro.js, corpo.js, mente.js, ajustes.js, despertar.js
├─ lib/chart.umd.min.js
├─ fontes/                 # .woff2 + licença OFL
├─ icones/                 # icon-192.png, icon-512.png (cópias de design/)
├─ tests/                  # testes.js (lista de testes) + rodar.mjs (Node)
├─ docs/                   # livro, fontes, roteiro, textos, prompts (NÃO apagar)
└─ design/                 # logo e ícones originais (NÃO apagar)
```

## 7. Modelo de dados (completo desde a v1, Livro 16.1)

O banco IndexedDB se chama `system`. A versão dos dados é `VERSAO_DADOS = 1`. Crie **todas** as stores já na v1, mesmo as que só serão usadas depois, para nenhuma versão futura perder dados.

| Store | Chave | Conteúdo principal | Usada a partir de |
|---|---|---|---|
| `meta` | `chave` | `versaoDados`, `ultimoBackup`, `ultimaAbertura`, `ultimoDiaAvaliado`, `instaladoEm` | v1 |
| `cacador` | `id` = `"eu"` | nome, nivel, xpTotal, hp, cristais, rankCacador, titulo, classe, pontosFoco, ranksArea{area:{nota,rank,provisorio}}, atributos{forca,agilidade,vitalidade,financas,disciplina,inteligencia,carisma,espirito: null ou 0–100}, parq{respondido, temRisco, liberadoMedico}, diasTreino[0–6], zona{ativa, diasCumpridos} | v1 |
| `dias` | `dia` ("AAAA-MM-DD") | missoes{treino,agua,principal,ouro,sono: bool}, principalTexto, semGastos, punicao{ativa,feita}, xpDia, avaliado, resultado | v1 |
| `eventos` | auto | dia, quando, tipo, xp, cristais, hp, descricao (histórico de tudo que mexe em XP/HP/Cristais) | v1 |
| `ouro` | auto | dia, quando, tipo ("saida"/"entrada"), valorCentavos, categoria, essencial, impulso, nota | v1 |
| `treinos` | auto | dia, quando, modalidade, minutos, esforco (1–10), recuperacao (bool), exercicios[], nota | v1 |
| `checkins` | auto | dia, quando, periodo ("manha"/"noite"), humor (1–5), emocao, intensidade, coisasBoas[3], motivo | v1 |
| `diagnosticos` | auto | tipo ("rapido"/"completo"/"corpo"), quando, respostas, notasArea | v1 |
| `missoesExtras` | auto | principais e secundárias, cronômetro | v3 |
| `metas` | auto | Árvore do Destino, WOOP, Boss Semanal | v3 |
| `sombras` | `id` | sequências / Exército das Sombras | v4 |
| `batalhas` | auto | Registro de Batalha (4 tipos) | v4 |
| `dividas` | auto | monstros | v2 |
| `baus` | `id` | 6 Baús e perfil | v2 |
| `estudos` | auto | estudo e revisão espaçada | v5 |
| `aliados` | auto | Círculo de Aliados | v4 |
| `rituais` | auto | espiritualidade | v5 |
| `portais` | `id` | Portais Ocultos | v6 |
| `titulos` | `id` | títulos ganhos | v5 |
| `loja` | auto | compras com Cristais | v5 |

**Migrações:** `migracoes.js` tem uma lista `[{de:1, para:2, rodar(db){...}}]`. Ao abrir, aplica as que faltam. **Nunca apague dados numa migração.**

## 8. Regras do jogo que o código precisa acertar (resumo; o Livro manda)

- **XP do nível N para N+1** = `50 + 30 × N`.
  - O nível é calculado a partir do `xpTotal`. **XP nunca diminui.**
  - Limite de **300 XP por dia** (o Boss e a meta mensal ficam fora do limite).
- **Recompensas:** tabela do Livro 3.1.
- **Rank da área** pela nota:
  - 0–19 E · 20–39 D · 40–59 C · 60–74 B · 75–89 A · 90–100 S.
  - O Rank do Caçador começa em E e só muda pelo Exame de Promoção (v2 em diante).
- **Subiu de nível:** +3 Pontos de Foco. Na v1 eles só acumulam e aparecem no Status; a distribuição chega na v3.
- **5 missões diárias** (Livro 5.1):
  1. Treino ou Recuperação
  2. Beber 2 L de água
  3. Missão Principal
  4. Registro do Ouro sem impulso: precisa ter ao menos 1 registro **ou** tocar em "Hoje não gastei nada", e nenhum gasto do dia pode estar marcado como impulso.
  5. Dormir antes das 23h. **Decisão do arquiteto:** a missão 5 do dia D é "dormi antes das 23h na noite anterior", marcada na manhã de D. Assim cada dia se avalia sozinho.
- **Avaliação do dia:** ao abrir o app, avalie cada dia já encerrado que ainda não foi avaliado (no máximo 7 dias para trás).
  - Cumpriu **3 ou mais** das 5 missões: HP +5.
  - Cumpriu **2 ou menos**: HP −10 e Missão de Punição no dia seguinte (20 min de caminhada extra).
  - Missão de Punição não feita: HP −10 e Cristais −10.
  - Descanso planejado: HP +10.
  - O HP fica sempre entre 0 e 100, e os Cristais nunca ficam negativos.
- **HP 0 = Zona de Penalidade:**
  - só missões mínimas (água, sono e 10 min de caminhada);
  - o XP vale metade;
  - a Zona termina depois de 3 dias com as missões mínimas cumpridas, e então o HP volta a 50.
- **MP** = média dos 3 últimos check-ins de humor × 20, com +10 se dormiu antes das 23h. Máximo 100.
- **Alerta das 21h:** ao abrir depois das 21h com missões pendentes, mostre `[ALERTA: O DIA TERMINA EM {H} HORAS. MISSÕES PENDENTES: {X}]`, onde H são as horas até as 4h.

## 9. Git

- Branch `main`. Commits pequenos, em português, no formato `etapa 1.1: menu inferior e telas vazias`.
- Ao terminar a etapa: `git push`. O GitHub Pages publica sozinho em 1 a 2 minutos.
- Ao terminar uma versão, crie a tag: `git tag v1.0` e `git push --tags`.
