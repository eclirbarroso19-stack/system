// Tela MENTE: check-in da manhã, Ritual da Noite, MP e CVV 188.
// Privacidade: nenhum dado emocional vai para console ou log; só IndexedDB e backup.
import { el, botao, mensagemSistema, levelUp } from "../ui.js";
import { lerDia } from "../nucleo/cacador.js";
import { agora } from "../nucleo/dia.js";
import { checkinDeHoje, registrarCheckinManha, registrarRitualNoite, humorUltimos7Dias, lerMP } from "../nucleo/saude.js";
import { graficoHumor } from "../radar.js";
import { avisos, mensagens, preencher } from "../textos.js";

const HUMORES = [
  { v: 1, emoji: "😞", nome: "Péssimo" },
  { v: 2, emoji: "😕", nome: "Ruim" },
  { v: 3, emoji: "😐", nome: "Normal" },
  { v: 4, emoji: "🙂", nome: "Bom" },
  { v: 5, emoji: "😄", nome: "Ótimo" },
];
const EMOCOES = ["Alegria", "Confiança", "Medo", "Surpresa", "Tristeza", "Aversão", "Raiva", "Expectativa"];

function botoesDeHumor(aoEscolher, atual = null) {
  const lista = el("div", { class: "humores" });
  for (const h of HUMORES) {
    const b = el("button", { class: `humor${atual === h.v ? " ligado" : ""}`, type: "button", "aria-label": `${h.v} ${h.nome}` }, [
      el("span", { class: "emoji", texto: h.emoji }), el("span", { texto: `${h.v} ${h.nome}` }),
    ]);
    b.addEventListener("click", () => {
      lista.querySelectorAll(".humor").forEach((x) => x.classList.remove("ligado"));
      b.classList.add("ligado");
      aoEscolher(h.v);
    });
    lista.append(b);
  }
  return lista;
}

