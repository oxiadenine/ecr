"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logError from "@/data/log-error-action";
import logo from "@/app/images/ecr-logo.png";
import styles from "@/app/error.module.css";
 
export default function Error({ error }) {
  useEffect(() => {
    async function reportError() {
      await logError({
        digest: error.digest,
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    reportError();
  }, [error]);

  return (
    <div className={styles["error"]}>
      <h1>Oh no...</h1>
      <p>Algo extraño ha ocurrido tras querer saber mas de la cuenta</p>
      <Link href="/">
        <Image src={logo} alt="logo" />
      </Link>
      <span>Haz click en la imágen para volver a la página de inicio</span>
    </div>
  );
}
