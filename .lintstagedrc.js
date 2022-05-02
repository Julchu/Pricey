const path = require('path');

const buildEslintCommand = filenames =>
  `next lint --fix --file ${filenames.map(f => path.relative(process.cwd(), f)).join(' --file ')}`;

const buildTypeCheckCommand = filenames => {
  // Index 0 should be .lintstagedrc.js which we want to skip
  return `tsc-files --noEmit ${filenames
    .map((f, index) => path.relative(process.cwd(), f))
    .join(' ')}`;
};

module.exports = {
  '**/*.{js,jsx,ts,tsx}?(x)': [buildEslintCommand, buildTypeCheckCommand],
};
