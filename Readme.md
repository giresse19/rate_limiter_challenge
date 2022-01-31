# Outvio API Rate Limiter

This program is built for Outvio application challenge.

* An API(random, since no specific was demanded) was created using Node.js(express) and MongoDB inorder to demonstrate rate limiting. 
* Rate limiting was implemented using Redis. Redis was used to store number of request send by user.
* User identity was done base on user's IP address.
* Different end-points were provided inorder to demonstrate that rate-limiting will work per user, irrespective of end-point used.


** NOTE: For the purpose of simplicity in running the app, the .env files were publish to the repo. This however, should not be the case in real running application.

## Running Locally

* Inorder to run locally, you need to have Docker if you wish to run in Docker, OR install Node(^16 version) and Npm(^8).

```sh
git clone git@github.com:giresse19/rate_limiter_challenge.git
cd  rate_limiter_challenge
```
* To run in default env(also known as development env): `docker-compose up --build`
* To run in development env: `docker-compose build --build-arg DOCKER_ENV="development" && docker-compose up -d` or `npm run docker.dev`
* To run in test env: `docker-compose build --build-arg DOCKER_ENV="test" && docker-compose up -d` or `npm run docker.test`
* To run in production env: `docker-compose build --build-arg DOCKER_ENV="production" && docker-compose up -d` or `npm run docker.prod`

## Running the end-to-end test
* In order to run the test, ensure you are running the app in `development environment`, 
* Ensure you have not send any previous request manually to the API before, otherwise, see `Clear cached limits` below.
* The reason to ensure no request has been send before is because, development ENV has a limit of `100` and the test checks for a limit of `101` expects `one response to contains HTTP code 429`
* Then run: `npm run test`

## Clear cached limits
* To clear cached limits : `docker-compose down -v` or `npm run clear-limits`

## Container utils
* To view running containers: `docker ps`
* To view specific container logs: `docker logs [container_id]`


All scripts can be found in package.json.

| Purpose | URL
| - | -
| 404 page | http://localhost:8000/anypage
| Initialize DB | http://localhost:8000/internal/initialize
| Show DB | http://localhost:8000/internal/db
| Show Logs | http://localhost:8000/internal/logs
| show rich companies | http://localhost:8000/api/v1/rich-companies?countryCode=EE&category=IT

## Folder structure

### Root files

| File | Comment
| - | -
| `.editorconfig` | IDE styler (see http://editorconfig.org/)
| `.eslintrc.js` | ESLint Rules, including ES6 and some best practices
| `.gitignore` | Ignoring node_modules and lock files 
| `.env.development` | contains all dev specific environment variable 
| `.env.test` | contains all test specific environment variable 
| `.env.production` | contains all prod specific environment variable 
| `LICENSE` | MIT License file
| `Readme.md` | This file
| `package.json` | NPM data including node and npm engine versions. Also contains script to run the app

### src/server.js
* Main entrance point, also defined as this on `package.json`
* Catches all exceptions and logs, preventing errors to crash process
* Uses `process.env.PORT` to define listen port, fallbacks to `8000`

### src/config.js
* Main entry used to provide different variables base on environment
* Provides default values in case no environment specified
* Contains only one exported service which provides environment variables to the app(see `module.exports = `)

### src/app.js
* Isolated Express App (without the server)
* It has two custom middlewares:
  * One of which Sets response header for JSON and Creates a function to return APIs in `{status:200, data: ...}` format
  * The other(rateLimiter) which limits the number of request made to all endpoints by user's IP address.
* It has a public API which uses `richCompanies` service
* It has 3 internal functions for db reset, show db and show logs
* It has a fallback route for 404
* It has an Error route to catch uncaught errors

### src/middleware/rateLimiterTest.js
* Main rate limiter logic is here
* Rate limiting implementation is base on sliding window algorithm
* imports a running redis client instance, from `utils/initRedis.js`.
* Contains only one exported service (see `module.exports = `)
* All subroutines are separated as functions including **Checks** and **Data conversions**

### src/database/models.js
* Mongoose connection starts here
* Mongoose models and their schemas are defined and exported here (to be only used by `src/db.js`)

### src/database/db.js
* Uses `src/models` to get Mongoose Models
* Behaves like ORM layer
* DB tasks like `initialize`, and `log` are defined here

### src/service/richCompanies.js
* Filter companies base on budget
* Contains only one exported service (see `module.exports = `)
 
 ### src/utils/initRedis.js
* Redis Initialization starts here and only exported to `rateLimiter.js` file to be used.
* logs different event listeners upon redis start and stop. 

### src/utils/logger.js
* provides logging for the whole server application.

### test/rateLimiterTest.js
* Contains a simple end-to-end test for rate limiting.

### test/utils/callApi.js
* Calls an endpoint one time more than limit for development ENV.


