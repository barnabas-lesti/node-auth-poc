const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const expect = chai.expect;

const app = require('../../src/app');

const moduleProxy = {
  config: require('../../src/common/config'),
  User: require('../../src/models/user'),
  auth: require('../../src/services/auth'),
};

chai.use(chaiHttp);

const agent = () => chai.request(app);
const getUrl = (filename) => filename
  .replace(__dirname, '')
  .replace('.test.js', '')
  .replace(/\\/g, '/');

module.exports = {
  agent,
  getUrl,
  moduleProxy,
  expect,
  faker,
};
