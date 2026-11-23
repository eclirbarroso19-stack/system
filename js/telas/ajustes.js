import { el, botao, modal, toast } from "../ui.js";
import { VERSAO_APP, VERSAO_DADOS } from "../config.js";
import { avisos } from "../textos.js";
import { lerMeta, limparTudo, emModoTeste } from "../nucleo/db.js";
import { avancarDiaTeste } from "../nucleo/dia.js";
import { abrirDia } from "../nucleo/diario.js";
import { gerarDadosFicticios } from "../nucleo/ficticios.js";
import { formatarData } from "../nucleo/formato.js";
import { fazerBackup, escolherEPedirRestauracao } from "../backup-ui.js";

function linha(rotulo, valor) {
  return el("div", { class: "linha-ajuste" }, [el("span", { texto: rotulo }), el("strong", { texto: valor })]);
}

function pedirApagarTudo() {
  const campo = el("input", { type: "text", class: "campo", placeholder: "APAGAR", autocomplete: "off" });
  const corpo = el("div", {}, [el("p", { texto: "Isso apaga TODOS os dados do app neste aparelho. Faça um backup antes. Digite APAGAR para confirmar." }), campo]);
  modal({
    titulo: "[APAGAR TUDO]",
    conteudo: corpo,
    botoes: [
      { rotulo: "Cancelar", tipo: "fantasma" },
      { rotulo: "Apagar tudo", tipo: "perigo", aoClicar: async () => {
        if (campo.value.trim().toUpperCase() !== "APAGAR") { toast("Nada foi apagado: faltou digitar APAGAR."); return; }
        await limparTudo();
        location.reload();
      } },
    ],
  });
}

export async function montar(elemento) {
  let protegida = false;
  try { protegida = !!(navigator.storage && (await navigator.storage.persisted())); } catch { /* sem suporte */ }
  const ultimo = await lerMeta("ultimoBackup");

  const memoria = el("div", { class: "cartao" }, [
    linha("Memória protegida", protegida ? "SIM" : "NÃO"),
    linha("Último backup", ultimo ? formatarData(ultimo) : "nunca"),
    el("div", { class: "grupo-botoes" }, [
      botao("Fazer backup", "primario", async () => { await fazerBackup(); montar(elemento); }),
      botao("Restaurar", "fantasma", () => escolherEPedirRestauracao(() => location.reload())),
    ]),
  ]);

  const despertar = el("div", { class: "cartao" }, [
    botao("Refazer Despertar Rápido", "fantasma", () => { location.hash = "#despertar/refazer"; }),
    el("p", { class: "aviso", texto: "Atualiza só os ranks provisórios. Não mexe em XP, HP nem Cristais." }),
  ]);

  // Só no modo de teste (?teste=1): viajar no tempo e gerar dados fictícios.
  const teste = emModoTeste() ? el("div", { class: "cartao" }, [
    el("h2", { class: "subtitulo azul", texto: "MODO DE TESTE" }),
    el("div", { class: "grupo-botoes" }, [
      botao("AVANÇAR 1 DIA", "primario", async () => {
        avancarDiaTeste();
        await abrirDia();
        toast("Um dia avançou. Veja a aba MISSÕES.");
        location.hash = "#missoes";
        window.dispatchEvent(new Event("hashchange"));
      }),
      botao("GERAR DADOS FICTÍCIOS", "fantasma", async () => {
        const n = await gerarDadosFicticios();
        toast(n + " dias fictícios criados.");
      }),
    ]),
  ]) : null;

  const perigo = el("div", { class: "cartao zona-perigo" }, [
    el("h2", { class: "subtitulo", texto: "ZONA DE PERIGO" }),
    botao("Apagar tudo", "perigo", pedirApagarTudo),
  ]);

  elemento.replaceChildren(
    el("h1", { class: "titulo-tela", texto: "AJUSTES" }),
    memoria,
    el("p", { class: "aviso", texto: avisos.geral + "." }),
    despertar,
    ...(teste ? [teste] : []),
    el("div", { class: "cartao" }, [linha("Versão do app", VERSAO_APP), linha("Versão dos dados", String(VERSAO_DADOS))]),
    perigo,
  );
}
