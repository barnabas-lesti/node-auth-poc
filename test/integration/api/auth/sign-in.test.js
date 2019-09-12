const { agent, moduleProxy, expect, faker, methods } = require('../../resources');

const { User, auth } = moduleProxy;

const url = '/api/auth/sign-in';

describe(url, () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST', () => {
    const post = () => agent().post(url);

    it('Should have status 400 if required fields are missing', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      const [ noEmailResponse, noPasswordResponse ] = await Promise.all([
        post().send({ password }),
        post().send({ email }),
      ]);

      expect(noEmailResponse.status).to.equal(400);
      expect(noPasswordResponse.status).to.equal(400);
    });

    it('Should have status 401 if user was not found', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      const { status } = await post().send({ email, password });

      expect(status).to.equal(401);
    });

    it('Should have status 401 if credentials are invalid', async () => {
      const { email } = await methods.createUser();
      const invalidPassword = faker.internet.password();

      const { status } = await post().send({ email, password: invalidPassword });

      expect(status).to.equal(401);
    });

    it('Should have status 200 and "Authorization" header set if sign in was successful', async () => {
      const { email, password } = await methods.createUser();

      const { status, headers } = await post().send({ email, password });

      const authHeader = headers.authorization;
      const { payload } = await auth.verifyAuthorizationHeaderString(authHeader);
      expect(authHeader).to.be.a('string');
      expect(payload).not.to.be.undefined;
      expect(payload.email).equal(email);
      expect(status).to.equal(200);
    });
  });
});
