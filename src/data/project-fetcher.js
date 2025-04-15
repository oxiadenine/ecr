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
    .filter(file => file.ext == ".mdx")
    .map(async file => {
      const relativeFilePath = path.join(
        file.dir.replace(directoryPath, "/"), 
        file.base
      ).substring(1);
      
      const project = await import(`@/projects/${relativeFilePath}`);

      project.frontmatter.name = file.name;

      const projectContent = toHast(fromMarkdown(
        await Bun.file(path.join(file.dir, file.base)).bytes(), {
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
