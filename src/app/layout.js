import { orbitron } from "@/app/fonts";
import { iconsFont } from "@/app/icons/icons";
import geometryBackgroundTile from "@/app/images/geometry-background-tile.png";
import styles from "@/app/layout.module.css";
import "@/app/styles.css";

export default function Layout({ children }) {
  return (
    <html lang="es" className={`${orbitron.variable} ${iconsFont.className}`}>
      <body>
        <div className={styles["layout"]} style={{ 
          backgroundImage: `url("${geometryBackgroundTile.src}")` 
        }}>
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
