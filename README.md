# Scalable Node

A scalable nodejs architecture used to build backend services for [developbharat.com](https://developbharat.com)

## Features

- [ ] Setup Instructions
- [ ] Semantic Versioning
- [ ] Github Actions - Automatic Testing on Merge, push
- [ ] Github Actions - Automatic Docker Image creator and push to docker registry
- [ ] Github Actions - Seperate Release for production and pre-production packages.
- [x] Seperate Logic - Services, Models, Entities, Database
- [ ] Single file configuration
- [ ] E2E Tests
- [ ] Unit Tests
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
