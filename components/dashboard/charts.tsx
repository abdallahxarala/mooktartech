"use client";

import { Card } from "@/components/ui/card";
import {
  Line,
  Bar,
  Doughnut,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const visitsData = {
  labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  datasets: [
    {
      label: "Visites",
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: "hsl(var(--chart-1))",
      backgroundColor: "hsla(var(--chart-1), 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const scansData = {
  labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  datasets: [
    {
      label: "Scans QR",
      data: [28, 35, 40, 27, 32, 45, 38],
      backgroundColor: "hsla(var(--chart-2), 0.8)",
    },
  ],
};

const sourcesData = {
  labels: ["Direct", "QR Code", "Réseaux", "Email", "Autre"],
  datasets: [
    {
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        "hsla(var(--chart-1), 0.8)",
        "hsla(var(--chart-2), 0.8)",
        "hsla(var(--chart-3), 0.8)",
        "hsla(var(--chart-4), 0.8)",
        "hsla(var(--chart-5), 0.8)",
      ],
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};

export function DashboardCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up">
      <div
        className="lg:col-span-2 animate-fade-in-up"
      >
        <Card className="p-6 animate-fade-in-up">
          <h3 className="font-semibold mb-6 animate-fade-in-up">Visites</h3>
          <div className="h-[300px] animate-fade-in-up">
            <Line data={visitsData} options={options} />
          </div>
        </Card>
      </div>

      <div>
        <Card className="p-6 animate-fade-in-up">
          <h3 className="font-semibold mb-6 animate-fade-in-up">Sources de trafic</h3>
          <div className="h-[300px] animate-fade-in-up">
            <Doughnut data={sourcesData} options={options} />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-3 animate-fade-in-up">
        <Card className="p-6 animate-fade-in-up">
          <h3 className="font-semibold mb-6 animate-fade-in-up">Scans QR par jour</h3>
          <div className="h-[300px] animate-fade-in-up">
            <Bar data={scansData} options={options} />
          </div>
        </Card>
      </div>
    </div>
  );
}
