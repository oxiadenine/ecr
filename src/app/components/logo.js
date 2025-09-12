import Link from "next/link";
import Image from "next/image";
import { monoton } from "@/app/fonts";
import logo from "@/app/images/ecr-logo.png";
import styles from "@/app/components/logo.module.css";

export default function Logo() {
  return (
    <div className={styles["logo"]}>
      <Link href="/">
        <Image src={logo} alt="logo" />
        <h3 className={monoton.variable}>El Chanchito Rey</h3>
      </Link>
    </div>
  );
}
