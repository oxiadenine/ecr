"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/lib/components/button";
import Icon from "@/lib/components/icon";
import styles from "@/app/components/knowledge-card.module.css";

export default function KnowledgeCard({ data }) {
  const hasClipboard = navigator.clipboard ?? false;
  const [urlCopied, setUrlCopied] = useState(false);

  function onShareIconClick() {
    if (hasClipboard) {
      navigator.clipboard.writeText(`${location.href}knowledge/${data.subject}`)
        .then(() => setUrlCopied(true));
    }
  };

  useEffect(() => {
    if (urlCopied) {
      setTimeout(() => setUrlCopied(false), 1000);
    }
  }, [urlCopied]);

  return (
    <div className={styles["knowledge-card"]}>
      {urlCopied && <span>Copiado</span>}
      {hasClipboard && (
        <Button onClick={onShareIconClick}>
          <Icon type="solid" name="share-nodes" />
        </Button>
      )}
      <h3>{data.title}</h3>
      <Link href={`/knowledge/${data.subject}`}>
        <p>{data.summary}</p>
      </Link>
      <div>
        <span>✘ {data.author}</span>
        <span>{data.date}</span>
      </div>
    </div>
  );
}
