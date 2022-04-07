# Pricey

Tracking historically lowest price of items we purchase on a recurring basis.

Automatically converts unit prices when stores (like grocery stores) purposefully hide unit prices or display them in different units.

# Setup

We'll be using TypeScript, NextJS, and Firebase/Firestore

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

## Requirements

In addition to NodeJS and TypeScript, we'll be using a few code quality tools for error checking/formatting code, such as ESLint, **Prettier**, and pre-commit

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

# NextJS starter README

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
