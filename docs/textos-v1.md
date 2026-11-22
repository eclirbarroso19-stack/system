# SYSTEM: Textos da v1

> **Versão 1.0, 21/11/2026. APROVADO pelo Eclir.**
> Depois de aprovado, este arquivo é a fonte dos textos que o Claude Code coloca no app.

---

## 1. Abertura (primeira vez que abre o app)

1. `[O SISTEMA DETECTOU UM CAÇADOR ADORMECIDO.]`
2. `[INICIAR O DESPERTAR?]` → botões **ACEITAR** / *Agora não*
3. Campo: **"Como o Sistema deve te chamar?"**
4. Regra de honestidade: `[NÃO EXISTE RESPOSTA CERTA. O SISTEMA SÓ FUNCIONA COM A VERDADE.]`

---

## 2. Despertar Rápido (7 perguntas, 1 por área)

- Cada pergunta tem 5 opções e vale **0, 25, 50, 75 ou 100** pontos (da primeira para a última).
- A nota vira o **rank provisório** da área (tabela do Livro, seção 4.1).
- Esses ranks ficam marcados como **"provisório"** até o Teste do Despertar completo (v2) ou o Exame do Corpo.

### 💰 Finanças
**Chega o fim do mês. Como costuma ficar o seu dinheiro?**
- Falta, e eu me endivido (cartão, empréstimo, fiado)
- Fica no zero, contando moeda
- Sobra um pouco, mas acabo gastando
- Sobra e às vezes eu guardo
- Sobra, eu guardo todo mês e tenho uma reserva

### ⚔️ Corpo
**Na última semana, em quantos dias você se exercitou por pelo menos 20 minutos?**
- Nenhum · 1 dia · 2 dias · 3 ou 4 dias · 5 dias ou mais

### 🌑 Mente
**Nas últimas 2 semanas, com que frequência você se sentiu animado e de bom humor?**
- Nunca · Poucas vezes · Metade do tempo · Na maior parte do tempo · O tempo todo

### 🎯 Gestão pessoal
**Pense no dia de ontem. Você planejou o que ia fazer e cumpriu?**
- Não planejo meus dias
- Planejei, mas quase nada saiu
- Cumpri mais ou menos a metade
- Cumpri quase tudo
- Cumpri tudo e ainda revisei o dia

### 🧠 Profissional
**Nos últimos 30 dias, você aprendeu algo novo para a sua carreira e colocou em prática?**
- Não aprendi nada novo
- Pensei em estudar, mas não comecei
- Estudei, mas não pratiquei
- Estudei e pratiquei um pouco
- Estudei, pratiquei e entreguei algo

### 💬 Relacionamentos
**Se você tivesse um problema sério hoje às 3h da manhã, quantas pessoas poderia chamar?**
- Nenhuma · Uma, mas com receio · Uma, com confiança · Duas ou três · Quatro ou mais

### ✨ Espiritualidade
**Hoje, quanto você sente que a sua vida tem um propósito claro?**
- Nada · Pouco · Mais ou menos · Bastante · Totalmente

### Resultado
- `[ANÁLISE CONCLUÍDA.]`
- Revelação área por área (uma de cada vez): `[FINANÇAS: RANK D (PROVISÓRIO)]`
- Radar com as 7 áreas.
- `[RANK DO CAÇADOR: E · TÍTULO: O MAIS FRACO DE TODOS]`
- `[SUA JORNADA COMEÇA AGORA.]`

---

## 3. Checagem de Segurança (antes da 1ª missão de treino)

> Baseada no PAR-Q+ (texto adaptado com nossas palavras). Respostas: **Sim / Não**.

1. Algum médico já disse que você tem problema no coração ou pressão alta?
2. Você sente dor no peito em repouso, no dia a dia ou quando faz exercício?
3. Você já perdeu o equilíbrio por tontura ou desmaiou no último ano?
4. Você tem alguma doença crônica (diabetes, asma, outra) diagnosticada?
5. Você toma remédio contínuo para alguma doença?
6. Você tem algum problema nos ossos, articulações ou coluna que piora com exercício?
7. Algum médico já disse que você só deve fazer exercício com acompanhamento?

- **Todas "Não":** `[CORPO LIBERADO PARA O TREINO.]`
- **Alguma "Sim":** `[ATENÇÃO, CAÇADOR. CONVERSE COM UM MÉDICO ANTES DE TREINAR PESADO.]`
  - A missão de treino vira **caminhada leve de 15 min** até o jogador marcar "fui liberado pelo médico".

