import { env } from "bun";
import { getKnowledgeBy } from "@/data/knowledge-fetcher";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import KnowledgeCard from "@/app/components/knowledge-card";
import styles from "@/app/page.module.css";

export async function generateMetadata() {
  const url = env.URL;
  const siteName = env.SITE_NAME;
  
  const title = siteName;
  const description = `${title} y el conocimiento.`;

  return {
    title,
    description,
    keywords: ["chanchito", "rey"],
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [{ url: `${url}/images/ecr-logo.png`, alt: "ecr logo" }],
      locale: "es_ES",
      type: "website"
    }
  };
}

export default async function Page(props) {
  const searchParams = await props.searchParams;
  const searchTerm = searchParams?.s || "";

  const knowledge = await getKnowledgeBy(searchTerm);

  return (
    <>
      <Header />
      <div>
        <main>
          <div className={styles["page"]}>
            {knowledge.map(({ data }) => (
              <article key={data.subject}>
                <KnowledgeCard data={data} />
              </article>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
