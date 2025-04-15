import fs from "node:fs/promises";
import path from "node:path";

export default async function walkFiles(dirPath) {
  const filePaths = await Promise.all((await fs.readdir(dirPath))
    .map(async filename => {
      const filePath = path.join(dirPath, filename);
      const fileStat = await Bun.file(filePath).stat();

      if (fileStat.isDirectory()) return walkFiles(filePath);
      else if (fileStat.isFile()) return path.parse(filePath);
    }));
    
    return filePaths.reduce((all, dirFilePath) => all.concat(dirFilePath), []);
}
