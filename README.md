# Pricey

Tracking historically lowest price of items we purchase on a recurring basis. 

Automatically converts unit prices when stores (like grocery stores) purposefully hide unit prices or display them in different units.

# Setup

We'll be using TypeScript, NextJS, and Firebase/Firestore


### Requirements
In addition to NodeJS and TypeScript, we'll be using a few code quality tools for error checking/formatting code, such as ESLint, Prettier, Lint-Staged, and Husky



To run the development server:

```zsh
# NextJS uses Yarn over NPM by default

# Yarn installs packages in parallel rather than one-by-one, like NPM does

# Yarn's lockfile is a lot more sturdy than NPM's lockfile

# 
yarn dev
```

## Testing

We're using ESLint to test for basic JavaScript and TypeScript errors. Configuring ESLint



A basic pre-commit hook is configured in ```package.json``` to prevent anyone from making commits that don't pass basic ESLint

# 

# VSCode Extras

### Prettier (format on save)

* In VSCode, install the extention Prettier

# NextJS default ReadMe

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
