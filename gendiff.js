#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const parseFile = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath);
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  return JSON.parse(fileContent);
};

const genDiff = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));
  const diff = keys.map((key) => {
    if (!Object.prototype.hasOwnProperty.call(data2, key)) {
      return `  - ${key}: ${data1[key]}`;
    }
    if (!Object.prototype.hasOwnProperty.call(data1, key)) {
      return `  + ${key}: ${data2[key]}`;
    }
    if (data1[key] !== data2[key]) {
      return `  - ${key}: ${data1[key]}\n  + ${key}: ${data2[key]}`;
    }
    return `    ${key}: ${data1[key]}`;
  });
  return `{\n${diff.join('\n')}\n}`;
};

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .argument('<filepath1>', 'path to first configuration file')
  .argument('<filepath2>', 'path to second configuration file')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    const data1 = parseFile(filepath1);
    const data2 = parseFile(filepath2);
    const diff = genDiff(data1, data2);
    console.log(diff);
  })
  .parse(process.argv);
