const db = require('./database/db');
const richCompanies = require('./service/richCompanies');
const deleteUserRequestCount = require('./service/deleteUserRequestCount');
const rateLimiter = require('./middlewares/rateLimiter');

const express = require('express');
const app = express();

console.log('current env: ', process.env.NODE_ENV);

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

app.get('/api/v1/rich-companies', (req, res) =>
  richCompanies(req.query.countryCode, req.query.category, res.apiResponse)
);

app.get('/api/v1/delete-user-request-count', (req, res) =>
  deleteUserRequestCount(req, req, res.apiResponse)
);

app.use((req, res, next) => rateLimiter(req, res, next, res.apiResponse));

app.get('/internal/logs', (req, res) => db.getLogs(res.apiResponse));

app.get('/internal/initialize', (req, res) => db.initialize(res.apiResponse));

app.get('/internal/db', (req, res) => db.getCompanies(res.apiResponse));

app.get('/internal/logs', (req, res) => db.getLogs(res.apiResponse));



app.use((req, res) => res.apiResponse({status: 404, message: 'Page not found'}));

app.use((err, req, res, next) => res.apiResponse('Server error. ' + err));

module.exports = app;
