// Tela CORPO: Checagem de Segurança, dias de treino, treino do dia, registro e histórico.
import { el, botao, barra, mensagemSistema, modal, levelUp } from "../ui.js";
import { lerCacador, lerDia } from "../nucleo/cacador.js";
import { diaDoJogo } from "../nucleo/dia.js";
import { formatarData } from "../nucleo/formato.js";
import { treinoDoDia, diasTreinoEfetivos, cargaDaSemana, cargaTreino } from "../nucleo/treino.js";
import {
  salvarParq, salvarDiasTreino, registrarTreino, registrarDescanso, treinosRecentes, fadigaAtual,
} from "../nucleo/saude.js";
import { listar } from "../nucleo/db.js";
import { checagemSeguranca, mensagens, avisos, preencher, msgMissaoConcluida } from "../textos.js";

const MODALIDADES = ["Calistenia", "Academia", "Caminhada/Corrida", "Esporte", "Outro"];
const EXERCICIOS_RANK_E = ["10 flexões", "15 agachamentos", "15 min de caminhada"];
// Segunda a domingo (0 = domingo no JavaScript)
const SEMANA = [{ r: "S", d: 1, n: "segunda" }, { r: "T", d: 2, n: "terça" }, { r: "Q", d: 3, n: "quarta" }, { r: "Q", d: 4, n: "quinta" }, { r: "S", d: 5, n: "sexta" }, { r: "S", d: 6, n: "sábado" }, { r: "D", d: 0, n: "domingo" }];

