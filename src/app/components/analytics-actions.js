"use server";

import { randomUUIDv7 } from "bun";
import { headers } from "next/headers";
import clientIp from "@/lib/client-ip";
import AnalyticsDatabase from "@/data/analytics-db";

export async function storePageViews(pageViews) {
  const ip = clientIp(await headers()) ?? "";

  pageViews.forEach(async pageView => {
    const { date, ...rest } = pageView;

    await AnalyticsDatabase.pageViews.create({
      id: randomUUIDv7(),
      ip,
      date: date.toISOString(),
      ...rest
    });
  });
}

export async function storePerformanceMetrics(performanceMetrics) {
  performanceMetrics.forEach(async performanceMetric => {
    const { id, value, delta, ...rest } = performanceMetric;

    await AnalyticsDatabase.performanceMetrics.create({
      id: id.substring(id.indexOf("-") + 1),
      value: Math.round(value),
      delta: Math.round(delta),
      ...rest
    });
  });
}
