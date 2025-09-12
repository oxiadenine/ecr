import { env } from "bun";
import { Suspense } from "react";
import { getProjects } from "@/data/project-fetcher";
import Analytics from "@/app/components/analytics";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import styles from "@/app/projects/page.module.css";

export async function generateMetadata() {
  const url = env.URL;
  const siteName = env.SITE_NAME;
  
  const title = `${siteName} | Proyectos`;
  const description = `Proyectos hechos por ${siteName}.`;

  const projects = await getProjects();

  const tags = projects.flatMap(project => [project.name, ...project.tags.split(",")]);
  const images = projects.flatMap(project => project.images.map(image => ({
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
  const isAnalyticsEnabled = !!+env.ANALYTICS_ENABLE ?? false;

  const projects = await getProjects();

  return (
    <>
      {isAnalyticsEnabled && <Analytics />}
      <Suspense>
        <Header />
      </Suspense>
      <div>
        <main>
          <div className={styles["page"]}>
            {projects.map((project, index) => {
              const { default: Project } = project;

              return (
                <>
                  <div key={project.key}>
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
