"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/lib/components/input";
import Button from "@/lib/components/button";
import Icon from "@/lib/components/icon";
import Logo from "@/app/components/logo";
import styles from "@/app/components/header.module.css";

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("s") ?? "");

  function onSearchInputChange(event) {
    setSearchTerm(event.target.value);
  }

  function onClearIconClick() {
    setSearchTerm("");
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (searchTerm.length > 0) params.set("s", searchTerm);
    else params.delete("s");

    router.replace(`${pathname}?${params.toString()}`);
  }, [searchTerm]);

  return (
    <header>
      <div className={styles["header"]}>
        <Logo />
        {pathname == "/" && (
          <div>
            <Link href="/projects">Proyectos</Link>
          </div>
        )}
        {pathname == "/" && (
          <Input
            placeholder="Buscar..."
            onChange={onSearchInputChange}
            value={searchTerm}
            endIcon={searchTerm.length > 0
              ? (
                <Button onClick={onClearIconClick}>
                  <Icon type="solid" name="xmark" />
                </Button>
              )
              : <Icon type="solid" name="magnifying-glass" />}
          />
        )}
      </div>
    </header>
  );
}
