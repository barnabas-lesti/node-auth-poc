const mongoose = require('mongoose');

const { MONGO_URI } = require('../config');
const Logger = require('./logger');

class Database {
  constructor () {
    this._connection = null;
    this._mongoose = mongoose;

    this._mongoose.set('useFindAndModify', false);
    this._mongoose.set('useCreateIndex', true);
    this._mongoose.set('useNewUrlParser', true);
    this._mongoose.Promise = Promise;
  }

  async connect () {
    try {
      if (MONGO_URI) {
        ({ connection: this._connection } = await this._mongoose.connect(MONGO_URI));
        Logger.success('Connected to MongoDB');
      } else {
        Logger.info('MONGO_URI not set, skipping MongoDB connection');
      }
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}

module.exports = new Database();
