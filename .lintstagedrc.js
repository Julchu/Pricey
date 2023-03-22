const path = require('path');

const buildEslintCommand = filenames =>
  `next lint --fix --file ${filenames.map(f => path.relative(process.cwd(), f)).join(' --file ')}`;

// Working very unintentionally: keeps throwing unrelated Emotion errors
const buildTypeCheckCommand = filenames => {
  return 'tsc --noEmit';

  /*return `tsc-files --noEmit ${filenames
    .map((f, index) => path.relative(process.cwd(), f))
    .join(' ')}`;*/
};

module.exports = {
  '**/*.{js,jsx,ts,tsx}?(x)': [
    /* buildEslintCommand, buildTypeCheckCommand */
  ],
};
