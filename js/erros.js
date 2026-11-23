// Captura erros globais e mostra [ERRO DO SISTEMA: ...] com botão para copiar os detalhes.
// Os detalhes não levam dados pessoais: só mensagem, pilha, versão, tela e aparelho.
import { VERSAO_APP } from "./config.js";
import { botao, el } from "./ui.js";

const MAX_CURTA = 80;

export function mensagemCurta(erro) {
  const bruta = String(erro && erro.message ? erro.message : erro || "erro desconhecido").replace(/\s+/g, " ").trim();
  return (bruta.length > MAX_CURTA ? bruta.slice(0, MAX_CURTA - 1) + "…" : bruta).toUpperCase();
}

export function detalhesDoErro(erro, origem = "") {
  return [
    "ERRO DO SISTEMA",
    `versão: ${VERSAO_APP}`,
    `tela: ${location.hash || "#"}`,
    `origem: ${origem}`,
    `mensagem: ${erro && erro.message ? erro.message : String(erro)}`,
    `pilha: ${(erro && erro.stack) || "(sem pilha)"}`,
    `aparelho: ${navigator.userAgent}`,
  ].join("\n");
}

async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // plano B para contextos sem a API de área de transferência
    const area = el("textarea", { style: "position:fixed;opacity:0" });
    area.value = texto;
    document.body.append(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { /* sem suporte */ }
    area.remove();
    return ok;
  }
}

let ultimaMensagem = "";

export function mostrarErro(erro, origem) {
  const curta = mensagemCurta(erro);
  if (curta === ultimaMensagem && document.getElementById("aviso-erro")) return; // evita enxurrada
  ultimaMensagem = curta;
  document.getElementById("aviso-erro")?.remove();
  const botaoCopiar = botao("COPIAR DETALHES", "primario", async () => {
    const ok = await copiar(detalhesDoErro(erro, origem));
    botaoCopiar.textContent = ok ? "COPIADO ✓" : "NÃO COPIOU";
  });
  const caixa = el("div", { id: "aviso-erro", class: "toast erro-sistema", role: "alert" }, [
    el("span", { class: "msg-sistema", texto: `[ERRO DO SISTEMA: ${curta}]` }),
    botaoCopiar,
    botao("Fechar", "fantasma", () => caixa.remove()),
  ]);
  document.body.append(caixa);
}

export function iniciarErros() {
  window.addEventListener("error", (e) => mostrarErro(e.error || e.message, "window.onerror"));
  window.addEventListener("unhandledrejection", (e) => mostrarErro(e.reason, "unhandledrejection"));
}
