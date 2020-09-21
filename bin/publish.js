#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

// Usage: node publish [root dir] [bucket name]

const root = path.resolve(process.cwd(), process.argv[2]);

const trimPath = (prefix, str) => {
  let i = 0;
  if (prefix.length >= str.length) return "";
  else {
    while (i < prefix.length && prefix[i] === str[i]) i += 1;
  }
  return str.substring(i);
}

const walkDir = (dir, fn) => {
  try {
    let entries = fs.readdirSync(dir);
    entries.forEach((entry) => {
      fn(path.resolve(process.cwd(), dir, entry));
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

// Walk through all files in a directory and upload each to the specified bucket
const publish = (entry) => {
  if (fs.statSync(entry).isDirectory()) {
    walkDir(entry, publish);
  } else {
    // Upload file
    let p = path.parse(entry);
    let dir = trimPath(root, p.dir);
    execSync(`gsutil cp ${entry} gs://${process.argv[3]}${dir}/${p.base}`)
  }
}

walkDir(process.argv[2], publish);
