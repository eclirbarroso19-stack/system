// Testes das regras do Raid de Foco (Livro 5.3). Importado por tests/testes.js.
import { RAID_XP, RAIDS_COM_XP_POR_DIA, raidTerminou, registrarRaidConcluido, resumoRaids, criarDiaVazio, avaliarDia } from "../js/nucleo/regras.js";

function igual(real, esperado) {
  if (real !== esperado) throw new Error(`esperado ${esperado}, veio ${real}`);
}

export const testesRaid = [
  { nome: "Raid: vale +5 XP e só os 4 primeiros do dia pagam", rodar() {
    igual(RAID_XP, 5);
    igual(RAIDS_COM_XP_POR_DIA, 4);
    let raids = [];
    const pagou = [];
    for (let i = 0; i < 6; i++) {
      const r = registrarRaidConcluido(raids, { inicio: i, minutos: 25 });
      raids = r.raids;
      pagou.push(r.daXP);
    }
    igual(pagou.join(","), "true,true,true,true,false,false");
    igual(raids.length, 6);
  } },
  { nome: "Raid: terminou só quando o tempo passou (app aberto ou fechado)", rodar() {
    const raid = { inicio: 1000, minutos: 25 };
    igual(raidTerminou(raid, 1000 + 25 * 60000 - 1), false);
    igual(raidTerminou(raid, 1000 + 25 * 60000), true);
    igual(raidTerminou(raid, 1000 + 3 * 3600000), true); // app ficou fechado
    igual(raidTerminou(undefined, 5), false);
  } },
  { nome: "Raid: resumo 'Raids hoje: N (M min)'", rodar() {
    const s = resumoRaids([{ minutos: 25 }, { minutos: 50 }, { minutos: 25 }]);
    igual(s.n, 3);
    igual(s.minutos, 100);
    igual(resumoRaids(undefined).n, 0);
    igual(resumoRaids([]).minutos, 0);
  } },
  { nome: "Raid: não mexe na lista original e guarda se pagou", rodar() {
    const antes = [{ inicio: 1, minutos: 25, xp: true }];
    const r = registrarRaidConcluido(antes, { inicio: 2, minutos: 50 });
    igual(antes.length, 1);
    igual(r.raids[1].minutos, 50);
    igual(r.raids[1].xp, true);
  } },
  { nome: "Raid: o dia novo começa sem raids e a Missão Principal continua pendente", rodar() {
    const dia = criarDiaVazio("2026-11-24");
    igual(dia.raids.length, 0);
    const r = registrarRaidConcluido(dia.raids, { inicio: 1, minutos: 25 });
    igual(dia.missoes.principal, false); // um raid terminado não conclui a missão
    igual(r.raids.length, 1);
    igual(avaliarDia(dia).cumpridas, 0);
  } },
];
