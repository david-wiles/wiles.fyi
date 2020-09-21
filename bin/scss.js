#!/usr/bin/env node
const {Command} = require("commander");
const sass = require("node-sass");
const path = require("path");
const fs = require("fs");

// usage: node bin/scss.js [array of files] [output dir] -w

const main = (program) => {
  program.files.forEach((file) => {
    build(file, program.output);
  });

  if (program.watch) {
    watch(program.files, program.output, program.watch);
  }
};

const build = (file, out) => {
  console.log(`\x1b[32m\tBuilding file ${file}...\x1b[0m`)
  sass.render({
    file: path.resolve(process.cwd(), file)
  }, (err, res) => {
    if (err) console.error(err);
    else {
      fs.mkdirSync(out, { recursive: true });
      fs.writeFile(
        path.resolve(process.cwd(), out, `${path.parse(file).name}.css`),
        res.css,
        (err) => {
          if (err) console.error(err);
          else console.log(`\x1b[32m\tBuilt file at ${out}\x1b[0m`)
        });
    }
  });
};

const watch = (files, out, watch) => {
  fs.watch(path.resolve(process.cwd(), watch), { persistent: true, recursive: true }, () => {
    files.forEach((file) => {
      build(file, out);
    });
  });
};

const program = new Command();
program
  .option("-f, --files [string...]", "Input files")
  .option("-o, --output [string]", "Output directory")
  .option("-w, --watch <string>", "Indicates whether to watch files, and which directory to watch.");

program.parse(process.argv);

main(program);
