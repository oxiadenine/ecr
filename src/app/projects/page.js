import { env } from "bun";
import { Suspense } from "react";
import { getProjects } from "@/data/project-fetcher";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import styles from "@/app/projects/page.module.css";

export async function generateMetadata() {
  const url = env.URL;
  const siteName = env.SITE_NAME;
  
  const title = `${siteName} | Proyectos`;
  const description = `Proyectos hechos por ${siteName}.`;

  const projects = await getProjects();

  const tags = projects.flatMap(({ data }) => [data.name, ...data.tags.split(",")]);
  const images = projects.flatMap(({ data }) => data.images.map(image => ({
    url: `${url}${image.src}`, alt: image.alt
  })));

  return {
    title,
    description,
    keywords: ["proyectos", ...tags],
    openGraph: {
      title,
      description,
      url: `${url}/projects`,
      siteName,
      images,
      locale: "es_ES",
      type: "website"
    }
  };
}

export default async function Page() {
  const projects = await getProjects();

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <div>
        <main>
          <div className={styles["page"]}>
            {projects.map((project, index) => {
              const { component: Project } = project;

              return (
                <>
                  <div key={project.data.name}>
                    <Project />
                  </div>
                  {index < projects.length - 1 && <span key={index} />}
                </>
              );
            })}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
