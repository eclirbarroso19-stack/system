// Testes do deslocamento do modo de teste (localStorage). Importado por tests/testes.js.
// Usa localStorage e location falsos (só em memória), com dados fictícios.
import { deslocamentoTeste, avancarDiaTeste, zerarDeslocamentoTeste, textoFaixaTeste, agora, CHAVE_DESLOCAMENTO } from "../js/nucleo/dia.js";
import { limparTudo } from "../js/nucleo/db.js";

function igual(real, esperado) {
  if (real !== esperado) throw new Error(`esperado ${esperado}, veio ${real}`);
}

// Roda f com location/localStorage falsos e restaura tudo no fim.
async function comAmbiente(busca, f, guardado = {}) {
  const antes = { location: globalThis.location, localStorage: globalThis.localStorage, sessionStorage: globalThis.sessionStorage };
  const dados = { ...guardado };
  const falso = {
    getItem: (k) => (k in dados ? dados[k] : null),
    setItem: (k, v) => { dados[k] = String(v); },
    removeItem: (k) => { delete dados[k]; },
  };
  Object.defineProperty(globalThis, "location", { value: { search: busca }, configurable: true, writable: true });
  Object.defineProperty(globalThis, "localStorage", { value: falso, configurable: true, writable: true });
  Object.defineProperty(globalThis, "sessionStorage", { value: { getItem() { throw new Error("não deve usar sessionStorage"); }, setItem() { throw new Error("não deve usar sessionStorage"); } }, configurable: true, writable: true });
  try { return await f(dados); }
  finally {
    for (const k of Object.keys(antes)) {
      if (antes[k] === undefined) delete globalThis[k];
      else Object.defineProperty(globalThis, k, { value: antes[k], configurable: true, writable: true });
    }
  }
}

const DIA = 24 * 3600000;

export const testesDeslocamento = [
  { nome: "Deslocamento: AVANÇAR 1 DIA grava no localStorage (chave system-teste-deslocamento)", async rodar() {
    await comAmbiente("?teste=1", (dados) => {
      igual(CHAVE_DESLOCAMENTO, "system-teste-deslocamento");
      igual(deslocamentoTeste(), 0);
      avancarDiaTeste();
      avancarDiaTeste();
      igual(dados[CHAVE_DESLOCAMENTO], String(2 * DIA));
      igual(deslocamentoTeste(), 2 * DIA);
    });
  } },
  { nome: "Deslocamento: vale em outra aba/sessão (lê o que já estava no localStorage)", async rodar() {
    await comAmbiente("?teste=1", () => {
      igual(deslocamentoTeste(), 3 * DIA);
      avancarDiaTeste();
      igual(deslocamentoTeste(), 4 * DIA);
    }, { [CHAVE_DESLOCAMENTO]: String(3 * DIA) });
  } },
  { nome: "Deslocamento: fora do modo de teste é sempre 0 e nada é gravado", async rodar() {
    await comAmbiente("", (dados) => {
      avancarDiaTeste();
      igual(deslocamentoTeste(), 0);
      igual(dados[CHAVE_DESLOCAMENTO], String(5 * DIA)); // intocado
    }, { [CHAVE_DESLOCAMENTO]: String(5 * DIA) });
  } },
  { nome: "Deslocamento: zerarDeslocamentoTeste e APAGAR TUDO zeram no modo de teste", async rodar() {
    await comAmbiente("?teste=1", (dados) => {
      zerarDeslocamentoTeste();
      igual(deslocamentoTeste(), 0);
      igual(CHAVE_DESLOCAMENTO in dados, false);
    }, { [CHAVE_DESLOCAMENTO]: String(2 * DIA) });
    await comAmbiente("?teste=1", async (dados) => {
      await limparTudo().catch(() => {}); // sem IndexedDB no Node: o deslocamento é zerado antes
      igual(CHAVE_DESLOCAMENTO in dados, false);
    }, { [CHAVE_DESLOCAMENTO]: String(2 * DIA) });
  } },
  { nome: "Deslocamento: fora do modo de teste, apagar tudo não mexe no localStorage", async rodar() {
    await comAmbiente("", async (dados) => {
      await limparTudo().catch(() => {});
      igual(dados[CHAVE_DESLOCAMENTO], String(DIA));
    }, { [CHAVE_DESLOCAMENTO]: String(DIA) });
  } },
  { nome: "Deslocamento: valor inválido vira 0", async rodar() {
    await comAmbiente("?teste=1", () => { igual(deslocamentoTeste(), 0); }, { [CHAVE_DESLOCAMENTO]: "abc" });
  } },
  { nome: "Banner: mostra a data simulada (MODO DE TESTE · DD/MM/AAAA)", async rodar() {
    await comAmbiente("?teste=1", () => {
      const d = agora();
      const p = (n) => String(n).padStart(2, "0");
      const hoje = `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
      igual(textoFaixaTeste(), `MODO DE TESTE · ${hoje}`);
      if (!/^MODO DE TESTE · \d{2}\/\d{2}\/\d{4}$/.test(textoFaixaTeste())) throw new Error("formato errado");
      const antes = textoFaixaTeste();
      avancarDiaTeste();
      if (textoFaixaTeste() === antes) throw new Error("a data do banner não mudou");
    });
  } },
];
