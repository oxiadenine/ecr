"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { onLCP, onCLS, onINP, onFCP, onTTFB } from "next/dist/compiled/web-vitals";
import useAnalytics from "@/lib/use-analytics";
import { storePageViews, storePerformanceMetrics } from "@/app/components/analytics-actions";

export default function Analytics() {
  const pathname = usePathname();

  const [addToQueue] = useAnalytics(async (analytics) => {
    await storePageViews(analytics.get("page-views"));
    await storePerformanceMetrics(analytics.get("performance-metrics"));
  });

  useEffect(() => {
    function addPageView() {
      addToQueue("page-views", { path: pathname, date: new Date() });
    }

    function addPerformanceMetric(metric) {
      const { entries: _, ...rest } = metric;
        
      addToQueue("performance-metrics", { path: pathname, ...rest });
    }

    if (!pathname.startsWith("/admin")) {
      addPageView();

      onCLS(addPerformanceMetric);
      onLCP(addPerformanceMetric);
      onINP(addPerformanceMetric);
      onFCP(addPerformanceMetric);
      onTTFB(addPerformanceMetric);
    }
  }, [pathname]);
}
