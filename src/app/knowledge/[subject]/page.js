import { env } from "bun";
import { notFound } from "next/navigation";
import { getKnowledgeOf } from "@/data/knowledge-fetcher";
import Analytics from "@/app/components/analytics";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import styles from "@/app/knowledge/[subject]/page.module.css";

export async function generateMetadata({ params }) {
  const url = env.URL;
  const siteName = env.SITE_NAME;

  const subject = (await params).subject;

  const data = (await getKnowledgeOf(subject))?.data ?? null;

  const title = `${siteName} | ${data.title}`;
  const tags = data.tags?.split(",") ?? [];

  return data ? {
    title,
    description: data.summary,
    keywords: tags,
    authors: [{ name: data.author }],
    openGraph: {
      title,
      description: data.summary,
      url: `${url}/knowledge/${data.subject}`,
      siteName,
      images: data.images.map(image => ({
        url: `${url}${image.src}`, alt: image.alt
      })),
      locale: "es_ES",
      type: "article",
      publishedTime: new Date(data.date).toISOString(),
      authors: [data.author],
      tags
    }
  } : null;
}

export default async function Page({ params }) {
  const isAnalyticsEnabled = !!+env.ANALYTICS_ENABLE ?? false;

  const subject = (await params).subject;

  const { component: Knowledge } = await getKnowledgeOf(subject) ?? notFound();

  return (
    <>
      {isAnalyticsEnabled && <Analytics />}
      <Header />
      <div>
        <main>
          <div className={styles["page"]}>
            <Knowledge />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
