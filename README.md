# SysTrans

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.24.

## Development server

```bash
npm start
```

`npm start` starts only Angular. The API base URL is set in [`src/environments/environment.ts`](src/environments/environment.ts); it includes `/api`. The private job form is at `/addsystransjob`.

## Deploying to Netlify

Netlify hosts the Angular frontend. Connect the frontend repository to Netlify; the build command and publish directory are configured in `netlify.toml`.

To point the frontend at a different API deployment, update `apiBaseUrl` in [`src/environments/environment.ts`](src/environments/environment.ts), then rebuild and redeploy the frontend.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
