const db = require('../database/db');

module.exports = (countryCode, category, callback) => {
  if (!countryCode) return void callback({status: 400, message: 'countryCode cannot be empty'});
  if (!category) return void callback({status: 400, message: 'category cannot be empty'});

  db.getCompanies((err, companies) => {
    if (err) return void callback(err);
    companies = companies.filter(company => company.Budget > 3);
    callback(null, companies);

  });
};
