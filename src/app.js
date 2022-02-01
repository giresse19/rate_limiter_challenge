const db = require('./database/db');

const richCompanies = require('./service/richCompanies');
const deleteUserRequestCount = require('./service/deleteUserRequestCount');
const rateLimiter = require('./middlewares/rateLimiter');
const authenticate = require('./middlewares/auth');

const register = require('./routes/register');
const login = require('./routes/login');

const bodyParser = require('body-parser');
const express = require('express');

const app = express();

console.log('current env: ', process.env.NODE_ENV === '' ? 'Default' : process.env.NODE_ENV);

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');

  // To parse responses from services and return them as proper API responses
  res.apiResponse = (err, message) => {
    let status = err ? (err.status || 500) : 200;
    message = err && err.message || message;
    return res.status(status).end(JSON.stringify({status, message}));
  };

  next();
});

// protected routes
app.get('/api/v1/rich-companies',
  (req, res, next) => authenticate(req, res, next, res.apiResponse),
  (req, res, next) => rateLimiter(req, res, next, res.apiResponse),
  (req, res) => richCompanies(req.query.countryCode, req.query.category, res.apiResponse));

app.get('/api/v1/users',
  (req, res, next) => authenticate(req, res, next, res.apiResponse),
  (req, res, next) => rateLimiter(req, res, next, res.apiResponse),
  (req, res) => db.getUsers(res.apiResponse));

app.get('/api/v1/companies',
  (req, res, next) => authenticate(req, res, next, res.apiResponse),
  (req, res, next) => rateLimiter(req, res, next, res.apiResponse),
  (req, res) => db.getCompanies(res.apiResponse));


// unprotected routes
app.use((req, res, next) => rateLimiter(req, res, next, res.apiResponse));

app.use("/api/v1/user", register);

app.use("/api/v1/user", login);

app.get('/internal/logs', (req, res) => db.getLogs(res.apiResponse));

app.get('/internal/initialize', (req, res) => db.initialize(res.apiResponse));

app.get('/internal/delete-user-request-count',  (req, res) => deleteUserRequestCount(req, req, res.apiResponse));

// error handler middlewares
app.use((req, res) => res.apiResponse({status: 404, message: 'Page not found'}));

app.use((err, req, res, next) => res.apiResponse('Server error. ' + err));

module.exports = app;