export async function montar(elemento) {
  let mensagensTela = [];

  async function desenhar() {
    const dia = await lerDia();
    const manha = await checkinDeHoje("manha");
    const noite = await checkinDeHoje("noite");
    const mp = await lerMP();
    const partes = [];
    for (const t of mensagensTela) partes.push(mensagemSistema(t));

    partes.push(el("p", { class: "aviso", texto: avisos.emocoes }));
    partes.push(el("div", { class: "cartao resumo" }, [
      el("div", { class: "resumo-topo" }, [el("strong", { texto: "MP (energia mental)" }), el("strong", { texto: mp === null ? "—" : `${mp}/100` })]),
      el("p", { class: "desc", texto: mp === null ? "Faça o primeiro check-in para calcular o seu MP." : "Média dos 3 últimos humores, com bônus de sono." }),
    ]));

    // Check-in da manhã: 1 toque
    const cartaoManha = el("div", { class: "cartao" }, [el("h2", { class: "subtitulo-azul", texto: "CHECK-IN DA MANHÃ" })]);
    if (manha) {
      cartaoManha.append(el("p", { class: "desc", texto: `✓ Feito hoje (humor ${manha.humor}).` }));
    } else {
      cartaoManha.append(el("p", { class: "desc", texto: "Como você está agora?" }), botoesDeHumor(async (v) => {
        const r = await registrarCheckinManha(v);
        if (r) mensagensTela = [preencher(mensagens.checkinManha, { MP: r.mp === null ? "—" : r.mp })];
        await desenhar();
        for (const n of r?.subiuPara || []) levelUp(n, preencher(mensagens.levelUp, { N: n }));
      }));
    }
    partes.push(cartaoManha);

    // Ritual da Noite (destacado a partir das 18h)
    const destaque = agora().getHours() >= 18 && !noite;
    const cartaoNoite = el("div", { class: `cartao${destaque ? " destaque-noite" : ""}` }, [el("h2", { class: "subtitulo-azul", texto: "RITUAL DA NOITE" })]);
    if (noite) {
      cartaoNoite.append(el("p", { class: "desc", texto: "✓ Ritual da Noite feito hoje. Descanse, Caçador." }));
    } else {
      const estado = { humor: null, emocao: null, dormiu: null };
      const perguntarSono = !dia.missoes.sono && dia.sonoRespondido !== "nao";
      const intensidade = el("input", { type: "range", min: "1", max: "10", value: "5", class: "slider", "aria-label": "Intensidade da emoção de 1 a 10" });
      const valorInt = el("strong", { class: "minutos", texto: "5" });
      intensidade.addEventListener("input", () => { valorInt.textContent = intensidade.value; });
      const emocaoBotoes = el("div", { class: "emocoes" }, EMOCOES.map((nome) => {
        const b = el("button", { class: "botao", type: "button", texto: nome });
        b.addEventListener("click", () => {
          emocaoBotoes.querySelectorAll(".botao").forEach((x) => x.classList.remove("ligado"));
          b.classList.add("ligado");
          estado.emocao = nome;
        });
        return b;
      }));
      const boas = [1, 2, 3].map((n) => el("input", { class: "campo", type: "text", maxlength: "100", placeholder: `Coisa boa ${n}`, autocomplete: "off" }));
      const motivo = el("input", { class: "campo", type: "text", maxlength: "140", placeholder: "Meu motivo para levantar hoje foi…", autocomplete: "off" });
      const erro = el("p", { class: "aviso", texto: "" });

      cartaoNoite.append(
        el("p", { class: "rotulo", texto: "1. Como foi o seu humor hoje?" }),
        botoesDeHumor((v) => { estado.humor = v; }),
        el("p", { class: "rotulo", texto: "2. Qual emoção mais forte?" }),
        emocaoBotoes,
        el("p", { class: "rotulo", texto: "Intensidade (1 fraca – 10 forte)" }),
        el("div", { class: "linha-minutos" }, [intensidade, valorInt]),
        el("p", { class: "rotulo", texto: "3. Três coisas boas de hoje" }),
        ...boas,
        el("p", { class: "rotulo", texto: "4. Qual foi o seu motivo para levantar hoje?" }),
        motivo,
      );
      if (perguntarSono) {
        const sim = botao("SIM", "primario", () => { estado.dormiu = true; sim.classList.add("ligado"); nao.classList.remove("ligado"); });
        const nao = botao("NÃO", "fantasma", () => { estado.dormiu = false; nao.classList.add("ligado"); sim.classList.remove("ligado"); });
        cartaoNoite.append(el("p", { class: "rotulo", texto: "5. Dormi antes das 23h ontem?" }), el("div", { class: "grupo-botoes" }, [sim, nao]));
      }
      cartaoNoite.append(erro, botao("CONCLUIR RITUAL", "primario", async () => {
        if (estado.humor === null) { erro.textContent = "Escolha o seu humor de hoje."; return; }
        const r = await registrarRitualNoite({
          humor: estado.humor,
          emocao: estado.emocao,
          intensidade: estado.emocao ? Number(intensidade.value) : null,
          coisasBoas: boas.map((b) => b.value.trim()).filter(Boolean),
          motivo: motivo.value.trim(),
          dormiu: perguntarSono ? estado.dormiu : null,
        });
        mensagensTela = r ? [mensagens.ritualNoite] : [];
        await desenhar();
        for (const n of r?.subiuPara || []) levelUp(n, preencher(mensagens.levelUp, { N: n }));
      }));
    }
    partes.push(cartaoNoite);

    // Últimos 7 dias
    partes.push(el("div", { class: "cartao" }, [
      el("h2", { class: "subtitulo-azul", texto: "HUMOR: ÚLTIMOS 7 DIAS" }),
      graficoHumor(await humorUltimos7Dias()),
    ]));

    partes.push(el("a", { class: "cvv", href: avisos.cvvTel, texto: `${avisos.cvv} · conversar agora` }));
    elemento.replaceChildren(el("h1", { class: "titulo-tela", texto: "MENTE" }), ...partes);
  }

  await desenhar();
}
