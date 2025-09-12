"use client";

import { useState, useEffect } from "react";

export default function useAnalytics(onFlush) {
  const [analytics, setAnalytics] = useState(new Map());

  function addToQueue(key, data) {
    setAnalytics(prevAnalytics => {
      const queue = prevAnalytics.get(key);

      if (queue) {
        const remainingAnalytics = [...prevAnalytics].filter(entry => entry[0] != key);

        return new Map([...remainingAnalytics, [key, new Set([...queue, data])]]);
      } else {
        return new Map([...prevAnalytics, [key, new Set([data])]]);
      }
    });
  }

  function flushAnalytics() {
    if (analytics.size > 0) {
      onFlush(analytics);
  
      setAnalytics(new Map());
    }
  }

  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        flushAnalytics();
      }
    }

    window.addEventListener("visibilitychange", onVisibilityChange);

    return () => window.removeEventListener("visibilitychange", onVisibilityChange);
  }, [flushAnalytics]);

  return [addToQueue];
}