---

## 4. Mensagens do Sistema

| Momento | Mensagem |
|---|---|
| Abrir o app no dia | `[MISSÃO DIÁRIA DISPONÍVEL]` |
| Cumprir uma missão | `[MISSÃO CONCLUÍDA: +10 XP · +1 CRISTAL]` |
| Cumprir todas | `[MISSÃO DIÁRIA CONCLUÍDA. RECOMPENSA: +30 XP · +5 CRISTAIS]` |
| Subir de nível | `[LEVEL UP! NÍVEL {N} ALCANÇADO. +3 PONTOS DE FOCO]` |
| Abrir após 21h com missões pendentes | `[ALERTA: O DIA TERMINA EM {H} HORAS. MISSÕES PENDENTES: {X}]` |
| Penalidade | `[PENALIDADE: −10 HP. MISSÃO DE PUNIÇÃO LIBERADA.]` |
| Cumprir a punição | `[PUNIÇÃO CUMPRIDA. O SISTEMA RECONHECE SEU ESFORÇO.]` |
| HP zerou | `[HP CRÍTICO. VOCÊ ENTROU NA ZONA DE PENALIDADE. 3 DIAS PARA SAIR.]` |
| Sair da Zona | `[VOCÊ SOBREVIVEU. HP RESTAURADO PARA 50.]` |
| Descanso planejado | `[RECUPERAÇÃO CONCLUÍDA. O DESCANSO TAMBÉM É TREINO.]` |
| Faltou a treino planejado | `[VOCÊ ESTÁ FICANDO FRACO. VOLTE A TREINAR.]` |
| Gasto marcado como impulso | `[IMPULSO DETECTADO. DA PRÓXIMA VEZ, ESPERE 24 HORAS.]` |
| Registro do Ouro do dia | `[REGISTRO DO OURO CONCLUÍDO.]` |
| Check-in da manhã | `[CHECK-IN REGISTRADO. MP: {MP}]` |
| Ritual da Noite | `[RITUAL DA NOITE CONCLUÍDO. DESCANSE, CAÇADOR.]` |
| Sexta-feira | `[DIA DO CONSELHO. FAÇA O BACKUP DOS SEUS DADOS.]` |
| Backup feito | `[MEMÓRIA DO SISTEMA PROTEGIDA.]` |
| Título novo | `[TÍTULO DESBLOQUEADO: {TÍTULO}]` |

**Tom:** frio, firme e respeitoso, como um sistema. Nunca humilha. A punição é firme, mas sempre mostra como sair.

---

## 5. Categorias da v1

### 5.1 Saídas (gastos)

| # | Categoria | Tipo padrão | Exemplos |
|---|---|---|---|
| 1 | 🏠 Moradia | essencial | aluguel, condomínio, IPTU |
| 2 | 💡 Contas da casa | essencial | luz, água, gás, internet, celular |
| 3 | 🛒 Mercado e feira | essencial | supermercado, feira, padaria |
| 4 | 🏍️ Transporte | essencial | gasolina da moto, manutenção, moto-táxi, passagem |
| 5 | 💊 Saúde | essencial | farmácia, consulta, plano |
| 6 | 📚 Educação | essencial | faculdade, cursos, livros |
| 7 | 💳 Dívidas e parcelas | essencial (obrigação) | cartão, empréstimo, financiamento, fiado |
| 8 | 🍔 Comida fora e delivery | não essencial | lanche, restaurante, iFood |
| 9 | 🎮 Lazer e assinaturas | não essencial | streaming, jogos, passeios, apps |
| 10 | 👕 Compras pessoais | não essencial | roupa, salão, eletrônicos |
| 11 | 📦 Outros | escolhe na hora | o que não couber acima |

- O jogador pode trocar o tipo de qualquer lançamento.
- **"Impulso?" é uma pergunta separada da categoria.** Até um gasto de mercado pode ter sido por impulso.

### 5.2 Entradas

💼 Salário · 💰 Renda extra (vendas, bicos, serviços) · 🏛️ Benefícios (Bolsa Família, Pé-de-Meia etc.) · 🎁 Outros

### 5.3 Por que 11 e não as ~30 da planilha

O registro precisa caber em **3 toques**. As categorias da planilha foram agrupadas por tipo. Na v2, com os 6 Baús, cada categoria passa a apontar para um Baú.
