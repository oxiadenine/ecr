import { SQL, sql } from "bun";

export default class AnalyticsDatabase {
  static client = new SQL({
    adapter: "sqlite",
    filename: `${process.cwd()}/data/db/analytics.sqlite`,
    create: true,
    strict: true
  });

  static {
    this.client.begin(async transaction => {
      await transaction`
        CREATE TABLE IF NOT EXISTS pageViews (
          id TEXT NOT NULL PRIMARY KEY, 
          ip TEXT NOT NULL, 
          path TEXT NOT NULL, 
          date TEXT NOT NULL
        )
      `;
      await transaction`
        CREATE TABLE IF NOT EXISTS performanceMetrics (
          id TEXT NOT NULL PRIMARY KEY, 
          path TEXT NOT NULL, 
          name TEXT NOT NULL, 
          rating TEXT NOT NULL, 
          value INTEGER NOT NULL, 
          delta INTEGER NOT NULL, 
          navigationType TEXT NOT NULL
        )
      `;
    });
  }

  static pageViews = class PageViews {
    static async create(pageView) {
      await AnalyticsDatabase.client`INSERT INTO pageViews ${sql(pageView)}`;
    }

    static async readByDate(lastDays) {
      const partial = sql`
        CASE 
          WHEN path LIKE '%knowledge%' THEN substr(path, 1, length('knowledge') + 1) 
          ELSE path 
        END
      `;

      if (lastDays === 1) {
        return await AnalyticsDatabase.client`
          SELECT ${partial} AS path, strftime('%H', date) AS hour, COUNT(*) AS views 
          FROM pageViews 
          WHERE date > datetime('now', '-1 days', 'subsec') 
          GROUP BY ${partial}, strftime('%H', date) 
          ORDER BY ${partial}, strftime('%H:%M', date)
        `;
      } else if (lastDays === 7) {
        return await AnalyticsDatabase.client`
          SELECT ${partial} AS path, strftime('%u', date) AS weekday, COUNT(*) AS views 
          FROM pageViews 
          WHERE date > datetime('now', '-7 days', 'subsec') 
          GROUP BY ${partial}, strftime('%u', date) 
          ORDER BY ${partial}, strftime('%u', date)
        `;
      } else if (lastDays === 30) {
        return await AnalyticsDatabase.client`
          SELECT ${partial} AS path, strftime('%d', date) AS day, COUNT(*) AS views 
          FROM pageViews 
          WHERE date > datetime('now', '-30 days', 'subsec') 
          GROUP BY ${partial}, strftime('%d', date) 
          ORDER BY ${partial}, strftime('%d', date)
        `;
      } else if (lastDays === 365) {
        return await AnalyticsDatabase.client`
          SELECT ${partial} AS path, strftime('%m', date) AS month, COUNT(*) AS views 
          FROM pageViews 
          WHERE date > datetime('now', '-365 days', 'subsec') 
          GROUP BY ${partial}, strftime('%m', date) 
          ORDER BY ${partial}, strftime('%m', date)
        `;
      }
    }
  };

  static performanceMetrics = class PerformanceMetrics {
    static async create(performanceMetric) {
      await AnalyticsDatabase.client`INSERT INTO performanceMetrics ${sql(performanceMetric)}`;
    }

    static async readByRating(name) {
      const partial = sql`
        CASE 
          WHEN path LIKE '%knowledge%' THEN substr(path, 1, length('knowledge') + 1) 
          ELSE path 
        END
      `;

      return await AnalyticsDatabase.client`
        SELECT ${partial} path, rating, SUM(delta) AS value FROM performanceMetrics 
        WHERE name = ${name} 
        GROUP BY substr(id, 0, instr(id, '-')), ${partial}, rating 
        ORDER BY ${partial}, rating
      `;
    }
  };
}
