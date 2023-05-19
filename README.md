# Pricey

Tracking personal price thresholds and lowest price of items we purchase on a recurring basis.

Convert prices per unit when grocery stores purposefully hide them or markup and discount them while hiding their actual
prices per unit

# TODO:

- [TODO Board](https://github.com/Julchu/Pricey/projects/2)

# Setup

### NodeJS, `npm`, `yarn`

- You'll need to download [NodeJS](https://nodejs.org/en/) and install to `npm` (Node Package Manager) to PATH so that
  you can run commands to download packages used to create React projects.

- The main package you'll need is a separate package manager called `yarn`, which functions similarly (like a super
  layer) to `npm`

### Why `yarn`

- NextJS uses `yarn` over `npm` by default
- `yarn` installs packages in parallel rather than one-by-one, like `npm` does
- `yarn`'s lockfile is a lot more sturdy than `npm`'s lockfile

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

- You'll need a copy of `.env.example` as your development environment, as well as a production environment when
  deploying to live

```zsh
# Copy and setup your environment
cp .env.example .env.development .env.production
```

### Cloning and installing the app

```zsh
# Go to your preferred project directory; a folder called Pricey will be added
git clone https://github.com/Julchu/Pricey.git
cd Pricey

# Installing the React app; a browser tab should open at localhost:3000
yarn install
yarn dev

# TODO: Installing Firebase functions; can probably skip this for now
cd functions
yarn install

# Deploying app to live; make sure to comment out lines to connect emulators in /lib/firebase/index.ts before deploying
# Optional flag: --except functions
yarn export && firebase --project <projectId> deploy

```

### Launching the Firebase/Firestore emulator: open the emulator at localhost:4000/firestore

- Also exports/imports emulator data to `./emulatorData`
- `projectId` will be the one in your .env.development

```zsh
firebase --project="<projectId>" emulators:start --only auth,firestore,storage --export-on-exit ./emulatorData --import ./emulatorData
```

### Sometimes emulator port is in use, this command will kill that port

```zsh
sudo kill -9 $(sudo lsof -t -i:8080)
```

### Prettier (format on save)

- In VSCode, install the extention Prettier
- Go to your VSCode JSON settings:
    - Command Palette -> Preferences: Open Settings (JSON)
- Add the following code to the JSON object
- Whenever you save a file, it'll run automatic formatting based on rules defined in `/.prettierrc.json`

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

- I also use file autosave whenever I switch to a different page/window, mimicking Webstorm

```json
{
  "files.autoSave": "onFocusChange"
}
```

## Testing

We're using ESLint to test for basic JavaScript and TypeScript errors

You can run `lint` and `type-check` to check for basic project syntax errors

```zsh
# In root directory (/Pricey)
yarn lint
yarn type-check
```

- With Husky and Lint-Staged, project will automatically run these basic checks when trying to commit changes or deploy
  the project, and will block the commit/deployment on errors (not warnings)

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

Each area can be a component, that can be a group of smaller components, which can be a group of smaller individual
components/HTML elements

Sometimes data must be able to appear in multiple components, or be manipulated within specific components and appear in
other components.

Data can be passed downwards to children pretty easily through `props`, tho cycling them back up and/or across is not as
easy.

If you understand `getters` and `setters`, we can also pass down `setter` functions that'll manipulate the
top-level `state` data that is also being passed down to other neighbouring child components

## NextJS Layout

### /components

- For React components, structured as
    - DirectoryName
        - CropAlgorithm.tsx
        - styles.tsx
- Template files:
    - /components/Template: index/styles.tsx
    - /pages/template: CropAlgorithm.tsx

### /pages:

- Files in this directory are treated as API routes instead of React pages
    - RouteName
        - CropAlgorithm.tsx: localhost:3000/RouteName
        - SubRouteName
            - CropAlgorithm.tsx: localhost:3000/RouteName/SubRouteName
            - [templateIndex].tsx: localhost:3000/RouteName/SubRouteName/templateIndex
- CropAlgorithm.tsx files are the displayed components, so `/pages/CropAlgorithm.tsx` will be the base `localhost:3000/`
  file

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

Our base styled components will go into `/UI`, and each specific component's styles can either build unique styled
components, or inherit from one in `/UI`

- Ex: `/components/UI/buttons.tsx`

Syntax is similar to CSS but with camelCase instead of kebab-case

- Ex: `fontSize` instead of `font-size`

Every non-numeric value is a string in single quotes

- Ex: `fontSize: '24px'`, `fontSize: 24`

## Chakra UI: advanced version of Emotion styled components

Chakra UI is built on Emotion, but with various nuances, attempting to solve inconsistent theming from building every
component from scratch (like I did in V1 of this app)

Chakra UI offers basic components with the idea for us to elaborately customize them into different varients to call in
our app

Rather than lose track of every single kind of button we built per page in Emotion, we'll just use Chakra UI Buttons
with a specific variant

## CSS Notes

`display: 'flex'`: displays content relative to other content

- Content will be displayed in order

`position: 'fixed'`: positions content relative to browser

- Ex: `bottom: '0px'`, will position content at bottom of browser regardless of any content, on top of the content
  displayed

## Firestore

```ts
const newUserRef = await addDoc(db.userCollection, { userData });

const userDoc = await getDoc(newUserRef);
if (userDoc.exists()) {
  const user = userDoc.data();
}

const existingUser = await getDocs(query(db.userCollection, where('uid', '==', uid)));

if (existingUser.docs.length) {
  const user = existingUser.docs[0].data();
}
```

Types or Interfaces?

- Interface for public API's definition when authoring a library or 3rd party ambient type definitions, as this allows a
  consumer to extend them via declaration merging if some definitions are missing.

- Type for your React Component Props and State, for consistency and because it is more constrained.

  > https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/#types-or-interfaces

- Use Interface until You Need Type
  > https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces