import { testes } from "./testes.js";

let falhas = 0;
for (const t of testes) {
  try { await t.rodar(); console.log(`✔ ${t.nome}`); }
  catch (e) { falhas++; console.log(`✘ ${t.nome}: ${e.message}`); }
}
console.log(`\n${testes.length - falhas}/${testes.length} testes passaram`);
process.exit(falhas ? 1 : 0);
