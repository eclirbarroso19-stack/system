// Despertar Rápido: abertura, nome, honestidade, 7 perguntas e resultado.
import { el, botao, barra, mensagemSistema } from "../ui.js";
import { abertura, perguntasDespertar, resultadoDespertar, preencher } from "../textos.js";
import { notaDaOpcao, rankDaNota, criarCacadorInicial, AREAS } from "../nucleo/regras.js";
import { diaDoJogo } from "../nucleo/dia.js";
import { adicionar, salvar } from "../nucleo/db.js";
import { lerCacador } from "../nucleo/cacador.js";
import { radar } from "../radar.js";

// Vai para uma rota; se já está nela, força o redesenho (o hashchange não dispara sozinho).
function ir(hash) {
  if (location.hash === hash) window.dispatchEvent(new Event("hashchange"));
  else location.hash = hash;
}

// arg === "refazer": só atualiza os ranks provisórios, sem mexer em XP, HP nem Cristais.
export async function montar(elemento, arg) {
  const refazer = arg === "refazer";
  const respostas = new Array(perguntasDespertar.length).fill(null);
  let nome = "";

  const mostrar = (...filhos) => elemento.replaceChildren(...filhos);

  function passoAbertura() {
    mostrar(
      mensagemSistema(abertura.deteccao, { digitar: true }),
      mensagemSistema(abertura.iniciar),
      el("div", { class: "grupo-botoes" }, [
        botao(abertura.aceitar, "primario", refazer ? passoHonestidade : passoNome),
        botao(abertura.agoraNao, "fantasma", passoAgoraNao),
      ]),
    );
  }

  function passoAgoraNao() {
    mostrar(
      el("p", { class: "aviso", texto: "Sem pressa. Quando quiser, o Despertar estará aqui." }),
      el("div", { class: "grupo-botoes" }, [botao("Despertar", "primario", passoAbertura)]),
    );
    if (refazer) elemento.append(el("div", { class: "grupo-botoes" }, [botao("Voltar", "fantasma", () => { ir("#ajustes"); })]));
  }

  function passoNome() {
    const campo = el("input", { type: "text", class: "campo", maxlength: "30", autocomplete: "off", placeholder: "Seu nome" });
    campo.value = nome;
    const continuar = botao("Continuar", "primario", () => {
      const v = campo.value.trim();
      if (!v) { campo.focus(); return; }
      nome = v;
      passoHonestidade();
    });
    campo.addEventListener("keydown", (e) => { if (e.key === "Enter") continuar.click(); });
    mostrar(
      el("label", { class: "pergunta", texto: abertura.perguntaNome }, []),
      campo,
      el("div", { class: "grupo-botoes" }, [continuar]),
    );
    campo.focus();
  }

  function passoHonestidade() {
    mostrar(
      mensagemSistema(abertura.honestidade, { digitar: true }),
      el("div", { class: "grupo-botoes" }, [
        botao("Voltar", "fantasma", refazer ? passoAbertura : passoNome),
        botao("Começar", "primario", () => passoPergunta(0)),
      ]),
    );
  }

  function passoPergunta(i) {
    const p = perguntasDespertar[i];
    const opcoes = p.opcoes.map((texto, idx) =>
      botao(texto, respostas[i] === idx ? "primario" : "", () => {
        respostas[i] = idx;
        if (i + 1 < perguntasDespertar.length) passoPergunta(i + 1);
        else terminar();
      }));
    for (const b of opcoes) b.classList.add("opcao");
    mostrar(
      el("div", { class: "progresso" }, [el("span", { texto: `${i + 1}/${perguntasDespertar.length}` }), barra(i + 1, perguntasDespertar.length, "xp")]),
      el("h2", { class: "pergunta-area", texto: `${p.emoji} ${p.nome}` }),
      el("p", { class: "pergunta", texto: p.pergunta }),
      el("div", { class: "opcoes" }, opcoes),
      el("div", { class: "grupo-botoes" }, [botao("Voltar", "fantasma", () => (i === 0 ? passoHonestidade() : passoPergunta(i - 1)))]),
    );
  }

  async function terminar() {
    const notasArea = {};
    perguntasDespertar.forEach((p, i) => { notasArea[p.area] = notaDaOpcao(respostas[i]); });
    await adicionar("diagnosticos", {
      tipo: "rapido", dia: diaDoJogo(), quando: Date.now(),
      respostas: Object.fromEntries(perguntasDespertar.map((p, i) => [p.area, respostas[i]])),
      notasArea,
    });

    let cacador;
    if (refazer) {
      cacador = await lerCacador();
      for (const a of AREAS) {
        const atual = cacador.ranksArea[a];
        if (!atual || atual.provisorio) cacador.ranksArea[a] = { nota: notasArea[a], rank: rankDaNota(notasArea[a]), provisorio: true };
      }
    } else {
      cacador = criarCacadorInicial(nome);
      for (const a of AREAS) cacador.ranksArea[a] = { nota: notasArea[a], rank: rankDaNota(notasArea[a]), provisorio: true };
    }
    await salvar("cacador", cacador);
    resultado(cacador);
  }

  function resultado(cacador) {
    const lista = el("div", { class: "revelacao" });
    const final = el("div", { class: "final", hidden: "" });
    mostrar(mensagemSistema(resultadoDespertar.concluida, { digitar: true }), lista, final);

    let indice = 0;
    let temporizador = null;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function revelarFinal() {
      clearTimeout(temporizador);
      indice = AREAS.length;
      while (lista.children.length < AREAS.length) revelarProxima(true);
      final.replaceChildren(
        radar(Object.fromEntries(AREAS.map((a) => [a, cacador.ranksArea[a].nota]))),
        mensagemSistema(resultadoDespertar.rankCacador),
        mensagemSistema(resultadoDespertar.jornada),
        botao(refazer ? "Voltar aos Ajustes" : "ENTRAR", "primario", () => { ir(refazer ? "#ajustes" : "#missoes"); }),
      );
      final.hidden = false;
      elemento.removeEventListener("click", pular);
    }

    function revelarProxima(semAgendar) {
      const area = AREAS[lista.children.length];
      const p = perguntasDespertar.find((q) => q.area === area);
      const dado = cacador.ranksArea[area];
      lista.append(mensagemSistema(preencher(resultadoDespertar.area, { "ÁREA": p.nome.toUpperCase(), RANK: dado.rank })));
      if (semAgendar) return;
      if (lista.children.length < AREAS.length) temporizador = setTimeout(revelarProxima, reduzido ? 300 : 1200);
      else temporizador = setTimeout(revelarFinal, reduzido ? 300 : 1200);
    }

    const pular = () => revelarFinal(); // um toque pula a animação
    elemento.addEventListener("click", pular);
    temporizador = setTimeout(revelarProxima, reduzido ? 300 : 1200);
  }

  passoAbertura();
}
