# Lawson Dong — Research Notebook

Personal website built with Next.js, React, and TypeScript.

## Development

```bash
npm ci
npm run dev
```

## Production

```bash
npm run build
npm start
```

## Pages

- `/`: Research, notes, and representation analysis
- `/mathematics/linear-algebra`: Gaussian elimination, elementary row operations, and interactive column space / consistency and row space / null space visualizations sharing the same matrix
- `/lost`: Interactive desktop pet and interesting websites

The Linear Algebra module includes Explore Mode and Matrix Mode with rank 0, 1, and 2 examples.

## Deployment

This repository is connected to the existing Vercel project `lawson-dong`.
Commits to `main` trigger production deployments; other branches can be used for previews.

Live site: https://lawson-dong.vercel.app
