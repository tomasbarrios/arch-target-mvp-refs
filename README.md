
#COLORS

https://pink.appwrite.io/foundations/colors

## Confetti
https://codepen.io/bonarhyme/pen/ZEoMaea
### 
Flash messages like RAILS
https://github.com/remix-run/remix/discussions/2125

# Introduction of flaggedAs

- importante | time | secondary (?)

## Rollback

https://community.fly.io/t/manual-rollback-to-earlier-version/4586/3
fly releases --image

## Components (External-ish)

https://ui.shadcn.com/docs/components/alert
https://icons.radix-ui.com/

## VsCode Recommended Extensions

| Name            | Status | vscode name                   | Notes                                                      |
| --------------- | ------ | ----------------------------- | ---------------------------------------------------------- |
| Prettier        | ✅     | esbenp.prettier-vscode        |                                                            |
| Eslint Prettier | ✅     | rvest.vs-code-prettier-eslint |                                                            |
| Eslint          | ✅     | dbaeumer.vscode-eslint        | Dependency for Eslint prettier. Shows all errors in editor |
| XXX | ok | rohit-gohri.format-code-action | Dependency for running format "source.formatDocument"
Provides:

- Format
  - ✅ by running `npm run format`
  - ✅ on save (partial ❌)

Not yet implemented

- ...

# Tailwind

https://tailwindcss.com/docs/adding-custom-styles#adding-base-styles

### Fly Volumes

`fly vol list`
`fly vol show xxx`
`fly ssh console -s -C df`

#### Snapshots

Fly crea snapshots automáticos

Ver snapshots creados:
`fly volumes snapshots list xxx`

### SQLite

`npx prisma studio`

---

Trouble on Fly.io?

- Try [SSH](https://fly.io/docs/getting-started/troubleshooting/#inspecting-with-ssh)

---

### Prisma

#### Delete associated record

https://stackoverflow.com/a/69580292

---

1 day (10 marzo) since breaking deploys
Reason: needs latest prisma lib

Current Status: DEPLOY BROKEN. 1 day (10 marzo)

---

TO ORGANIZE:

TODO
Strufy rollbacks in prisma
https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/generating-down-migrations

### Prisma

#### Many to Many

https://www.prisma.io/docs/concepts/components/prisma-schema/relations/many-to-many-relations

## migrations

1. Alter `prisma.schema`
2. npx prisma migrate dev

### Only run seed?

`npx prisma db seed`

---

History

25 may: Fix database being erased in deploy. Solved via [Discord](https://discord.com/channels/770287896669978684/1111317089362391141/1111317089362391141)

---

Generated from template
https://github.com/tomasbarrios/indie-stack-mvps
tomasbarrios/indie-stack-mvps

```
npx create-remix@latest --template tomasbarrios/indie-stack-mvps  arch-target-mvp-refs
```

# Remix Indie Stack

![The Remix Indie Stack](https://repository-images.githubusercontent.com/465928257/a241fa49-bd4d-485a-a2a5-5cb8e4ee0abf)

Learn more about [Remix Stacks](https://remix.run/stacks).

```sh
npx create-remix@latest --template remix-run/indie-stack
```

## What's in the stack

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Production-ready [SQLite Database](https://sqlite.org)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/utils/sessions#md-createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

Not a fan of bits of the stack? Fork it, change it, and use `npx create-remix --template your/repo`! Make it your own.

## Quickstart

Click this button to create a [Gitpod](https://gitpod.io) workspace with the project set up and Fly pre-installed

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/remix-run/indie-stack/tree/main)

## Development

- Initial setup:

  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `rachel@remix.run`
- Password: `racheliscool`

### Relevant code:

This is a pretty simple note-taking app, but it's a good example of how you can build a full stack app with Prisma and Remix. The main functionality is creating users, logging in and out, and creating and deleting notes.

- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/session.server.ts](./app/session.server.ts)
- creating, and deleting notes [./app/models/note.server.ts](./app/models/note.server.ts)

## Deployment

This Remix Stack comes with two GitHub Actions that handle automatically deploying your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly apps create arch-target-mvp-refs-8089
  fly apps create arch-target-mvp-refs-8089-staging
  ```

  > **Note:** Make sure this name matches the `app` set in your `fly.toml` file. Otherwise, you will not be able to deploy.

  - Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app arch-target-mvp-refs-8089
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app arch-target-mvp-refs-8089-staging
  ```

  If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator/) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Create a persistent volume for the sqlite database for both your staging and production environments. Run the following:

  ```sh
  fly volumes create data --size 1 --app arch-target-mvp-refs-8089
  fly volumes create data --size 1 --app arch-target-mvp-refs-8089-staging
  ```

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.

### Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to the live database by running `fly ssh console -C database-cli`.

### Getting Help with Deployment

If you run into any issues deploying to Fly, make sure you've followed all of the steps above and if you have, then post as many details about your deployment (including your app name) to [the Fly support community](https://community.fly.io). They're normally pretty responsive over there and hopefully can help resolve any of your deployment issues and questions.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We have a utility for testing authenticated features without having to go through the login flow:

```ts
cy.login();
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser();
});
```

That way, we can keep your local db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.

### Libraries

| lib                         | version   | usage           |
| --------------------------- | --------- | --------------- |
| @faker-js/faker             | ^7.6.0    | test            |
| @remix-run/dev              | ^1.13.0   | local env       |
| @remix-run/eslint-config    | ^1.13.0   | lint            |
| @testing-library/cypress    | ^8.0.7    | e2e             |
| @testing-library/dom        | ^8.20.0   | ?               |
| @testing-library/jest-dom   | ^5.16.5   | test            |
| @testing-library/react      | ^13.4.0   | html            |
| @testing-library/user-event | ^14.4.3   | ?               |
| @types/bcryptjs             | ^2.4.2    | login passwords |
| @types/eslint               | ^8.4.10   | ?               |
| @types/node                 | ^18.11.18 | ?               |
| @types/react                | ^18.0.26  | ?               |
| @types/react-dom            | ^18.0.10  | ?               |
| @vitejs/plugin-react        | ^3.0.1    | ?               |
| @vitest/coverage-c8         | ^0.27.2   | ?               |
| autoprefixer                | ^10.4.13  | ?               |
| binode                      | ^1.0.5    | ?               |
| c8                          | ^7.12.0   | ?               |
| cookie                      | ^0.5.0    | ?               |
| cross-env                   | ^7.0.3    | ?               |
| cypress                     | ^10.11.0  | ?               |
| eslint                      | ^8.32.0   | ?               |
| eslint-config-prettier      | ^8.6.0    | ?               |
| eslint-plugin-cypress       | ^2.12.1   | ?               |
| happy-dom                   | ^8.1.4    | ?               |
| msw                         | ^0.49.2   | ?               |
| npm-run-all                 | ^4.1.5    | ?               |
| postcss                     | ^8.4.21   | ?               |
| prettier                    | 2.8.3     | ?               |
| prettier-plugin-tailwindcss | ^0.2.1    | ?               |
| prisma                      | ^4.9.0    | ?               |
| start-server-and-test       | ^1.15.2   | ?               |
| tailwindcss                 | ^3.2.4    | ?               |
| ts-node                     | ^10.9.1   | ?               |
| tsconfig-paths              | ^4.1.2    | ?               |
| typescript                  | ^4.9.4    | ?               |
| vite                        | ^4.0.4    | ?               |
| vite-tsconfig-paths         | ^3.6.0    | ?               |
| vitest                      | ^0.27.2   | ?               |
