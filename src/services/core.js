const fs = require('fs-extra');
const mongoose = require('mongoose');

const config = require('../common/config');
const logger = require('../common/logger');
const timer = require('../services/timer');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = Promise;

class Core {
  constructor () {
    this._mongoDbConnection = null;
  }

  async connectToMongoDb () {
    const timerInstance = timer.createTimer();

    const mongoUri = config.MONGO_URI || await this._createInMemoryMongoDb();
    const { connection } = await mongoose.connect(mongoUri);
    this._mongoDbConnection = connection;

    if (config.MONGO_URI) logger.info(`Connected to MongoDB (${timerInstance.finish()}ms)`);
    else logger.warn(`MONGO_URI not set, initialized and connected to In-Memory MongoDB (${timerInstance.finish()}ms)`);
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

  async _createInMemoryMongoDb () {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const inMemoryMongoDb = new MongoMemoryServer();
    const inMemoryMongoUri = await inMemoryMongoDb.getConnectionString();
    return inMemoryMongoUri;
  }
}

module.exports = new Core();
