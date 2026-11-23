// Dados FICTÍCIOS para o modo de teste (?teste=1). Nunca roda no app real.
import { obter, salvar, emModoTeste } from "./db.js";
import { diaDoJogo, somarDias } from "./dia.js";
import { criarDiaVazio, avaliarDia, MISSOES_V1 } from "./regras.js";

// Cria 30 dias anteriores a hoje com missões aleatórias (não mexe no caçador).
// Devolve quantos dias foram criados.
export async function gerarDadosFicticios() {
  if (!emModoTeste()) throw new Error("Só no modo de teste.");
  const hoje = diaDoJogo();
  let criados = 0;
  for (let i = 1; i <= 30; i++) {
    const d = somarDias(hoje, -i);
    if (await obter("dias", d)) continue;
    const reg = criarDiaVazio(d);
    for (const m of MISSOES_V1) reg.missoes[m.id] = Math.random() < 0.6;
    reg.avaliado = true;
    reg.resultado = { ...avaliarDia(reg), zona: false };
    await salvar("dias", reg);
    criados++;
  }
  return criados;
}
