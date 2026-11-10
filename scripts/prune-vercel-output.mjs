import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";

const output = new URL("../dist/", import.meta.url);

// Git builds can include tracked originals. Remove them from the generated
// output before Vercel publishes it. The repository copies remain available.
await rm(new URL("downloads/bassh/", output), { recursive: true, force: true });

for (const directory of ["cv/", "history/"]) {
  const entries = await readdir(new URL(directory, output), { recursive: true, withFileTypes: true });
  const wordFiles = entries.filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith(".docx"));
  await Promise.all(wordFiles.map(entry => rm(join(entry.parentPath, entry.name))));
}
