"use server";

import AnalyticsDatabase from "@/data/analytics-db";

export async function getPerformanceMetricsByRating() {
  const performanceMetricsMap = new Map([
    ["Tiempo hasta el primer byte", await AnalyticsDatabase.performanceMetrics.readByRating("TTFB")],
    ["Primer procesamiento de imagen con contenido", await AnalyticsDatabase.performanceMetrics.readByRating("FCP")],
    ["Procesamiento de imagen con contenido más grande", await AnalyticsDatabase.performanceMetrics.readByRating("LCP")],
    ["Cambio de diseño acumulado", await AnalyticsDatabase.performanceMetrics.readByRating("CLS")],
    ["Interacción a la siguiente pintura", await AnalyticsDatabase.performanceMetrics.readByRating("INP")]
  ]);

  const labels = new Map([
    ["good", "Bueno"],
    ["needs-improvement", "Mejorable"],
    ["poor", "Malo"]
  ]);
  
  const data = new Map();
  
  [...performanceMetricsMap].forEach(([name, performanceMetrics]) => {
    const datasets = new Map();

    performanceMetrics.forEach(performanceMetric => {
      const { path, rating, value } = performanceMetric;
      const dataIndex = [...labels.keys()].findIndex(key => key == rating);
    
      const dataset = datasets.get(path);
    
      if (dataset) dataset[dataIndex] = { x: dataIndex, y: value };
      else {
        const data = [...Array(3).keys()].map(key => ({ x: key, y: 0 }));
        data[dataIndex] = { x: dataIndex, y: value };
    
        datasets.set(path, data);
      }
    });

    data.set(name, {
      labels: [...labels.values()],
      datasets: [...datasets].map(([label, data]) => ({ label, data }))
    });
  });
  
  return [...data];
}
