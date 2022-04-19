# Pricey

Tracking historically lowest price of items we purchase on a recurring basis.

Automatically converts unit prices when stores (like grocery stores) purposefully hide unit prices or display them in different units.

# TODO:

- [x] Add Firebase/Firestore
- [x] Deploy GH Pages/Firebase Hosting

# Setup

### NodeJS, npm, Yarn

- You'll need to download [NodeJS](https://nodejs.org/en/) and install to `npm` (Node Package Manager) to PATH so that you can run commands to download packages used to create React projects.

- The main package you'll need is a separate package manager called `Yarn`, which functions similarly (like a super layer) to `npm`

```bash
npm install --global yarn
```

### Firebase/Firestore emulator

- You'll need Firebase installed globally

```zsh
yarn global add firebase-tools
```

### Git

- You'll need [git](https://git-scm.com/downloads) installed to copy the project into your local directory

### Environment files

- You'll need a copy of `.env.example` as your development environment, as well as a production environment when deploying to live

```zsh
# Copy and setup your environment
cp .env.example .env.development
```

### Cloning and installing the app

```zsh
# Go to your preferred project directory
# A folder called Pricey will be added
git clone https://github.com/Julchu/Pricey.git
cd Pricey

# Installing the React app
# A browser tab should open at localhost:3000
yarn install
yarn dev

# Launching the Firebase/Firestore emulator
# You can open the emulator at localhost:4000/firestore
firebase --project <projectId> emulators:start --only firestore


# TODO: Installing Firebase functions
cd functions
yarn install

# Deploying app to live:
yarn export && firebase --project <projectId> deploy
# Optional flag: --except functions

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

Our project also will automatically run these commands on staged files whenever you're committing them. It'll block the commits if errors are thrown, with our installation of Husky and Lint-Staged

## Why Yarn

- NextJS uses Yarn over NPM by default
- Yarn installs packages in parallel rather than one-by-one, like NPM does
- Yarn's lockfile is a lot more sturdy than NPM's lockfile

# Notes

Projects can be split into

- Front-end: React, Angular, Vue
- Back-end: NodeJS, "servers", Firebase
- Database: Firestore, MongoDB, Postgres

Front-end: how things look from a user's standpoint, or how data is displayed

Back-end: how data is sent to front-end, or how data is saved to database

Database: where data is stored, or locations of non-string data (like files) that are kept in storage

## Understanding React/NextJS

Building React apps involves turning web pages into components (kinda like an HTML Iframe)

Similar but opposite to PHP, where it's HTML structure with in-line code, React is code to structure HTML

Imagine a Discord text-channel as a website: it can be split into multiple pieces:

- Left side bar to view available servers
- Left-mid area to view available channels
- Main chat box w/ text input
- Right side bar to view available users

Each area can be a component, that can be a group of smaller components, which can be a group of smaller individual components/HTML elements

Sometimes data must be able to appear in multiple components, or be manipulated within specific components and appear in other components.

Data can be passed downwards to children pretty easily through `props`, tho cycling them back up and/or across is not as easy.

If you understand `getters` and `setters`, we can also pass down `setter` functions that'll manipulate the top-level `state` data that is also being passed down to other neighbouring child components

## NextJS Layout

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

- Project information, node module dependencies, etc...
- Scripts: commands and aliases to run commands
  - Ex: type-check runs the TS compiler script `tsc` when you call it with `yarn type-check`
- Dependencies: `yarn add <packageName>`
  - Required for end user/host to install when building app
  - Ex: NextJS/React, Emotion (styling)
- Dev Dependencies: `yarn add <packageName> -D`
  - Required for devs to install when building app
  - Ex: linters, formatters

## Basic Emotion styled components

Emotion allows you to style components in a function/object format, similar to how we build normal React components

Our base styled components will go into `/UI`, and each specific component's styles can either build unique styled components, or inherit from one in `/UI`

- Ex: `/components/UI/buttons.tsx`

Syntax is similar to CSS but with camelCase instead of kebab-case

- Ex: `fontSize` instead of `font-size`

Every non-numeric value is a string in single quotes

- Ex: `fontSize: '24px'`, `fontSize: 24`

## CSS Notes

`display: 'flex'`: displays content relative to other content

- Content will be displayed in order

`position: 'fixed'`: positions content relative to browser

- Ex: `bottom: '0px'`, will position content at bottom of browser regardless of any content, on top of the content displayed

## Firestore
