const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config')

mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const LogSchema = new Schema({
  message: { type: String, required: true }
});

const CompanySchema = new Schema({
  CompanyID: { type: String, required: true, unique: true },
  Countries: { type: String, required: true },
  Budget: { type: Number, required: true },
  Categories: { type: String, required: true }
});

module.exports.Log = mongoose.model('Log', LogSchema);
module.exports.Company = mongoose.model('Company', CompanySchema);
