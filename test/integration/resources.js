const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const expect = chai.expect;

const app = require('../../src/app');

chai.use(chaiHttp);

const config = require('../../src/common/config');
const User = require('../../src/models/user');
const auth = require('../../src/services/auth');

const moduleProxy = {
  config,
  User,
  auth,
};

const agent = () => chai.request(app);

const methods = {
  async createUser () {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const fullName = faker.name.findName();

    const passwordHash = await auth.hashPassword(password);
    await User.create({ email, passwordHash, fullName });

    return {
      email,
      password,
      fullName,
    };
  },
};

module.exports = {
  agent,
  moduleProxy,
  expect,
  methods,
  faker,
};
