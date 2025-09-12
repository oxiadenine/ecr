import { file } from "bun";
import path from "node:path";
import { compile, run } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import * as runtime from "react/jsx-runtime";
import { fromMarkdown } from "mdast-util-from-markdown";
import { mdxFromMarkdown } from "mdast-util-mdx";
import { frontmatterFromMarkdown } from "mdast-util-frontmatter";
import { frontmatter } from "micromark-extension-frontmatter";
import { toHast } from "mdast-util-to-hast";
import { select, selectAll } from "hast-util-select";
import walkFiles from "@/lib/walk-files";

const directoryPath = `${process.cwd()}/data/knowledge`;

export async function getKnowledge() {
  return await Promise.all((await walkFiles(directoryPath))
    .filter(parsedPath => parsedPath.ext === ".mdx")
    .map(async parsedPath => {
      const bytes = await file(path.join(parsedPath.dir, parsedPath.base)).bytes();

      const knowledge = await run(await compile(bytes, {
        outputFormat: "function-body",
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter]
      }), { ...runtime, baseUrl: import.meta.url });

      knowledge.frontmatter.subject = parsedPath.name;
      
      const knowledgeContent = toHast(fromMarkdown(bytes, {
        extensions: [frontmatter()],
        mdastExtensions: [mdxFromMarkdown(), frontmatterFromMarkdown()]
      }));

      knowledge.frontmatter.title = select("h1", knowledgeContent).children[0].value;
      knowledge.frontmatter.summary = select("p", knowledgeContent).children[0].value;
      knowledge.frontmatter.images = selectAll("img", knowledgeContent).map(element => ({ 
        src: element.properties.src, alt: element.properties.alt 
      }));

      return { component: knowledge.default, data: knowledge.frontmatter };
    }));
}

export async function getKnowledgeBy(subjectTerm) {
  return (await getKnowledge()).filter(({ data }) => {
    const title = data.title.toLowerCase().replace(" ", "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const titleTerm = subjectTerm.toLowerCase().replace(" ", "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return title.includes(titleTerm);
  });
}

export async function getKnowledgeOf(subject) {
  return (await getKnowledge()).find(({ data }) => data.subject === subject);
}
