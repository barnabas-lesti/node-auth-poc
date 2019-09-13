const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const expect = chai.expect;
chai.use(chaiHttp);

const moduleProxy = require('./module-proxy');
const mock = require('./mock');

const app = require('../../src/app');
const agent = () => chai.request(app);

module.exports = {
  faker,
  expect,
  agent,
  mock,
  moduleProxy,
};
