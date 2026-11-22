// Registra o service worker e avisa quando há uma versão nova esperando.
import { mensagemSistema, botao, el } from "./ui.js";
import { sistema } from "./textos.js";

function mostrarAviso(worker) {
  if (document.getElementById("aviso-versao")) return;
  const caixa = el("div", { id: "aviso-versao", class: "toast" }, [
    el("span", { texto: sistema.novaVersao }),
    botao(sistema.atualizar, "primario", () => worker.postMessage({ tipo: "PULAR_ESPERA" })),
  ]);
  caixa.querySelector("span").className = "msg-sistema";
  document.body.append(caixa);
}

export async function montarNovaVersao() {
  let recarregando = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (recarregando) return;
    recarregando = true;
    location.reload();
  });
  try {
    const registro = await navigator.serviceWorker.register("./sw.js");
    if (registro.waiting && navigator.serviceWorker.controller) mostrarAviso(registro.waiting);
    registro.addEventListener("updatefound", () => {
      const novo = registro.installing;
      if (!novo) return;
      novo.addEventListener("statechange", () => {
        if (novo.state === "installed" && navigator.serviceWorker.controller) mostrarAviso(novo);
      });
    });
  } catch (erro) {
    console.error("Service worker não registrou:", erro);
  }
}
