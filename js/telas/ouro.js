// Tela OURO: Dungeon do Ouro. Registro rápido, lista do dia e resumo do mês.
import { el, botao, barra, mensagemSistema, toast, levelUp } from "../ui.js";
import { listarEntreDias } from "../nucleo/db.js";
import { lerDia } from "../nucleo/cacador.js";
import { marcarSemGastos, registrarLancamento, editarLancamento, apagarLancamento } from "../nucleo/diario.js";
import {
  CATEGORIAS_SAIDA, CATEGORIAS_ENTRADA, categoriaPorId, resumoPeriodo, mesDoDia, limitesDoMes, somarMes, nomeDoMes,
} from "../nucleo/ouro.js";
import { diaDoJogo } from "../nucleo/dia.js";
import { formatarReais, lerReais } from "../nucleo/formato.js";
import { mensagens, avisos, preencher } from "../textos.js";

// Janela de tela cheia (fluxo rápido). Devolve { fechar, corpo }.
function telaCheia(titulo) {
  const corpo = el("div", { class: "fluxo-corpo" });
  const fundo = el("div", { class: "fluxo", role: "dialog", "aria-modal": "true" }, [
    el("div", { class: "fluxo-topo" }, [el("h2", { texto: titulo }), botao("✕", "fantasma", () => fundo.remove())]),
    corpo,
  ]);
  document.body.append(fundo);
  return { fechar: () => fundo.remove(), corpo };
}

