# Pricey

Tracking historically lowest price of items we purchase on a recurring basis.

Automatically converts unit prices when stores (like grocery stores) purposefully hide unit prices or display them in different units.

# TODO:

- Add Firebase/Firestore
- Deploy GH Pages

# Setup

### NodeJS, npm, Yarn

You'll need to download [NodeJS](https://nodejs.org/en/) and install to `npm` (Node Package Manager) to PATH so that you can run commands to download packages used to create React projects. The main package you'll need is a separate package manager called `Yarn`, which functions similarly (like a super layer) to `npm`

```bash
npm install --global yarn
```

You'll also need [git](https://git-scm.com/downloads) installed to copy the project into your local directory

To run the development server:

```zsh
# Go to a directory that you want the project added to
# Ex: /Documents, where a folder called Pricey will be added
git clone https://github.com/Julchu/Pricey.git
cd Pricey

# Installing the React app
yarn install
yarn dev

# A browser tab should open at localhost:3000
```

### Prettier (format on save)

- In VSCode, install the extention Prettier
- Go to your VSCode JSON settings:
  - Command Palette -> Preferences: Open Settings (JSON)
- Add the following code to the JSON object

```json
// settings.json
{
	...
	"editor.tabSize": 2,

	// Add this to enable autosave in VSCode with Prettier
	"editor.formatOnSave": true,
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	...
}
```

- Whenever you save a file, it'll run automatic formatting based on rules defined in `/.prettierrc.json`

## Testing

We're using ESLint to test for basic JavaScript and TypeScript errors

You can run `lint` and `type-check` to check for basic project syntax errors

```zsh
# In root directory (/Pricey)
yarn lint
yarn type-check
```

Our project also will automatically run these commands whenever you're committing files. It'll also block commits if errors show up, with a basic pre-commit hook configured in `package.json`

```json
// package.json
{
	...
	"pre-commit": [
		"lint",
		"type-check"
	]
	...
}
```

## Why Yarn

- NextJS uses Yarn over NPM by default
- Yarn installs packages in parallel rather than one-by-one, like NPM does
- Yarn's lockfile is a lot more sturdy than NPM's lockfile

# Notes

## Basic NextJS layout

### /components

- For React components, structured as
  - DirectoryName
    - index.tsx
    - styles.tsx
- Template files:
  - /components/Template: index/styles.tsx
  - /pages/template: index.tsx

### /pages:

- Files in this directory are treated as API routes instead of React pages
  - RouteName
    - index.tsx: localhost:3000/RouteName
    - SubRouteName
      - index.tsx: localhost:3000/RouteName/SubRouteName
      - [templateIndex].tsx: localhost:3000/RouteName/SubRouteName/templateIndex
- index.tsx files are the displayed components, so `/pages/index.tsx` will be the base `localhost:3000/` file

### /package.json

- Project information, scripts, node module dependencies, pre-commit hooks, etc...
- Dependencies: `yarn add <packageName>`
  - Required for end user/host to install when building app
  - Ex: NextJS/React, Emotion (styling)
- Dev Dependencies: `yarn add <packageName> -D`
  - Required for devs to install when building app
  - Ex: linters, formatters

## Basic Emotion styled components

Base styled components can go into `/UI`, and each specific component's styles can either build unique styled components or inherit from one from `/UI`

- Ex: `/components/UI/buttons.tsx`

Syntax is similar to CSS but with camelCase instead of kebab-case

- Ex: `fontSize` instead of `font-size`

Every non-numeric value is a string in single quotes

- Ex: `fontSize: '24px'`, `fontSize: 24`
