const { expect, agent, moduleProxy, data } = require('../../../index');
const { auth } = moduleProxy;

const url = '/api/auth/sign-in';

const post = () => agent().post(url);

describe(url, () => {
  beforeEach(async () => {
    await data.users.removeUsers();
  });

  describe('POST', () => {
    it('Should have status 400 if required fields are missing', async () => {
      const { email, password } = data.users.createFakeUser();

      const [ noEmailResponse, noPasswordResponse ] = await Promise.all([
        post().send({ password }),
        post().send({ email }),
      ]);

      expect(noEmailResponse.status).to.equal(400);
      expect(noPasswordResponse.status).to.equal(400);
    });

    it('Should have status 401 if user was not found', async () => {
      const { email, password } = data.users.createFakeUser();
      const { status } = await post().send({ email, password });
      expect(status).to.equal(401);
    });

    it('Should have status 401 if credentials are invalid', async () => {
      const existingUser = await data.users.createAndInsertFakeUser();
      const nonExistingUser = data.users.createFakeUser();
      const { status } = await post().send({ email: existingUser.email, password: nonExistingUser.password });
      expect(status).to.equal(401);
    });

    it('Should have status 200 and "Authorization" header set if sign in was successful', async () => {
      const { email, password } = await data.users.createAndInsertFakeUser();
      const { status, headers } = await post().send({ email, password });

      const authHeader = headers[auth.HTTP_HEADER_NAME.toLowerCase()];
      const { payload } = await auth.verifyAuthorizationHeaderString(authHeader);
      expect(authHeader).to.be.a('string');
      expect(payload).not.to.be.undefined;
      expect(payload.email).equal(email);
      expect(status).to.equal(200);
    });
  });
});
