# Outvio API Rate Limiter

This program was built for Outvio application challenge.

* An API(random, since the task specified none) was created using Node.js(express) and MongoDB inorder to demonstrate rate limiting. 
* Rate limiting is implemented using Redis. Redis is used to store number of request send by user.
* User identity is done base on user's IP address and jwt token for protected routes. For non-protected routes,
only base on IP address.
* The algorithm used is sliding window. This algorithm is used to keep track of each user’s request count per hour,
 while grouping them by a fixed 5 minutes window(`for memory optimization`).
* A possible limitation to the algorithm is that, if a huge number (for example 10000) of concurrent request
 from a given user is being send out, the algorithm considers it all as a single request.
* `Locks or Mutex` a technique to handle that limitation. (see https://en.wikipedia.org/wiki/Lock_(computer_science)) is not
 implemented by choice, `due to performance reasons(that is, the API is more performant without Mutex implementation)`.
* Different end-points were provided inorder to demonstrate that rate-limiting will work per user, irrespective of end-point used(see test).

** NOTE: For the purpose of simplicity in running the app, the .env files were publish to the repo. This however, should not be the case in real running application.

## Running Locally

* Inorder to run locally, you need to have Docker if you wish to run in Docker(however, npm is needed to run automated test), OR install Node(^16 version) and Npm(^8).

```sh
git clone git@github.com:giresse19/rate_limiter_challenge.git
cd  rate_limiter_challenge
```
* To run in default env(also known as development env): `docker-compose up --build`
* To run in development env: `docker-compose build --build-arg DOCKER_ENV="development" && docker-compose up -d` or `npm run docker.dev`
* To run in test env: `docker-compose build --build-arg DOCKER_ENV="test" && docker-compose up -d` or `npm run docker.test`
* To run in production env: `docker-compose build --build-arg DOCKER_ENV="production" && docker-compose up -d` or `npm run docker.prod`

## Running the end-to-end test
* For simplicity, the test is configured currently to be ran `only` in `development environment` 
* If point one above is met, just run: `npm run test`

## Clear cached limits
* To clear cached limits : `docker-compose down -v` or `npm run clear-limits`

## Container utils
* To view running containers: `docker ps`
* To view specific container logs: `docker logs [container_id]`


All scripts can be found in package.json.

| Purpose | URL
| - | -
| 404 page (public route) | http://localhost:8000/anypage
| register page (public route) | http://localhost:8000/api/v1/user/register
| login page (public route) | http://localhost:8000/api/v1/user/login
| Initialize DB (public route) | http://localhost:8000/internal/initialize
| Delete user's request count (public route)| http://localhost:8000/internal/delete-user-request-count
| Show Logs (public route) | http://localhost:8000/internal/logs
| Show users (private route) | http://localhost:8000/api/v1/users
| Show all companies (private route) | http://localhost:8000/api/v1/companies
| show rich companies (private route) | http://localhost:8000/api/v1/rich-companies?countryCode=EE&category=IT
| Delete user's request count (private route) | http://localhost:8000/api/v1/delete-user-request-count


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
| `prettier.config` | Contains additional rules to help enforce clean code standards
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
* It has three custom middlewares:
  * One of which Sets response header for JSON and Creates a function to return APIs in `{status:200, data: ...}` format
  * The other(auth) sets token to req object, to be accessed by the (rateLimiter).
  * The final(rateLimiter) which limits the number of request made to all endpoints by user's auth token and/or Ip address.
* It has a public API which uses `richCompanies` service
* It has 3 internal functions for db reset, show db and show logs
* It has a fallback route for 404
* It has an Error route to catch uncaught errors

### src/middleware/rateLimiter.js
* Main rate limiter logic is here
* Rate limiting implementation is base on sliding window algorithm
* imports a running redis client instance, from `utils/initRedis.js`
* Contains only one exported service (see `module.exports = `)
* Adds a `Retry-After` to the response header when limit  reached
* All subroutines separated as functions including **Checks** and **Data conversions**

### src/middleware/auth.js
* Sets token on req object for private routes(to be accessed by second middleware)
* Contains only one exported service (see `module.exports = `)

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

### src/service/deleteUserRequestCount.js
* Deletes user's request count from redis
* Contains only one exported service (see `module.exports = 

### src/route/register.js
* Register user file

### src/service/deleteUserRequestCount.js
* Login user file
 
 ### src/utils/initRedis.js
* Redis Initialization starts here and only exported to `rateLimiter.js` and `deleteUserRequestCount` file to be used.
* logs different event listeners upon redis start and stop. 

### src/utils/logger.js
* provides logging for the whole server application.

### test/rateLimiterTest.js
* Contains a simple end-to-end test for rate limiting with different API end-points.

### test/utils/callApi.js
* utility functions used by `rateLimiterTest`


