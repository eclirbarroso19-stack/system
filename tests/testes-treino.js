// Testes de treino, Fadiga e MP (etapa 1.6). Importado por tests/testes.js.
import {
  calcularMP, cargaTreino, calcularFadiga, cargaDaSemana, treinoDoDia, faltouTreinoPlanejado, avaliarParq, diasTreinoEfetivos,
} from "../js/nucleo/treino.js";

function igual(real, esperado) {
  if (real !== esperado) throw new Error(`esperado ${esperado}, veio ${real}`);
}

const hoje = "2026-11-23"; // segunda-feira
const tr = (dia, esforco = 5, minutos = 30) => ({ dia, esforco, minutos });

export const testesTreino = [
  { nome: "MP: sem check-ins é null", rodar() { igual(calcularMP([], true), null); igual(calcularMP(undefined), null); } },
  { nome: "MP: 1 check-in e 3 check-ins (só os 3 últimos)", rodar() {
    igual(calcularMP([{ humor: 4, quando: 1 }], false), 80);
    igual(calcularMP([{ humor: 1, quando: 1 }, { humor: 3, quando: 2 }, { humor: 4, quando: 3 }, { humor: 5, quando: 4 }], false), 80); // (3+4+5)/3 = 4
  } },
  { nome: "MP: bônus do sono e máximo 100", rodar() {
    igual(calcularMP([{ humor: 3, quando: 1 }], true), 70);
    igual(calcularMP([{ humor: 5, quando: 1 }], true), 100);
    igual(calcularMP([{ humor: 2, quando: 1 }, { humor: 3, quando: 2 }], false), 50);
  } },
  { nome: "Treino: carga = esforço × minutos", rodar() { igual(cargaTreino(7, 40), 280); } },
  { nome: "Fadiga: null (calibrando) com pouco histórico", rodar() {
    igual(calcularFadiga([], hoje), null);
    igual(calcularFadiga([tr("2026-11-20"), tr("2026-11-10")], hoje), null); // só 13 dias de histórico
  } },
  { nome: "Fadiga: normal = 50 e pico de carga = 100", rodar() {
    // base: 4 semanas com 1 treino de carga 150 por semana; recente igual -> razão 1 -> 50
    const base = ["2026-10-28", "2026-11-04", "2026-11-11", "2026-10-21"].map((d) => tr(d));
    igual(calcularFadiga([...base, tr("2026-11-21")], hoje), 50);
    // pico: 4 treinos na semana -> razão 4 -> 100
    const pico = [tr("2026-11-17"), tr("2026-11-19"), tr("2026-11-21"), tr("2026-11-23")];
    igual(calcularFadiga([...base, ...pico], hoje), 100);
    // semana parada -> 0
    igual(calcularFadiga(base, hoje), 0);
    igual(cargaDaSemana([...base, ...pico], hoje), 600);
  } },
  { nome: "treinoDoDia: treino, descanso e caminhada leve", rodar() {
    const ok = { respondido: true, temRisco: false, liberadoMedico: false };
    igual(treinoDoDia([1, 3, 5], "2026-11-23", ok), "treino"); // segunda
    igual(treinoDoDia([1, 3, 5], "2026-11-24", ok), "descanso"); // terça
    igual(treinoDoDia([1, 3, 5], "2026-11-23", { ...ok, temRisco: true }), "caminhadaLeve");
    igual(treinoDoDia([1, 3, 5], "2026-11-24", { ...ok, temRisco: true }), "caminhadaLeve");
    igual(treinoDoDia([1, 3, 5], "2026-11-23", { ...ok, temRisco: true, liberadoMedico: true }), "treino");
    igual(diasTreinoEfetivos([]).join(","), "1,3,5");
  } },
  { nome: "Checagem de Segurança: qualquer SIM é risco", rodar() {
    igual(avaliarParq([false, false, false, false, false, false, false]).temRisco, false);
    igual(avaliarParq([false, false, true, false, false, false, false]).temRisco, true);
  } },
  { nome: "faltouTreinoPlanejado: só em dia planejado sem treino nem descanso", rodar() {
    igual(faltouTreinoPlanejado("2026-11-23", [1, 3, 5], [], false), true);
    igual(faltouTreinoPlanejado("2026-11-23", [1, 3, 5], [{}], false), false);
    igual(faltouTreinoPlanejado("2026-11-23", [1, 3, 5], [], true), false);
    igual(faltouTreinoPlanejado("2026-11-24", [1, 3, 5], [], false), false); // terça não era dia de treino
  } },
];
