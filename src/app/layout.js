import { env } from "bun";
import { orbitron } from "@/app/fonts";
import Analytics from "@/app/components/analytics";
import "@/app/styles.css";
import styles from "@/app/layout.module.css";

export default function Layout({ children }) {
  const isAnalyticsEnabled = !!+env.ANALYTICS_ENABLE ?? false;

  return (
    <html lang="es" className={orbitron.variable}>
      <body>
        {isAnalyticsEnabled && <Analytics />}
        <div className={styles["layout"]}>
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