export async function montar(elemento) {
  const hoje = diaDoJogo();
  const mesAtual = mesDoDia(hoje);
  let mes = mesAtual;
  let mensagensTela = [];

  // Mensagens do Sistema depois de salvar/editar/apagar.
  function mostrarResultado(r, lancamento) {
    const msgs = [];
    if (r.sync.pagouRegistro) msgs.push(mensagens.ouroConcluido);
    if (lancamento?.impulso && lancamento.tipo === "saida") msgs.push(mensagens.impulso);
    mensagensTela = msgs;
    for (const n of r.sync.subiuPara || []) levelUp(n, preencher(mensagens.levelUp, { N: n }));
  }

  function abrirEdicao(l) {
    const j = telaCheia("EDITAR LANÇAMENTO");
    const ehSaida = l.tipo === "saida";
    const valor = el("input", { class: "campo", inputmode: "decimal", value: formatarReais(l.valorCentavos).replace("R$ ", "") });
    const cat = el("select", { class: "campo" }, (ehSaida ? CATEGORIAS_SAIDA : CATEGORIAS_ENTRADA).map((c) => {
      const o = el("option", { value: c.id, texto: `${c.emoji} ${c.nome}` });
      if (c.id === l.categoria) o.selected = true;
      return o;
    }));
    const ess = el("select", { class: "campo" }, [
      el("option", { value: "1", texto: "Essencial" }),
      el("option", { value: "0", texto: "Não essencial" }),
    ]);
    ess.value = l.essencial ? "1" : "0";
    const imp = el("select", { class: "campo" }, [
      el("option", { value: "0", texto: "Não foi por impulso" }),
      el("option", { value: "1", texto: "Foi por impulso" }),
    ]);
    imp.value = l.impulso ? "1" : "0";
    const nota = el("input", { class: "campo", type: "text", maxlength: "120", placeholder: "Nota (opcional)", value: l.nota || "" });
    const erro = el("p", { class: "aviso", texto: "" });

    j.corpo.append(
      el("label", { class: "rotulo", texto: "Valor" }), valor,
      el("label", { class: "rotulo", texto: "Categoria" }), cat,
      ...(ehSaida ? [el("label", { class: "rotulo", texto: "Essencial?" }), ess, el("label", { class: "rotulo", texto: "Impulso?" }), imp] : []),
      el("label", { class: "rotulo", texto: "Nota" }), nota,
      erro,
      el("div", { class: "acoes" }, [
        botao("SALVAR", "primario", async () => {
          const v = lerReais(valor.value);
          if (!v || v <= 0) { erro.textContent = "Digite um valor maior que zero."; return; }
          const r = await editarLancamento(l.id, {
            valorCentavos: v, categoria: cat.value, nota: nota.value.trim(),
            ...(ehSaida ? { essencial: ess.value === "1", impulso: imp.value === "1" } : {}),
          });
          j.fechar();
          if (r) mostrarResultado(r, r.lancamento);
          await desenhar();
        }),
        botao("APAGAR", "perigo", async () => {
          if (!confirm("Apagar este lançamento?")) return;
          const s = await apagarLancamento(l.id);
          j.fechar();
          mostrarResultado({ sync: s }, null);
          await desenhar();
        }),
      ]),
    );
  }

  // Fluxo rápido: valor -> categoria -> (essencial se "Outros") -> impulso (só gasto).
  function novoLancamento(tipo) {
    const ehSaida = tipo === "saida";
    const j = telaCheia(ehSaida ? "NOVO GASTO" : "NOVA ENTRADA");
    let valorCentavos = 0;

    function passoValor() {
      const campo = el("input", { class: "campo campo-valor", inputmode: "decimal", placeholder: "0,00", "aria-label": "Valor em reais" });
      const erro = el("p", { class: "aviso", texto: "" });
      const ok = () => {
        const v = lerReais(campo.value);
        if (!v || v <= 0) { erro.textContent = "Digite um valor maior que zero."; return; }
        valorCentavos = v;
        passoCategoria();
      };
      campo.addEventListener("keydown", (e) => { if (e.key === "Enter") ok(); });
      j.corpo.replaceChildren(el("label", { class: "rotulo", texto: "Quanto foi? (R$)" }), campo, erro, botao("OK", "primario", ok));
      setTimeout(() => campo.focus(), 50);
    }

    function passoCategoria() {
      const lista = ehSaida ? CATEGORIAS_SAIDA : CATEGORIAS_ENTRADA;
      const grade = el("div", { class: "grade-cat" }, lista.map((c) =>
        el("button", { class: "botao cat", type: "button" }, [
          el("span", { class: "emoji", texto: c.emoji }),
          el("span", { texto: c.nome }),
        ])
      ));
      grade.querySelectorAll("button").forEach((b, i) => b.addEventListener("click", () => escolheu(lista[i])));
      j.corpo.replaceChildren(el("p", { class: "valor-grande", texto: formatarReais(valorCentavos) }), el("p", { class: "rotulo", texto: "Categoria" }), grade);
    }

    function escolheu(cat) {
      if (!ehSaida) return salvar({ categoria: cat.id });
      if (cat.essencialPadrao === null) return passoEssencial(cat);
      passoImpulso(cat, cat.essencialPadrao);
    }

    function passoEssencial(cat) {
      j.corpo.replaceChildren(
        el("p", { class: "pergunta-area", texto: "Esse gasto foi essencial?" }),
        el("div", { class: "acoes" }, [
          botao("ESSENCIAL", "primario", () => passoImpulso(cat, true)),
          botao("NÃO ESSENCIAL", "fantasma", () => passoImpulso(cat, false)),
        ]),
      );
    }

    function passoImpulso(cat, essencial) {
      j.corpo.replaceChildren(
        el("p", { class: "pergunta-area", texto: "Foi por impulso?" }),
        el("div", { class: "acoes" }, [
          botao("NÃO", "primario", () => salvar({ categoria: cat.id, essencial, impulso: false })),
          botao("SIM", "perigo", () => salvar({ categoria: cat.id, essencial, impulso: true })),
        ]),
      );
    }

    async function salvar(extra) {
      const r = await registrarLancamento({ tipo, valorCentavos, ...extra });
      j.fechar();
      mostrarResultado(r, r.lancamento);
      await desenhar();
      toast("Lançamento salvo.", { duracao: 6000, acao: { rotulo: "ADICIONAR NOTA", aoClicar: () => abrirEdicao(r.lancamento) } });
    }

    passoValor();
  }

  async function desenhar() {
    const lim = limitesDoMes(mes);
    const doMes = await listarEntreDias("ouro", lim.inicio, lim.fim);
    const r = resumoPeriodo(doMes);
    const doDia = doMes.filter((l) => l.dia === hoje).sort((a, b) => b.quando - a.quando);
    const dia = await lerDia();

    const numero = (rotulo, valor, negativo) => el("div", { class: "num" }, [
      el("span", { class: "num-rotulo", texto: rotulo }),
      el("strong", { class: negativo ? "negativo" : "", texto: formatarReais(valor) }),
    ]);

    const partes = [];
    for (const t of mensagensTela) partes.push(mensagemSistema(t));

    // Resumo do mês, com seletor
    partes.push(el("div", { class: "cartao" }, [
      el("div", { class: "seletor-mes" }, [
        botao("◀", "fantasma", () => { mes = somarMes(mes, -1); mensagensTela = []; desenhar(); }),
        el("strong", { texto: nomeDoMes(mes) }),
        botao("▶", "fantasma", () => { if (mes < mesAtual) { mes = somarMes(mes, 1); mensagensTela = []; desenhar(); } }),
      ]),
      el("div", { class: "numeros" }, [numero("ENTROU", r.entrou), numero("SAIU", r.saiu), numero("SOBROU", r.sobrou, r.sobrou < 0)]),
    ]));

    partes.push(el("div", { class: "acoes" }, [
      botao("+ GASTO", "gasto", () => novoLancamento("saida")),
      botao("+ ENTRADA", "entrada", () => novoLancamento("entrada")),
    ]));

    // Lista do dia
    const lista = el("div", { class: "cartao" }, [el("h2", { class: "subtitulo-azul", texto: "HOJE" })]);
    if (!doDia.length) lista.append(el("p", { class: "desc", texto: dia.semGastos ? "Hoje: nenhum gasto registrado." : "Nenhum lançamento hoje." }));
    for (const l of doDia) {
      const c = categoriaPorId(l.tipo, l.categoria);
      const tags = [];
      if (l.impulso) tags.push(el("span", { class: "tag perigo", texto: "IMPULSO" }));
      if (l.tipo === "saida" && l.essencial === false) tags.push(el("span", { class: "tag", texto: "NÃO ESSENCIAL" }));
      const linha = el("button", { class: "lancamento", type: "button" }, [
        el("span", { class: "emoji", texto: c?.emoji || "•" }),
        el("span", { class: "l-nome" }, [el("span", { texto: c?.nome || l.categoria }), ...tags]),
        el("strong", { class: l.tipo === "entrada" ? "entrada-valor" : "", texto: `${l.tipo === "entrada" ? "+" : "−"}${formatarReais(l.valorCentavos)}` }),
      ]);
      linha.addEventListener("click", () => abrirEdicao(l));
      lista.append(linha);
    }
    if (!dia.semGastos && !doDia.some((l) => l.tipo === "saida") && mes === mesAtual) {
      lista.append(botao("HOJE NÃO GASTEI NADA", "primario", async () => {
        const s = await marcarSemGastos();
        mostrarResultado({ sync: s }, null);
        await desenhar();
      }));
    }
    partes.push(lista);

    // Resumo do mês: essencial × não essencial, impulsos e top 3
    const mesCartao = el("div", { class: "cartao" }, [el("h2", { class: "subtitulo-azul", texto: "O MÊS" })]);
    if (r.saiu > 0) {
      const pctEss = Math.round((r.essencial / r.saiu) * 100);
      mesCartao.append(
        el("div", { class: "resumo-topo" }, [el("span", { texto: `Essencial ${formatarReais(r.essencial)}` }), el("span", { texto: `Não essencial ${formatarReais(r.naoEssencial)}` })]),
        barra(pctEss, 100, "xp"),
        el("p", { class: "desc", texto: `${pctEss}% essencial · ${100 - pctEss}% não essencial` }),
      );
    } else {
      mesCartao.append(el("p", { class: "desc", texto: "Nenhum gasto neste mês." }));
    }
    mesCartao.append(el("p", { class: "desc", texto: `Impulsos: ${r.qtdImpulsos} (${formatarReais(r.impulsos)})` }));
    if (r.porCategoria.length) {
      mesCartao.append(el("p", { class: "rotulo", texto: "Onde mais saiu" }));
      r.porCategoria.slice(0, 3).forEach((p, i) => {
        const c = categoriaPorId("saida", p.categoria);
        mesCartao.append(el("div", { class: "resumo-topo" }, [el("span", { texto: `${i + 1}. ${c?.emoji || ""} ${c?.nome || p.categoria}` }), el("strong", { texto: formatarReais(p.total) })]));
      });
    }
    partes.push(mesCartao);

    partes.push(el("p", { class: "aviso", texto: avisos.financas }));
    elemento.replaceChildren(el("h1", { class: "titulo-tela", texto: "DUNGEON DO OURO" }), ...partes);
  }

  await desenhar();
}
