import { env } from "bun";
import { getKnowledge } from "@/data/knowledge-fetcher";

export default async function sitemap() {
  const knowledge = await getKnowledge();

  return [{
    url: process.env.URL,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 1
  }].concat(knowledge.map(({ data }) => ({
    url: `${env.URL}/knowledge/${data.subject}`,
    lastModified: new Date(data.date),
    changeFrequency: "yearly",
    priority: 1
  })));
}
