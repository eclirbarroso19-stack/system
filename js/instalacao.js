// Instalação do app (PWA): captura o evento do Chrome e oferece o botão em Ajustes.
let eventoInstalar = null;
const ouvintes = new Set();

export function jaInstalado() {
  try {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  } catch {
    return false;
  }
}

export function podeInstalar() {
  return !!eventoInstalar;
}

// Avisa a tela de Ajustes quando o estado muda (instalável / instalado).
export function aoMudarInstalacao(funcao) {
  ouvintes.add(funcao);
  return () => ouvintes.delete(funcao);
}

function avisar() {
  ouvintes.forEach((f) => { try { f(); } catch { /* tela já saiu */ } });
}

async function pedirMemoriaProtegida() {
  try {
    if (navigator.storage && navigator.storage.persist) await navigator.storage.persist();
  } catch { /* sem suporte */ }
}

export function iniciarInstalacao() {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    eventoInstalar = e;
    avisar();
  });
  window.addEventListener("appinstalled", async () => {
    eventoInstalar = null;
    await pedirMemoriaProtegida(); // pede de novo depois de instalar
    avisar();
  });
  // Já abriu como app instalado: tenta de novo (o Chrome costuma conceder).
  if (jaInstalado()) pedirMemoriaProtegida();
}

// Abre o diálogo de instalação do Chrome. Devolve "accepted", "dismissed" ou null.
export async function instalar() {
  if (!eventoInstalar) return null;
  const e = eventoInstalar;
  eventoInstalar = null;
  await e.prompt();
  const escolha = await e.userChoice.catch(() => ({ outcome: null }));
  if (escolha.outcome === "accepted") await pedirMemoriaProtegida();
  avisar();
  return escolha.outcome;
}
