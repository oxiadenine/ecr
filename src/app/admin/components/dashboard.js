"use client";

import { useState } from "react";
import Navbar from "@/app/admin/components/navbar";
import PageViewsCharts from "@/app/admin/components/page-views-charts";
import PerformanceMetricsCharts from "@/app/admin/components/performance-metrics-charts";
import styles from "@/app/admin/components/dashboard.module.css";

export default function Dashboard() {
  const [menuItem, setMenuItem] = useState("page-views");

  function onMenuItemClick(event) {
    setMenuItem(event.target.name);
  }

  return (
    <div className={styles["dashboard"]}>
      <Navbar menuItem={menuItem} onMenuItemClick={onMenuItemClick} />
      <section>
        {menuItem === "page-views" && (
          <>
            <header>
              <h2>Visitas</h2>
            </header>
            <PageViewsCharts />
          </>
        )}
        {menuItem === "performance-metrics" && (
          <>
            <header>
              <h2>Rendimiento</h2>
            </header>
            <PerformanceMetricsCharts />
          </>
        )}
      </section>
    </div>
  );
}
