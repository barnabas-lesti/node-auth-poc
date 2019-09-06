const mongoose = require('mongoose');
const fs = require('fs-extra');

const { config, logger } = require('../common');

const connectToMongoDb = async () => {
  if (config.MONGO_URI) {
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useNewUrlParser', true);
    mongoose.Promise = Promise;

    await mongoose.connect(config.MONGO_URI);
    logger.success('Connected to MongoDB');
  } else {
    logger.info('MONGO_URI not set, skipping MongoDB connection');
  }
};

const createTempFolder = async () => {
  if (config.CLEAN_UP_TEMP_FOLDER && await fs.pathExists(config.TEMP_FOLDER_PATH)) await fs.remove(config.TEMP_FOLDER_PATH);

  await fs.ensureDir(config.TEMP_FOLDER_PATH);
  logger.success(`TEMP folder ready (cleanup: ${config.CLEAN_UP_TEMP_FOLDER})`);
}

module.exports = {
  connectToMongoDb,
  createTempFolder,
};
