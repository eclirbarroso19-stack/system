// Radar das 7 áreas (Chart.js local, carregado só quando preciso).
import { AREAS } from "./nucleo/regras.js";
import { el } from "./ui.js";

export const ROTULOS_AREA = {
  financas: "Finanças", corpo: "Corpo", mente: "Mente", gestao: "Gestão",
  profissional: "Profis.", relacionamentos: "Relac.", espiritualidade: "Espírito",
};

let _carregando = null;
function carregarChart() {
  if (window.Chart) return Promise.resolve();
  if (_carregando) return _carregando;
  _carregando = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "./lib/chart.umd.min.js";
    s.onload = () => resolve();
    s.onerror = () => { _carregando = null; reject(new Error("Chart.js não carregou")); };
    document.head.append(s);
  });
  return _carregando;
}

// notas: { area: 0-100 } (faltando = 0). Devolve o elemento que contém o gráfico.
export function radar(notas) {
  const caixa = el("div", { class: "radar" });
  const canvas = el("canvas", { "aria-label": "Radar das 7 áreas" });
  caixa.append(canvas);
  carregarChart().then(() => {
    const css = getComputedStyle(document.documentElement);
    const azul = css.getPropertyValue("--azul").trim() || "#00D4FF";
    const roxo = css.getPropertyValue("--roxo").trim() || "#7B2FF7";
    const texto2 = css.getPropertyValue("--texto2").trim() || "#8A9BB0";
    new window.Chart(canvas, {
      type: "radar",
      data: {
        labels: AREAS.map((a) => ROTULOS_AREA[a]),
        datasets: [{
          data: AREAS.map((a) => notas[a] ?? 0),
          borderColor: azul, borderWidth: 2,
          backgroundColor: roxo + "66",
          pointBackgroundColor: azul, pointRadius: 3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? false : { duration: 600 },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          r: {
            min: 0, max: 100,
            ticks: { display: false, stepSize: 25 },
            grid: { color: "#2a2a44" },
            angleLines: { color: "#2a2a44" },
            pointLabels: { color: texto2, font: { family: "Rajdhani", size: 13, weight: "700" } },
          },
        },
      },
    });
  }).catch((e) => { console.error(e); caixa.textContent = "[RADAR INDISPONÍVEL]"; });
  return caixa;
}
