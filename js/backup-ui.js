// Partes do backup que mexem na tela (download, escolher arquivo).
import { criarBackup, nomeArquivoBackup, registrarBackupFeito, validarBackup, restaurarBackup } from "./nucleo/backup.js";
import { diaDoJogo } from "./nucleo/dia.js";
import { mensagens } from "./textos.js";
import { toast, modal, el } from "./ui.js";

function baixarJson(objeto, nome) {
  const blob = new Blob([JSON.stringify(objeto, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = el("a", { href: url, download: nome });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export async function fazerBackup() {
  baixarJson(await criarBackup(), nomeArquivoBackup());
  await registrarBackupFeito(diaDoJogo());
  toast(mensagens.backupFeito);
}

// Escolhe um arquivo .json, valida e pede confirmação. aoTerminar: chamado depois de restaurar.
export function escolherEPedirRestauracao(aoTerminar) {
  const entrada = el("input", { type: "file", accept: ".json,application/json" });
  entrada.addEventListener("change", async () => {
    const arquivo = entrada.files[0];
    if (!arquivo) return;
    let obj;
    try { obj = JSON.parse(await arquivo.text()); } catch { obj = null; }
    const v = validarBackup(obj);
    if (!v.ok) {
      modal({ titulo: "[BACKUP RECUSADO]", conteudo: v.erro, botoes: [{ rotulo: "OK", tipo: "fantasma" }] });
      return;
    }
    modal({
      titulo: "[ATENÇÃO: OS DADOS ATUAIS SERÃO SUBSTITUÍDOS.]",
      conteudo: "Antes de substituir, o Sistema baixa uma cópia do estado atual. Guarde essa cópia fora da pasta do projeto.",
      botoes: [
        { rotulo: "Cancelar", tipo: "fantasma" },
        { rotulo: "Restaurar", tipo: "perigo", aoClicar: async () => {
          try {
            baixarJson(await criarBackup(), nomeArquivoBackup(new Date(), "-antes-de-restaurar"));
            await restaurarBackup(obj);
            aoTerminar();
          } catch (e) {
            modal({ titulo: "[ERRO AO RESTAURAR]", conteudo: String(e.message || e), botoes: [{ rotulo: "OK", tipo: "fantasma" }] });
          }
        } },
      ],
    });
  });
  entrada.click();
}
