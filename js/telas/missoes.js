// Tela MISSÕES (inicial): as 5 missões do dia, Raid de Foco, punição e Zona.
import { el, botao, barra, mensagemSistema, toast, levelUp } from "../ui.js";
import { lerCacador, lerDia } from "../nucleo/cacador.js";
import { listarPorDia } from "../nucleo/db.js";
import { registrarDescanso, lerMP } from "../nucleo/saude.js";
import {
  abrirDia, consumirFila, primeiraAberturaDoDia, concluirMissao, desfazerConclusao,
  salvarPrincipalTexto, iniciarRaid, cancelarRaid, ouroCumprido, marcarSemGastos,
  registrarSono, concluirPunicao, finalizarRaidSeTerminou, sincronizarOuro,
} from "../nucleo/diario.js";
import { MISSOES_V1, MISSOES_ZONA, nivelDe, missoesPendentes, resumoRaids } from "../nucleo/regras.js";
import { diaDoJogo, horasAteVirada, noiteDoDia, agora } from "../nucleo/dia.js";
import { formatarData, nomeDiaSemana } from "../nucleo/formato.js";
import { mensagens, preencher, msgMissaoConcluida } from "../textos.js";

const ICONES = { treino: "⚔️", agua: "💧", principal: "🎯", ouro: "💰", sono: "🌙", caminhada10: "🚶" };

let intervalo = null;

function limparIntervalo() {
  if (intervalo) { clearInterval(intervalo); intervalo = null; }
}

