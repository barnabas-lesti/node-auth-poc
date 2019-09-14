const { expect, agent, moduleProxy, data } = require('../../../index');
const { config } = moduleProxy;

const url = '/api/auth/register';

const post = () => agent().post(url);

describe(url, () => {
  beforeEach(async () => {
    await data.users.removeUsers();
  });

  describe('POST', () => {
    it('Should have status 501 if registration is disabled', async () => {
      const originalConfigValue = config.AUTH_REGISTRATION_DISABLED;
      config.AUTH_REGISTRATION_DISABLED = true;

      const { status } = await post().send({});
      config.AUTH_REGISTRATION_DISABLED = originalConfigValue;

      expect(status).to.equal(501);
    });

    it('Should have status 400 if required fields are missing', async () => {
      const { email, password, fullName } = data.users.createFakeUser();

      const [ noEmailResponse, noPasswordResponse, noFullNameResponse ] = await Promise.all([
        post().send({ password, fullName }),
        post().send({ email, fullName }),
        post().send({ email, password }),
      ]);

      expect(noEmailResponse.status).to.equal(400);
      expect(noPasswordResponse.status).to.equal(400);
      expect(noFullNameResponse.status).to.equal(400);
    });

    it('Should have status 409 if "email" is already in use', async () => {
      const { email, password, fullName } = await data.users.createAndInsertFakeUser();
      const { status } = await post().send({ email, password, fullName });
      expect(status).to.equal(409);
    });

    it('Should have status 200 if registration was successful', async () => {
      const { email, password, fullName } = data.users.createFakeUser();
      const { status } = await post().send({ email, password, fullName });
      expect(status).to.equal(200);
    });
  });
});
