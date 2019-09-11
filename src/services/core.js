
const fs = require('fs-extra');
const mongoose = require('mongoose');

const { config, logger } = require('../common');

class Core {
  async connectToMongoDb () {
    if (config.MONGO_URI) {
      mongoose.set('useFindAndModify', false);
      mongoose.set('useCreateIndex', true);
      mongoose.set('useNewUrlParser', true);
      mongoose.Promise = Promise;

      await mongoose.connect(config.MONGO_URI);
      logger.info('Connected to MongoDB');
    } else {
      logger.info('MONGO_URI not set, skipping MongoDB connection');
    }
  }

  async createTempFolder () {
    if (config.CLEAN_TEMP_FOLDER && await fs.pathExists(config.TEMP_FOLDER_PATH)) await fs.remove(config.TEMP_FOLDER_PATH);

    await fs.ensureDir(config.TEMP_FOLDER_PATH);
    logger.info(`Temp folder ready (cleanup: ${config.CLEAN_TEMP_FOLDER})`);
  }
}

module.exports = new Core();
