import { extname, join } from "node:path";
import { readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = join(fileURLToPath(import.meta.url), "..");

let blogFiles = [];

const MD_EXTNAME = ".md";

const resolve = (dir) => join(__dirname, "..", dir);

try {
  const files = await readdir(resolve("/blog/_posts"));
  for (const file of files) {
    if (extname(file) === MD_EXTNAME) {
      blogFiles.push(file);
    }
  }
} catch (err) {
  console.error("failed to read _posts dir", err);
}

function convertBlogFilesMap(files) {
  return files
    .reduce((acc, cur) => {
      let date = cur.slice(0, 10).split("-").join("/");

      let blogName = cur.slice(11, cur.length - 3);
      acc.push({ date, blogName });
      return acc;
    }, [])
    .reverse();
}

function blogToReadme(files) {
  return convertBlogFilesMap(files)
    .map(({ date, blogName }) => {
      return `- [${blogName}](https://www.qinghuani.fun/${date}/${encodeURI(blogName)}) — ${date}\n`;
    })
    .join("");
}

async function writeBlogToReadme(files) {
  try {
    await writeFile(resolve("README.md"), blogToReadme(files));
  } catch (e) {
    console.error("failed to write blogs to readme.md", e);
  }
}

void writeBlogToReadme(blogFiles);
