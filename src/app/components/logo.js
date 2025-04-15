import Link from "next/link";
import { monoton } from "@/app/fonts";
import styles from "@/app/components/logo.module.css";

export default function Logo() {
  return (
    <div className={styles["logo"]}>
      <Link href="/">
        <img src="/images/ecr-logo.png" alt="logo" />
        <h3 className={monoton.variable}>El Chanchito Rey</h3>
      </Link>
    </div>
  );
}
