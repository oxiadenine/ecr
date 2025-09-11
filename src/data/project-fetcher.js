import { file } from "bun";
import path from "node:path";
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
      const relativeFilePath = path.join(
        parsedPath.dir.replace(directoryPath, "/"), 
        parsedPath.base
      ).substring(1);
      
      const project = await import(`@/projects/${relativeFilePath}`);

      project.frontmatter.name = parsedPath.name;

      const projectContent = toHast(fromMarkdown(
        await file(path.join(parsedPath.dir, parsedPath.base)).bytes(), {
          extensions: [frontmatter()],
          mdastExtensions: [mdxFromMarkdown(), frontmatterFromMarkdown()]
        }
      ));

      project.frontmatter.images = selectAll("img", projectContent).map(element => ({ 
        src: element.properties.src, alt: element.properties.alt 
      }));

      return { component: project.default, data: project.frontmatter };
    }));
}
