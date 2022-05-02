const path = require('path');

const buildEslintCommand = filenames =>
  `next lint --fix --file ${filenames.map(f => path.relative(process.cwd(), f)).join(' --file ')}`;

const buildTypeCheckCommand = filenames => {
  // Index 0 should be .lintstagedrc.js which we want to skip
  return `tsc --target esnext --allowJs --skipLibCheck --strict --forceConsistentCasingInFileNames --noEmit --esModuleInterop --module esnext --moduleResolution node --resolveJsonModule  --isolatedModules --jsx preserve --jsxImportSource @emotion/react ${filenames
    .map((f, index) => path.relative(process.cwd(), f))
    .join(' ')}`;
};

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, buildTypeCheckCommand],
};
