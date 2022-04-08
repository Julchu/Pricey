const path = require('path');

const buildEslintCommand = filenames =>
  `next lint --fix --file ${filenames.map(f => path.relative(process.cwd(), f)).join(' --file ')}`;

const buildTypeCheckCommand = filenames => {
  // Index 0 should be .lintstagedrc.js which we want to skip
  return `tsc --target es5 --allowJs --skipLibCheck --strict --forceConsistentCasingInFileNames --noEmit --esModuleInterop --module esnext --moduleResolution node --resolveJsonModule  --isolatedModules --jsx preserve ${filenames
    .map((f, index) => path.relative(process.cwd(), f))
    .join(' ')}`;
};

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, buildTypeCheckCommand],
};
