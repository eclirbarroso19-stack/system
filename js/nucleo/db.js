// Banco IndexedDB do SYSTEM. API em Promises. Sem DOM.
// Modo de teste: URL com ?teste=1 usa o banco "system-teste" (não suja os dados reais).
import { VERSAO_DADOS, NOME_BANCO } from "../config.js";
import { zerarDeslocamentoTeste } from "./dia.js";

// Todas as stores já na v1 (CLAUDE.md seção 7). chave: keyPath; auto: autoIncrement.
export const STORES = [
  { nome: "meta", chave: "chave" },
  { nome: "cacador", chave: "id" },
  { nome: "dias", chave: "dia" },
  { nome: "eventos", chave: "id", auto: true, indices: ["dia", "quando"] },
  { nome: "ouro", chave: "id", auto: true, indices: ["dia"] },
  { nome: "treinos", chave: "id", auto: true, indices: ["dia"] },
  { nome: "checkins", chave: "id", auto: true, indices: ["dia"] },
  { nome: "diagnosticos", chave: "id", auto: true, indices: ["dia"] },
  { nome: "missoesExtras", chave: "id", auto: true },
  { nome: "metas", chave: "id", auto: true },
  { nome: "sombras", chave: "id" },
  { nome: "batalhas", chave: "id", auto: true },
  { nome: "dividas", chave: "id", auto: true },
  { nome: "baus", chave: "id" },
  { nome: "estudos", chave: "id", auto: true },
  { nome: "aliados", chave: "id", auto: true },
  { nome: "rituais", chave: "id", auto: true },
  { nome: "portais", chave: "id" },
  { nome: "titulos", chave: "id" },
  { nome: "loja", chave: "id", auto: true },
];

export const NOMES_STORES = STORES.map((s) => s.nome);

export function emModoTeste() {
  return typeof location !== "undefined" && new URLSearchParams(location.search).get("teste") === "1";
}

export function nomeDoBanco() {
  return emModoTeste() ? `${NOME_BANCO}-teste` : NOME_BANCO;
}

let _abrindo = null;

export function abrir() {
  if (_abrindo) return _abrindo;
  _abrindo = new Promise((resolve, reject) => {
    const req = indexedDB.open(nomeDoBanco(), VERSAO_DADOS);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of STORES) {
        if (db.objectStoreNames.contains(s.nome)) continue; // nunca apaga dados
        const store = db.createObjectStore(s.nome, { keyPath: s.chave, autoIncrement: !!s.auto });
        for (const ind of s.indices || []) store.createIndex(ind, ind);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => { _abrindo = null; reject(req.error); };
    req.onblocked = () => { _abrindo = null; reject(new Error("Banco bloqueado por outra aba")); };
  });
  return _abrindo;
}

function pedido(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function terminou(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error("Transação cancelada"));
  });
}

async function store(nome, modo = "readonly") {
  const db = await abrir();
  return db.transaction(nome, modo).objectStore(nome);
}

export async function obter(nome, chave) {
  return pedido((await store(nome)).get(chave));
}

export async function salvar(nome, objeto) {
  return pedido((await store(nome, "readwrite")).put(objeto));
}

export async function adicionar(nome, objeto) {
  return pedido((await store(nome, "readwrite")).add(objeto));
}

export async function listar(nome) {
  return pedido((await store(nome)).getAll());
}

export async function listarPorDia(nome, dia) {
  return pedido((await store(nome)).index("dia").getAll(dia));
}

// Registros com dia entre inicio e fim (inclusive). Dias são "AAAA-MM-DD".
export async function listarEntreDias(nome, inicio, fim) {
  return pedido((await store(nome)).index("dia").getAll(IDBKeyRange.bound(inicio, fim)));
}

export async function apagar(nome, chave) {
  return pedido((await store(nome, "readwrite")).delete(chave));
}

export async function limparTudo() {
  zerarDeslocamentoTeste(); // só age no modo de teste
  const db = await abrir();
  const tx = db.transaction(NOMES_STORES, "readwrite");
  for (const n of NOMES_STORES) tx.objectStore(n).clear();
  return terminou(tx);
}

// Devolve { nomeDaStore: [registros] } com todas as stores.
export async function exportarTudo() {
  const db = await abrir();
  const tx = db.transaction(NOMES_STORES, "readonly");
  const pedidos = NOMES_STORES.map((n) => pedido(tx.objectStore(n).getAll()));
  const listas = await Promise.all(pedidos);
  const saida = {};
  NOMES_STORES.forEach((n, i) => { saida[n] = listas[i]; });
  return saida;
}

// Substitui TODO o conteúdo pelas stores do objeto (tudo numa transação só:
// se algo falhar, nada muda).
export async function importarTudo(stores) {
  const db = await abrir();
  const tx = db.transaction(NOMES_STORES, "readwrite");
  for (const n of NOMES_STORES) {
    const s = tx.objectStore(n);
    s.clear();
    for (const registro of stores[n] || []) s.put(registro);
  }
  return terminou(tx);
}

// Atalhos para a store "meta" (registros { chave, valor }).
export async function lerMeta(chave) {
  const r = await obter("meta", chave);
  return r ? r.valor : undefined;
}

export async function gravarMeta(chave, valor) {
  return salvar("meta", { chave, valor });
}
