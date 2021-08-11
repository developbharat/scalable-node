# Scalable Node

A scalable nodejs architecture used to build backend services for [developbharat.com](https://developbharat.com)

## Features

- [x] Setup Instructions
- [x] Semantic Versioning
- [ ] Github Actions - Automatic Testing on Merge, push
- [ ] Github Actions - Automatic Docker Image creator and push to docker registry
- [ ] Github Actions - Seperate Release for production and pre-production packages.
- [x] Seperate Logic - Services, Models, Entities, Database
- [x] Single file configuration
- [x] E2E Tests
- [x] Unit Tests
- [ ] Automatic code formatting before commit

## Requirements

- Github braches: `main` - used for production build and deployment, prerelease - used for staging development or code
  that is not yet available in production just for manual testing.
- Software Tools: NodeJS, Docker, Yarn(Optional), VSCode(Optional)

## Codebase Features:

- `MVC` - MVC is extended further to seperate Database Layout from user Models. This allows complete control of what
  users see, and hide database information from user such as: user password etc.

- `MVC` - MVC is extended further to seperate services out of controller, allowing you to use same service in GraphQL,
  and REST API.

- `MVC` - HTML Webpages are not supported, because they should not be served by same backend server for performance
  reasons. You need to create seperate app, using NextJS, VueJS, Angular or something else as per you taste and
  expertise.

- `Validation` - we use Joi, for validations, and there is custom validator that makes it really easy to use existing
  validators or create your own in case you need them.

# Setup Instructions

- Start a MariaDB Server at localhost:3306.
- Create two databases `formstation_local` `formstation_test`
- Start Redis Server on default port
- Export default `.env` variables.
- Execute `yarn dev` to start the server.

#### Specific files

- `<root>/ormconfig.local.ts` file is used for migration generation only.
- `<root>/ormconfig.test.ts` file is used for tests only.

#### Tips

- Use `Nodemailer App` for email server in case of local development.
- Replace `test` with mariadb `username` and password with mariadb `password` in below `.env` export.
- Copy all `.env` exports and paste them in your terminal in which you will execute `yarn dev` command.

#### Default Env Variables.

```bash
export NODE_ENV=development
export DB_URL="mariadb://test:password@localhost:3306/formstation_local"
export REDIS_URL="redis://localhost:6379"
export SESSION_SECRET="session secret"
export PORT=4001
export SMTP_FROM="Formstation <test@mail.com>"
export SMTP_HOST=localhost
export SMTP_PORT=1025
export SMTP_USERNAME="project.3"
export SMTP_PASSWORD="secret.3"
```
