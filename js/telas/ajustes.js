import { el, botao, modal, toast } from "../ui.js";
import { VERSAO_APP, VERSAO_DADOS } from "../config.js";
import { avisos } from "../textos.js";
import { lerMeta, limparTudo } from "../nucleo/db.js";
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

  const perigo = el("div", { class: "cartao zona-perigo" }, [
    el("h2", { class: "subtitulo", texto: "ZONA DE PERIGO" }),
    botao("Apagar tudo", "perigo", pedirApagarTudo),
  ]);

  elemento.replaceChildren(
    el("h1", { class: "titulo-tela", texto: "AJUSTES" }),
    memoria,
    el("p", { class: "aviso", texto: avisos.geral + "." }),
    el("div", { class: "cartao" }, [linha("Versão do app", VERSAO_APP), linha("Versão dos dados", String(VERSAO_DADOS))]),
    perigo,
  );
}
