/*
 * This file takes html files in a given directory and searches for <link> and <script> tags to replace
 * the tag with inline css and js. This will only be done for css and javascript without the 'defer' attribute
 */

// node inline.js <dir>

const fs = require("fs");
const path = require("path");

// Cache of files so we don't have to read a file more than once
let cache = {};

/**
 * Get a list of links in a given html string.
 * link: {
 *   tag: string - the html tag which matches this file,
 *   file: string - the path to the file to replace this tag with,
 *   type: string - js or css. Used to determine correct replacement tag
 * }
 * @param html
 * @returns {[ link ]}
 */
const findLinks = (html) => {
  let links = [];

  let scripts = html.matchAll(/<script\s+(defer){0}\s*src="([a-zA-Z0-9-\/]+\.js)"\s*(defer){0}\s*><\/script>/gm);
  let result = scripts.next();

  while (!result.done) {
    links.push({
      tag: result.value[0],
      file: result.value[2], // why does this need to be 2?
      type: "js"
    });
    result = scripts.next();
  }

  let stylesheets = html.matchAll(/<link\s+rel="stylesheet"\s+href="([a-zA-Z0-9-\/]+\.css)"\s*\/>/gm);
  result = stylesheets.next();

  while (!result.done) {
    links.push({
      tag: result.value[0],
      file: result.value[1],
      type: "css"
    });
    result = stylesheets.next();
  }

  return links;
};

/**
 * Replaces the script and link tags in an html file with the link's text
 * @param dir
 * @param file
 * @returns {Promise<void>}
 */
const replaceText = (dir, file) => {
  let html = fs.readFileSync(file).toString();
  let links = findLinks(html);
  console.log("\x1b[32m", "Inlining css and js for " + file, "\x1b[0m")
  links.forEach((link) => {
    if (cache[link.file] === undefined) {
      cache[link.file] = link.type === "js" ?
        "<script>" + fs.readFileSync(dir + link.file).toString() + "</script>" :
        "<style>" + fs.readFileSync(dir + link.file).toString() + "</style>";
    }
    html = html.replace(link.tag, cache[link.file]);
  });
  fs.writeFileSync(file, html);
};

const modifyFiles = (dir) => {
  let files = fs.readdirSync(dir);
  files.forEach((file) => {
    let directory = path.resolve(process.cwd(), dir);
    let filename = path.resolve(directory, file);
    if (fs.statSync(filename).isDirectory()) {
      modifyFiles(filename);
    } else {
      let fileInfo = path.parse(filename);
      if (fileInfo.ext === ".html") {
        replaceText(directory, filename);
      }
    }
  });
};

(() => {
  modifyFiles(process.argv[2]);
  console.log("Finished inlining css and js files");
})();
