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
import { selectAll } from "hast-util-select";
import walkFiles from "@/lib/walk-files";

const directoryPath = `${process.cwd()}/data/projects`;

export async function getProjects() {
  return await Promise.all((await walkFiles(directoryPath))
    .filter(parsedPath => parsedPath.ext === ".mdx")
    .map(async parsedPath => {
      const bytes = await file(path.join(parsedPath.dir, parsedPath.base)).bytes();

      const project = await run(await compile(bytes, {
        outputFormat: "function-body",
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter]
      }), { ...runtime, baseUrl: import.meta.url });

      const projectContent = toHast(fromMarkdown(bytes, {
        extensions: [frontmatter()],
        mdastExtensions: [mdxFromMarkdown(), frontmatterFromMarkdown()]
      }));

      project.key = project.name.replace(" ", "-").toLowerCase();
      project.images = selectAll("img", projectContent).map(element => ({ 
        src: element.properties.src, alt: element.properties.alt 
      }));

      return project;
    }));
}
