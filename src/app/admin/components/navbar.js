"use client";

import Button from "@/lib/components/button";
import Icon from "@/lib/components/icon";
import Logo from "@/app/components/logo";
import SignOutForm from "@/app/admin/login/components/sign-out-form";
import styles from "@/app/admin/components/navbar.module.css";

export default function Navbar({ menuItem, onMenuItemClick }) {
  return (
    <nav>
      <div className={styles["navbar"]}>
        <Logo />
        <div>
          <h3>Analíticas</h3>
          <ul>
            <li style={menuItem === "page-views" ? { color: "var(--color-text-accent)" } : null}>
              <Button
                name="page-views"
                onClick={onMenuItemClick}
                startIcon={<Icon type="solid" name="chart-line" />}
              >
                Visitas
              </Button>
            </li>
            <li style={menuItem === "performance-metrics" ? { color: "var(--color-text-accent)" } : null}>
              <Button
                name="performance-metrics"
                onClick={onMenuItemClick}
                startIcon={<Icon type="solid" name="chart-pie" />}
              >
                Rendimiento
              </Button>
            </li>
          </ul>
        </div>
        <SignOutForm />
      </div>
    </nav>
  );
}
