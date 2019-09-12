
const fs = require('fs-extra');
const mongoose = require('mongoose');

const config = require('../common/config');
const logger = require('../common/logger');
const timer = require('../services/timer');

class Core {
  constructor () {
    this._mongoDbConnection = null;
  }

  async connectToMongoDb () {
    const timerInstance = timer.createTimer();
    if (config.MONGO_URI) {
      mongoose.set('useFindAndModify', false);
      mongoose.set('useCreateIndex', true);
      mongoose.set('useNewUrlParser', true);
      mongoose.Promise = Promise;

      const { connection } = await mongoose.connect(config.MONGO_URI);
      this._mongoDbConnection = connection;
      logger.info(`Connected to MongoDB (${timerInstance.finish()}ms)`);
    } else {
      logger.info('MONGO_URI not set, skipping MongoDB connection');
    }
  }

  async disconnectFromMongoDb () {
    if (this._mongoDbConnection) {
      await this._mongoDbConnection.close();
      this._mongoDbConnection = null;
      logger.info('Disconnected from MongoDB');
    } else {
      logger.info('No active MongoDB connections, disconnection aborted');
    }
  }

  async createTempFolder () {
    if (config.CLEAN_TEMP_FOLDER && await fs.pathExists(config.TEMP_FOLDER_PATH)) await fs.remove(config.TEMP_FOLDER_PATH);

    await fs.ensureDir(config.TEMP_FOLDER_PATH);
    logger.info(`Temp folder ready (cleanup: ${config.CLEAN_TEMP_FOLDER})`);
  }
}

module.exports = new Core();
