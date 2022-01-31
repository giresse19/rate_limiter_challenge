const models = require('./models');

module.exports = {
  getLogs: (callback) => models.Log.find({}, callback),

  getCompanies: (callback) => models.Company.find({}, callback),

  log: (message) => {
    let record = new models.Log({message});
    record.save()
      .then(r => console.log(`new log saved to DB`, r))
      .catch(err => console.log(`Error while saving log to DB`, err));
  },

  initialize: function (callback) {
    models.Company.remove({}, (err) => {
      if (err) return void callback(err);
    });
    models.Log.remove({}, (err) => {
      if (err) return void callback(err);
    });

    models.Company.insertMany([
      {CompanyID: 'C1', Countries: 'US', Budget: 1, Categories: 'Automobile,Finance'},
      {CompanyID: 'C2', Countries: 'IN', Budget: 2, Categories: 'Finance,IT'},
      {CompanyID: 'C3', Countries: 'RU', Budget: 3, Categories: 'IT,Logistics'},
      {CompanyID: 'C4', Countries: 'FR', Budget: 4, Categories: 'IT,Automobile'},
      {CompanyID: 'C5', Countries: 'EE', Budget: 5, Categories: 'Fishing'},
      {CompanyID: 'C6', Countries: 'EE', Budget: 6, Categories: 'IT,'},
      {CompanyID: 'C7', Countries: 'EE', Budget: 7, Categories: 'Automobile'},
      {CompanyID: 'C8', Countries: 'CM', Budget: 8, Categories: 'IT,Automobile'},
      {CompanyID: 'C9', Countries: 'LV', Budget: 9, Categories: 'Entertainment'},
      {CompanyID: 'C10',Countries: 'DE', Budget: 10, Categories: 'IT,Automobile'},

    ]).then(() => {
      this.log('Database initialized');
      callback(null, 'Database initialize complete');
    }).catch((err) => {
      callback(err);
      console.log(err);
    })
  }
};
