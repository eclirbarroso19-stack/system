import { el, botao, modal, toast } from "../ui.js";
import { VERSAO_APP, VERSAO_DADOS } from "../config.js";
import { avisos, checagemSeguranca } from "../textos.js";
import { lerCacador } from "../nucleo/cacador.js";
import { marcarLiberadoMedico, salvarParqVazio } from "../nucleo/saude.js";
import { lerMeta, limparTudo, emModoTeste } from "../nucleo/db.js";
import { avancarDiaTeste } from "../nucleo/dia.js";
import { abrirDia } from "../nucleo/diario.js";
import { gerarDadosFicticios } from "../nucleo/ficticios.js";
import { formatarData } from "../nucleo/formato.js";
import { fazerBackup, escolherEPedirRestauracao } from "../backup-ui.js";
import { jaInstalado, podeInstalar, instalar, aoMudarInstalacao } from "../instalacao.js";

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

  // Instalação como app: botão quando o Chrome permite; "App instalado ✓" quando já está instalado.
  const instalacao = el("div", { class: "cartao" });
  function desenharInstalacao() {
    if (!instalacao.isConnected && instalacao.dataset.pronto) { desligar(); return; }
    instalacao.dataset.pronto = "1";
    if (jaInstalado()) {
      instalacao.replaceChildren(linha("App", "App instalado ✓"));
    } else if (podeInstalar()) {
      instalacao.replaceChildren(botao("INSTALAR O SYSTEM", "primario", async () => { await instalar(); montar(elemento); }));
    } else {
      instalacao.replaceChildren(el("p", { class: "desc", texto: "Para instalar: menu ⋮ do Chrome → Instalar app (ou Adicionar à tela inicial)." }));
    }
  }
  const desligar = aoMudarInstalacao(desenharInstalacao);
  desenharInstalacao();

  // Checagem de Segurança (PAR-Q): liberação médica e refazer
  const cacador = await lerCacador();
  const parq = cacador?.parq;
  const seguranca = el("div", { class: "cartao" }, [
    el("h2", { class: "subtitulo-azul", texto: "CHECAGEM DE SEGURANÇA" }),
    el("p", { class: "desc", texto: !parq?.respondido ? "Ainda não respondida. Ela aparece na tela CORPO." : parq.temRisco ? (parq.liberadoMedico ? "Há risco, e você foi liberado pelo médico." : "Há risco: o treino vira caminhada leve até o médico liberar.") : "Corpo liberado para o treino." }),
    ...(parq?.temRisco && !parq.liberadoMedico ? [botao(checagemSeguranca.liberadoMedico, "primario", async () => { await marcarLiberadoMedico(true); toast("Liberação registrada."); montar(elemento); })] : []),
    ...(parq?.temRisco && parq.liberadoMedico ? [botao("Desfazer liberação", "fantasma", async () => { await marcarLiberadoMedico(false); montar(elemento); })] : []),
    botao("Refazer Checagem", "fantasma", async () => { await salvarParqVazio(); location.hash = "#corpo"; window.dispatchEvent(new Event("hashchange")); }),
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
    instalacao,
    el("p", { class: "aviso", texto: avisos.geral + "." }),
    seguranca,
    despertar,
    ...(teste ? [teste] : []),
    el("div", { class: "cartao" }, [linha("Versão do app", VERSAO_APP), linha("Versão dos dados", String(VERSAO_DADOS))]),
    perigo,
  );
}