export async function montar(elemento) {
  let mensagensTela = [];
  const marcados = new Set(); // exercícios marcados hoje (só visual)

  function passoParq() {
    const respostas = [];
    function pergunta(i) {
      elemento.replaceChildren(
        el("h1", { class: "titulo-tela", texto: "CHECAGEM DE SEGURANÇA" }),
        el("p", { class: "aviso", texto: `Pergunta ${i + 1} de ${checagemSeguranca.perguntas.length}` }),
        el("p", { class: "pergunta-area", texto: checagemSeguranca.perguntas[i] }),
        el("div", { class: "grupo-botoes" }, [
          botao("SIM", "perigo", () => proxima(i, true)),
          botao("NÃO", "primario", () => proxima(i, false)),
        ]),
        el("p", { class: "aviso", texto: avisos.treino }),
      );
    }
    async function proxima(i, sim) {
      respostas[i] = sim;
      if (i + 1 < checagemSeguranca.perguntas.length) return pergunta(i + 1);
      const parq = await salvarParq(respostas);
      elemento.replaceChildren(
        el("h1", { class: "titulo-tela", texto: "CHECAGEM DE SEGURANÇA" }),
        mensagemSistema(parq.temRisco ? checagemSeguranca.atencao : checagemSeguranca.liberado),
        ...(parq.temRisco ? [el("p", { class: "desc", texto: `Enquanto isso, a missão de treino vira: ${checagemSeguranca.caminhadaLeve}. Em Ajustes você marca "${checagemSeguranca.liberadoMedico}" quando o médico liberar.` })] : []),
        botao("CONTINUAR", "primario", () => desenhar()),
      );
    }
    pergunta(0);
  }

  function abrirRegistro(minutosPadrao, modalidadePadrao) {
    let minutos = minutosPadrao;
    const mostrador = el("strong", { class: "minutos", texto: `${minutos} min` });
    const ajustar = (d) => () => { minutos = Math.max(5, Math.min(300, minutos + d)); mostrador.textContent = `${minutos} min`; };
    const modalidade = el("select", { class: "campo" }, MODALIDADES.map((m) => {
      const o = el("option", { value: m, texto: m });
      if (m === modalidadePadrao) o.selected = true;
      return o;
    }));
    const valorEsforco = el("strong", { class: "minutos", texto: "5" });
    const esforco = el("input", { type: "range", min: "1", max: "10", value: "5", class: "slider", "aria-label": "Esforço de 1 a 10" });
    esforco.addEventListener("input", () => { valorEsforco.textContent = esforco.value; });
    const corpo = el("div", { class: "fluxo-corpo" }, [
      el("label", { class: "rotulo", texto: "Modalidade" }), modalidade,
      el("label", { class: "rotulo", texto: "Minutos" }),
      el("div", { class: "linha-minutos" }, [botao("−5", "fantasma", ajustar(-5)), mostrador, botao("+5", "fantasma", ajustar(5))]),
      el("label", { class: "rotulo", texto: "Esforço (1 leve – 10 máximo)" }),
      el("div", { class: "linha-minutos" }, [esforco, valorEsforco]),
    ]);
    modal({
      titulo: "REGISTRAR TREINO",
      conteudo: corpo,
      botoes: [
        { rotulo: "Cancelar", tipo: "fantasma" },
        { rotulo: "SALVAR", tipo: "primario", aoClicar: async () => {
          const { concluida } = await registrarTreino({
            modalidade: modalidade.value, minutos, esforco: Number(esforco.value), exercicios: [...marcados],
          });
          marcados.clear();
          if (concluida) {
            mensagensTela = [msgMissaoConcluida(concluida.xpGanho, concluida.cristais)];
            if (concluida.todas) mensagensTela.push(mensagens.todasConcluidas);
          } else mensagensTela = ["[TREINO REGISTRADO.]"];
          await desenhar();
          for (const n of concluida?.subiuPara || []) levelUp(n, preencher(mensagens.levelUp, { N: n }));
        } },
      ],
    });
  }

  async function desenhar() {
    const cacador = await lerCacador();
    if (!cacador.parq?.respondido) return passoParq();
    const hoje = diaDoJogo();
    const dia = await lerDia();
    const tipo = treinoDoDia(cacador.diasTreino, hoje, cacador.parq);
    const partes = [];
    for (const t of mensagensTela) partes.push(mensagemSistema(t));

    // Dias de treino
    const efetivos = new Set(diasTreinoEfetivos(cacador.diasTreino));
    const bolinhas = SEMANA.map((s) => {
      const b = el("button", { class: `bolinha${efetivos.has(s.d) ? " ligada" : ""}`, type: "button", "aria-label": s.n, "aria-pressed": String(efetivos.has(s.d)), texto: s.r });
      b.addEventListener("click", async () => {
        const novo = new Set(efetivos);
        if (novo.has(s.d)) novo.delete(s.d); else novo.add(s.d);
        if (novo.size === 0) return; // pelo menos 1 dia de treino
        await salvarDiasTreino([...novo]);
        mensagensTela = [];
        await desenhar();
      });
      return b;
    });
    partes.push(el("div", { class: "cartao" }, [
      el("h2", { class: "subtitulo-azul", texto: "DIAS DE TREINO" }),
      el("div", { class: "bolinhas" }, bolinhas),
    ]));

    // Cartão de hoje
    const hojeCartao = el("div", { class: "cartao" }, [el("h2", { class: "subtitulo-azul", texto: "HOJE" })]);
    if (dia.missoes.treino) {
      hojeCartao.append(el("p", { class: "desc", texto: dia.recuperacao ? "✓ Descanso planejado registrado." : "✓ Treino registrado hoje." }));
      hojeCartao.append(botao("REGISTRAR OUTRO TREINO", "fantasma", () => abrirRegistro(30, "Calistenia")));
    } else if (tipo === "treino") {
      hojeCartao.append(el("p", { class: "desc", texto: "Treino do Rank E. Toque para marcar:" }));
      for (const ex of EXERCICIOS_RANK_E) {
        const b = el("button", { class: `exercicio${marcados.has(ex) ? " feito" : ""}`, type: "button", texto: `${marcados.has(ex) ? "✓" : "○"} ${ex}` });
        b.addEventListener("click", () => { if (marcados.has(ex)) marcados.delete(ex); else marcados.add(ex); b.className = `exercicio${marcados.has(ex) ? " feito" : ""}`; b.textContent = `${marcados.has(ex) ? "✓" : "○"} ${ex}`; });
        hojeCartao.append(b);
      }
      hojeCartao.append(botao("REGISTRAR TREINO", "primario", () => abrirRegistro(30, "Calistenia")));
    } else if (tipo === "caminhadaLeve") {
      hojeCartao.append(
        el("p", { class: "desc", texto: `${checagemSeguranca.caminhadaLeve}. Converse com um médico antes de treinar pesado.` }),
        botao("REGISTRAR CAMINHADA", "primario", () => abrirRegistro(15, "Caminhada/Corrida")),
        botao("DESCANSO PLANEJADO", "fantasma", () => descansar()),
      );
    } else {
      hojeCartao.append(
        el("p", { class: "desc", texto: "Hoje é dia de descanso. O descanso também é treino." }),
        botao("DESCANSO PLANEJADO", "primario", () => descansar()),
        botao("REGISTRAR TREINO", "fantasma", () => abrirRegistro(30, "Calistenia")),
      );
    }
    partes.push(hojeCartao);

    // Histórico, carga da semana e Fadiga
    const todos = (await listar("treinos")).filter((t) => !t.recuperacao);
    const fadiga = await fadigaAtual();
    const historico = await treinosRecentes(14);
    const hist = el("div", { class: "cartao" }, [
      el("h2", { class: "subtitulo-azul", texto: "HISTÓRICO" }),
      el("div", { class: "linha-ajuste" }, [el("span", { texto: "Carga da semana" }), el("strong", { texto: String(cargaDaSemana(todos, hoje)) })]),
      el("div", { class: "linha-ajuste" }, [el("span", { texto: "Fadiga" }), el("strong", { texto: fadiga === null ? "calibrando" : `${fadiga}/100` })]),
    ]);
    if (fadiga !== null) hist.append(barra(fadiga, 100, "xp"));
    if (fadiga !== null && fadiga > 80) hist.append(mensagemSistema(mensagens.fadigaAlta));
    if (!historico.length) hist.append(el("p", { class: "desc", texto: "Nenhum treino registrado ainda." }));
    for (const t of historico) {
      const detalhe = t.recuperacao ? "Descanso planejado" : `${t.modalidade} · ${t.minutos} min · esforço ${t.esforco} · carga ${cargaTreino(t.esforco, t.minutos)}`;
      hist.append(el("div", { class: "linha-hist" }, [el("span", { texto: formatarData(t.dia) }), el("span", { texto: detalhe })]));
    }
    partes.push(hist);

    partes.push(el("p", { class: "aviso", texto: avisos.treino }));
    elemento.replaceChildren(el("h1", { class: "titulo-tela", texto: "CORPO" }), ...partes);
  }

  async function descansar() {
    const r = await registrarDescanso();
    mensagensTela = r ? [mensagens.descanso] : [];
    await desenhar();
    for (const n of r?.subiuPara || []) levelUp(n, preencher(mensagens.levelUp, { N: n }));
  }

  await desenhar();
}
