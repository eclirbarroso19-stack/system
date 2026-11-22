// SYSTEM: gera etapas-dados.js com o texto de todos os arquivos de etapa.
// Por quê: o painel.html abre com duplo clique (file://) e o navegador não deixa ele ler os .md direto.
// Rodar sempre que um .md de docs/prompts mudar:  node docs/prompts/gerar-painel.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pasta = dirname(fileURLToPath(import.meta.url));
const janela = {};
new Function("window", readFileSync(join(pasta, "painel-dados.js"), "utf8"))(janela);

const arquivos = new Set(["00-COMO-USAR.md", "v1/B-modelo-conserto.md"]);
for (const v of janela.PAINEL.versoes) for (const e of v.etapas) if (e.arquivo) arquivos.add(e.arquivo);

const textos = {};
for (const a of arquivos) {
  const caminho = join(pasta, a);
  if (existsSync(caminho)) textos[a] = readFileSync(caminho, "utf8");
  else console.warn("Arquivo não encontrado:", a);
}

const saida = "// GERADO AUTOMATICAMENTE por gerar-painel.mjs. Não edite à mão.\n" +
  "window.ETAPAS_MD = " + JSON.stringify(textos, null, 0) + ";\n";
writeFileSync(join(pasta, "etapas-dados.js"), saida, "utf8");
console.log("etapas-dados.js gerado com", Object.keys(textos).length, "arquivos.");