function maiuscula1(t) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export async function montar(elemento) {
  limparIntervalo();
  await abrirDia();

  // Fila de mensagens do Sistema (uma de cada vez, com OK).
  const fila = [];
  if (await primeiraAberturaDoDia()) fila.push(mensagens.missaoDisponivel);
  for (const chave of await consumirFila()) fila.push(mensagens[chave]);

  let ultimaMsg = null; // resultado da última ação (mensagem no topo)

  async function concluir(id, opcoes) {
    const r = await concluirMissao(id, opcoes);
    if (!r) { await desenhar(); return; }
    await concluirResultado(r);
  }

  async function desenhar() {
    limparIntervalo();
    let cacador = await lerCacador();
    let dia = await lerDia();
    const zona = !!cacador.zona?.ativa;
    const lista = zona ? MISSOES_ZONA : MISSOES_V1;

    // Raid que terminou (com o app aberto ou fechado): registra, paga o XP e libera outro.
    // Não conclui a Missão Principal.
    let subiuDoRaid = [];
    const raidFeito = await finalizarRaidSeTerminou();
    if (raidFeito) {
      if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
      ultimaMsg = [raidFeito.daXP ? mensagens.raidConcluido : mensagens.raidConcluidoSemXP];
      subiuDoRaid = raidFeito.subiuPara;
      dia = await lerDia();
    }
    // Missão 4 é calculada pelos registros do Ouro.
    if (!zona) {
      const s = await sincronizarOuro();
      if (s.concluida) { await concluirResultado(s.concluida); return; }
    }
    dia = await lerDia();
    cacador = await lerCacador(); // lê de novo: o Raid ou o Ouro acima podem ter pago XP
    const mp = await lerMP();
    const temGasto = (await listarPorDia("ouro", dia.dia)).some((l) => l.tipo === "saida");

    const { nivel, xpNoNivel, xpParaProximo } = nivelDe(cacador.xpTotal);
    const hoje = diaDoJogo();
    const pend = missoesPendentes(dia, { zona }).length;

    const partes = [];

    // Mensagens em fila
    if (fila.length) {
      partes.push(el("div", { class: "msg-fila" }, [
        mensagemSistema(fila[0]),
        botao("OK", "fantasma", () => { fila.shift(); desenhar(); }),
      ]));
    }
    if (ultimaMsg) for (const t of ultimaMsg) partes.push(mensagemSistema(t));
    if (noiteDoDia(agora()) && pend > 0) {
      partes.push(mensagemSistema(preencher(mensagens.alerta21h, { H: horasAteVirada(), X: pend })));
    }

    // Topo
    partes.push(el("div", { class: "cartao resumo" }, [
      el("div", { class: "resumo-topo" }, [
        el("span", { class: "data", texto: `${maiuscula1(nomeDiaSemana(hoje))}, ${formatarData(hoje)}` }),
        el("strong", { texto: `Nível ${nivel}` }),
      ]),
      barra(xpNoNivel, xpParaProximo, "xp"),
      el("div", { class: "resumo-topo" }, [el("span", { texto: `XP ${xpNoNivel}/${xpParaProximo}` }), el("span", { texto: `💎 ${cacador.cristais}` })]),
      el("div", { class: "resumo-topo" }, [el("span", { texto: `HP ${cacador.hp}/100` }), el("span", { texto: `MP ${mp === null ? "—" : mp}` })]),
      barra(cacador.hp, 100, "hp"),
    ]));
    if (zona) {
      partes.push(el("div", { class: "faixa-zona", texto: `ZONA DE PENALIDADE: DIA ${Math.min(3, (cacador.zona.diasCumpridos || 0) + 1)}/3` }));
    }

    // Punição
    if (dia.punicao?.ativa) {
      const feita = dia.punicao.feita;
      partes.push(el("div", { class: `cartao missao punicao${feita ? " feita" : ""}` }, [
        el("div", { class: "missao-topo" }, [
          el("span", { class: "icone", texto: "⚠️" }),
          el("span", { class: "titulo", texto: "MISSÃO DE PUNIÇÃO: 20 min de caminhada extra" }),
          ...(feita ? [el("span", { class: "ok", texto: "✓" })] : []),
        ]),
        ...(feita ? [] : [el("div", { class: "acoes" }, [botao("CONCLUIR PUNIÇÃO", "perigo", async () => {
          if (await concluirPunicao()) ultimaMsg = [mensagens.punicaoCumprida];
          await desenhar();
        })])]),
      ]));
    }

    // Cartões das missões
    for (const m of lista) {
      const feita = !!dia.missoes[m.id];
      const acoes = [];
      const extra = [];

      if (m.id === "treino") {
        if (feita) extra.push(el("p", { class: "desc", texto: dia.recuperacao ? "Registrado: descanso planejado." : "Registrado: treino." }));
        else acoes.push(
          botao("IR PARA CORPO", "primario", () => { location.hash = "#corpo"; }),
          botao("DESCANSO PLANEJADO", "fantasma", async () => { const r = await registrarDescanso(); if (r) await concluirResultado(r); else await desenhar(); }),
        );
      } else if (m.id === "agua") {
        if (!feita) acoes.push(botao("BEBI 2 L", "primario", () => concluir("agua")));
      } else if (m.id === "caminhada10") {
        if (!feita) acoes.push(botao("CAMINHEI 10 MIN", "primario", () => concluir("caminhada10")));
      } else if (m.id === "sono") {
        if (!feita && dia.sonoRespondido === "nao") extra.push(el("p", { class: "desc", texto: "Registrado: não dormiu antes das 23h." }));
        else if (!feita) acoes.push(
          botao("SIM", "primario", async () => { const r = await registrarSono(true); if (r) await concluirResultado(r); else await desenhar(); }),
          botao("NÃO", "fantasma", async () => { await registrarSono(false); await desenhar(); }),
        );
      } else if (m.id === "ouro") {
        if (!feita) {
          acoes.push(botao("REGISTRAR NO OURO", "fantasma", () => { location.hash = "#ouro"; }));
          if (!temGasto) acoes.push(botao("HOJE NÃO GASTEI NADA", "primario", async () => {
            const s = await marcarSemGastos();
            if (s.concluida) await concluirResultado(s.concluida); else await desenhar();
          }));
        }
      } else if (m.id === "principal") {
        const campo = el("input", { type: "text", class: "campo", maxlength: "120", placeholder: "Qual é a missão principal de hoje?" });
        campo.value = dia.principalTexto || "";
        campo.addEventListener("change", () => salvarPrincipalTexto(campo.value.trim()));
        if (feita) extra.push(el("p", { class: "desc", texto: dia.principalTexto ? `Concluída: ${dia.principalTexto}` : "Concluída." }));
        else extra.push(campo);
        const rr = resumoRaids(dia.raids);
        if (rr.n > 0) extra.push(el("p", { class: "desc", texto: `Raids hoje: ${rr.n} (${rr.minutos} min)` }));
        const concluirPrincipal = async () => {
          await salvarPrincipalTexto(campo.value.trim());
          await cancelarRaid(); // cancelar não dá XP
          await concluir("principal");
        };
        if (dia.raid) {
          const fim = dia.raid.inicio + dia.raid.minutos * 60000;
          const contagem = el("div", { class: "contagem" });
          const atualizar = async () => {
            const resta = fim - agora().getTime();
            if (resta <= 0) {
              limparIntervalo();
              await desenhar(); // o desenhar() registra o Raid e paga o XP
              return;
            }
            const s = Math.ceil(resta / 1000);
            contagem.textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
          };
          extra.push(contagem);
          atualizar();
          intervalo = setInterval(atualizar, 1000);
          acoes.push(botao("CANCELAR RAID", "fantasma", async () => { await cancelarRaid(); await desenhar(); }));
          if (!feita) acoes.push(botao("JÁ CONCLUÍ", "primario", concluirPrincipal));
        } else {
          const iniciar = (min) => async () => { if (!feita) await salvarPrincipalTexto(campo.value.trim()); await iniciarRaid(min); await desenhar(); };
          acoes.push(
            botao("RAID DE FOCO 25 MIN", "fantasma", iniciar(25)),
            botao("RAID DE FOCO 50 MIN", "fantasma", iniciar(50)),
          );
          if (!feita) acoes.push(botao("JÁ CONCLUÍ", "primario", concluirPrincipal));
        }
      }

      partes.push(el("div", { class: `cartao missao${feita ? " feita" : ""}` }, [
        el("div", { class: "missao-topo" }, [
          el("span", { class: "icone", texto: ICONES[m.id] || "•" }),
          el("span", { class: "titulo", texto: m.titulo }),
          ...(feita ? [el("span", { class: "ok", texto: "✓", "aria-label": "concluída" })] : []),
        ]),
        el("p", { class: "desc", texto: m.descricao }),
        ...extra,
        ...(acoes.length ? [el("div", { class: "acoes" }, acoes)] : []),
      ]));
    }

    elemento.replaceChildren(el("h1", { class: "titulo-tela", texto: "MISSÕES DIÁRIAS" }), ...partes);
    for (const n of subiuDoRaid) levelUp(n, preencher(mensagens.levelUp, { N: n }));
  }

  // Resultado já pronto de registrarSono(true) (que chama concluirMissao): mostra mensagens e level up.
  async function concluirResultado(r) {
    const partes = [r.recuperacao ? mensagens.descanso : msgMissaoConcluida(r.xpGanho, r.cristais)];
    if (r.todas) partes.push(mensagens.todasConcluidas);
    ultimaMsg = partes;
    toast("Missão registrada.", {
      duracao: 6000,
      desfazer: async () => { await desfazerConclusao(r.snapshot); ultimaMsg = null; await desenhar(); },
    });
    await desenhar();
    for (const n of r.subiuPara) levelUp(n, preencher(mensagens.levelUp, { N: n }));
  }

  await desenhar();
}
