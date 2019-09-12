const { agent, getUrl, moduleProxy, expect, faker } = require('../../resources');

const { config, User, auth } = moduleProxy;

const url = getUrl(__filename);
const post = () => agent().post(url);

describe(url, () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST', () => {
    it('Response should have status 501 if registration is disabled', async () => {
      const originalConfigValue = config.AUTH_REGISTRATION_DISABLED;
      config.AUTH_REGISTRATION_DISABLED = true;

      const { status } = await post().send({});
      config.AUTH_REGISTRATION_DISABLED = originalConfigValue;

      expect(status).to.equal(501);
    });

    it('Response should have status 400 if required fields are missing', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const fullName = faker.name.findName();

      const [ noEmailResponse, noPasswordResponse, noFullNameResponse ] = await Promise.all([
        post().send({ password, fullName }),
        post().send({ email, fullName }),
        post().send({ email, password }),
      ]);

      expect(noEmailResponse.status).to.equal(400);
      expect(noPasswordResponse.status).to.equal(400);
      expect(noFullNameResponse.status).to.equal(400);
    });

    it('Response should have status 409 if "email" is already in use', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const fullName = faker.name.findName();

      const passwordHash = await auth.hashPassword(password);
      await User.create({ email, passwordHash, fullName });

      const { status } = await post().send({ email, password, fullName });

      expect(status).to.equal(409);
    });

    it('Response should have status 200 if registration was successful', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const fullName = faker.name.findName();

      const { status } = await post().send({ email, password, fullName });

      expect(status).to.equal(200);
    });
  });
});
