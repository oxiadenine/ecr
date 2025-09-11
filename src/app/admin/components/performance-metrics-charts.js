"use client";

import { useState, useEffect } from "react";
import { Chart, BarElement, CategoryScale, LinearScale, Title, Legend, Tooltip, Colors } from "chart.js";
import { Bar } from "react-chartjs-2";
import { getPerformanceMetricsByRating } from "@/app/admin/components/performance-metrics-charts-actions";
import styles from "@/app/admin/components/performance-metrics-charts.module.css";

Chart.register(BarElement, CategoryScale, LinearScale, Title, Legend, Tooltip, Colors);

Chart.defaults.maintainAspectRatio = false;
Chart.defaults.color = "rgb(250, 213, 165)";
Chart.defaults.font.family = "Orbitron";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.title.display = true;
Chart.defaults.plugins.title.font.size = 16;
Chart.defaults.plugins.tooltip.titleColor = "rgb(250, 213, 165)";
Chart.defaults.plugins.tooltip.bodyColor = "rgb(250, 213, 165)";
Chart.defaults.plugins.tooltip.backgroundColor = "rgb(40, 40, 43)";

export default function PageViewsCharts() {
  const [performanceMetricsByRating, setPerformanceMetricsByRating] = useState(null);

  useEffect(() => {
    async function getPerformanceMetrics() {
      if (!performanceMetricsByRating) {
        setPerformanceMetricsByRating(await getPerformanceMetricsByRating());
      }
    };
 
    getPerformanceMetrics();
  }, []);

  return (
    <div className={styles["performance-metrics-charts"]}>
      {performanceMetricsByRating && performanceMetricsByRating
        .map(([title, data], index) => (
          <div key={index}>
            <Bar
              data={data}
              options={{
                parsing: false,
                normalized: true,
                scales: {
                  x: { stacked: true },
                  y: {
                    stacked: true,
                    ticks: { stepSize: 1 }
                  }
                },
                plugins: {
                  title: { text: title }
                }
              }}
            />
          </div>
        )
      )}
    </div>
  );
}
