import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LotoPredictor = () => {
  const [frequencies, setFrequencies] = useState<Record<number, number>>({});
  const [combinaison, setCombinaison] = useState<number[]>([]);
  const [numeroChance, setNumeroChance] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://media.fdj.fr/static/draws/loto.csv")
      .then((response) => response.text())
      .then((csv) => {
        const rows = csv.split("\n").slice(1);
        const allNumbers: number[] = [];

        rows.forEach((row) => {
          const cols = row.split(";");
          for (let i = 1; i <= 5; i++) {
            const num = parseInt(cols[i]);
            if (!isNaN(num)) allNumbers.push(num);
          }
        });

        const freq: Record<number, number> = {};
        allNumbers.forEach((num) => {
          freq[num] = (freq[num] || 0) + 1;
        });
        setFrequencies(freq);
      });
  }, []);

  const genererCombinaison = () => {
    const nums = Object.keys(frequencies).map(Number);
    const tirage = nums.sort(() => 0.5 - Math.random()).slice(0, 5).sort((a, b) => a - b);
    const chance = Math.floor(Math.random() * 10) + 1;
    setCombinaison(tirage);
    setNumeroChance(chance);
  };

  const chartData = {
    labels: Object.keys(frequencies).map(String),
    datasets: [
      {
        label: "Fréquence des numéros",
        data: Object.values(frequencies),
      },
    ],
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>🎯 Générateur de Loto</h1>

      <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
        <button onClick={genererCombinaison} style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}>
          Générer une combinaison
        </button>

        {combinaison.length > 0 && (
          <p style={{ textAlign: "center", marginTop: "1rem", fontWeight: "bold" }}>
            ✅ {combinaison.join(" - ")} + Chance : {numeroChance}
          </p>
        )}
      </div>

      {Object.keys(frequencies).length > 0 && (
        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
};

export default LotoPredictor;
