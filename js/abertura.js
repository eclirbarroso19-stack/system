// Tarefas de toda abertura do app: persistência, meta e lembrete de backup.
import { lerMeta, gravarMeta } from "./nucleo/db.js";
import { dataLegivel, lerEstadoBackup, deveLembrarBackup, marcarLembreteMostrado } from "./nucleo/backup.js";
import { diaDoJogo } from "./nucleo/dia.js";
import { mensagens } from "./textos.js";
import { botao, el } from "./ui.js";
import { fazerBackup } from "./backup-ui.js";

export async function aoAbrir() {
  try {
    const primeira = (await lerMeta("instaladoEm")) === undefined;
    if (primeira) {
      if (navigator.storage && navigator.storage.persist) await navigator.storage.persist().catch(() => {});
      await gravarMeta("instaladoEm", dataLegivel());
    }
    await gravarMeta("ultimaAbertura", dataLegivel());

    const dia = diaDoJogo();
    const estado = await lerEstadoBackup();
    if (deveLembrarBackup({ dia, ...estado })) {
      await marcarLembreteMostrado(dia);
      const aviso = el("div", { class: "toast" }, [
        el("span", { class: "msg-sistema", texto: mensagens.sexta }),
        botao("FAZER BACKUP", "primario", async () => { aviso.remove(); await fazerBackup(); }),
        botao("Depois", "fantasma", () => aviso.remove()),
      ]);
      document.body.append(aviso);
    }
  } catch (erro) {
    console.error("Erro na abertura:", erro);
  }
}
