# SYSTEM

App pessoal gamificado de evolução em 7 áreas da vida: Finanças, Corpo, Mente, Gestão pessoal, Profissional, Relacionamentos e Espiritualidade. Você ganha XP, sobe de nível e de rank (E a S), cumpre missões diárias e acompanha seu progresso numa interface de jogo.

É um PWA: instala no celular como app e funciona **offline**. Feito só com HTML, CSS e JavaScript puro, sem framework e sem etapa de build.

## Versão atual: 1.0

Despertar Rápido (diagnóstico), Status, missões diárias com Raid de Foco, Registro do Ouro, Corpo (treino e descanso), Mente (check-in e Ritual da Noite), backup e restauração.

## Como rodar

Precisa do [Node.js](https://nodejs.org). Na pasta do projeto:

```
npx serve
```

Abra o endereço mostrado no navegador. Para testar sem mexer nos dados reais, acrescente `?teste=1` ao endereço (usa um banco separado).

Testes das regras do jogo:

```
node tests/rodar.mjs
```

## Seus dados ficam só no aparelho

Tudo é guardado no IndexedDB do próprio navegador. **Nada é enviado para servidor nenhum.** Por isso, faça backup com frequência (Ajustes → Fazer backup) e guarde o arquivo `.json` fora do celular também. Se limpar os dados do navegador ou desinstalar o app sem backup, os dados se perdem.

## Avisos importantes

- O SYSTEM ajuda no autoconhecimento, mas **não substitui um psicólogo**. Em crise, ligue para o **CVV: 188**.
- O SYSTEM orienta, mas **não substitui um profissional de educação física**. Antes do primeiro treino há uma Checagem de Segurança (PAR-Q).
- O SYSTEM educa sobre dinheiro e **não recomenda produtos de investimento**.
