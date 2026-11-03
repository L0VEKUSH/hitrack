# HiTrack

HiTrack is a cricket live-score web project with a JavaScript backend and web frontend.

## Technology stack

The current `package.json` declares:

- Node.js
- Express 5
- MongoDB
- Mongoose 9
- HTML, CSS and JavaScript
- bcrypt, dotenv, cors, body-parser, and express-session

> These are package-level declarations. Exact runtime wiring, API routes, and database schemas still need to be verified against the application source.

## Architecture

See the [architecture overview](docs/architecture.md) for a conceptual system diagram, dependency inventory, data-layer documentation status, and verification gaps. The diagram is explicitly labelled conceptual until the application entry point and source modules are confirmed.

## Repository setup

Install dependencies:

```bash
npm install
```

The inspected package manifest currently does not define `dev` or `start` scripts. Its `test` script is still the default placeholder that exits with an error. Although the manifest declares `index.js` as its main entry, that file could not be retrieved during this documentation pass.

Do not assume a startup or test command until the actual application entry point and runtime configuration have been confirmed.

## Engineering roadmap

1. Confirm the actual application entry point and startup command.
2. Inspect Express routes, controllers, middleware, and Mongoose models.
3. Publish API documentation from verified route definitions.
4. Document actual database schemas, relationships, and indexes.
5. Add automated tests for existing behavior and replace the placeholder test script.
6. Add GitHub Actions CI once install, test, and any lint/build commands are reliable.

## Security

- Keep database credentials, session secrets, and API keys out of source control.
- Use environment variables for secrets and provide a placeholder-only `.env.example` once variable names are verified.
- Never commit a populated `.env` file.
- Validate incoming data and enforce authorization on the server.
- Verify session cookie settings, session storage, and CORS configuration before deployment.

## Contributing

Use focused branches and commits. For bug fixes, include a reproducible case and a regression test. For features, document expected behavior and edge cases.

## License

The package manifest declares ISC. Check the repository's license file before reusing or redistributing this project.
