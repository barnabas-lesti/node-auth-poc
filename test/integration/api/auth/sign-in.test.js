const { agent, getUrl, moduleProxy, expect, faker } = require('../../resources');

const { User, auth } = moduleProxy;

const url = getUrl(__filename);
const post = () => agent().post(url);
const createUser = async () => {
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
};

describe(url, () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST', () => {
    it('Response should have status 400 if required fields are missing', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      const [ noEmailResponse, noPasswordResponse ] = await Promise.all([
        post().send({ password }),
        post().send({ email }),
      ]);

      expect(noEmailResponse.status).to.equal(400);
      expect(noPasswordResponse.status).to.equal(400);
    });

    it('Response should have status 401 if user was not found', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      const { status } = await post().send({ email, password });

      expect(status).to.equal(401);
    });

    it('Response should have status 401 if credentials are invalid', async () => {
      const { email } = await createUser();
      const invalidPassword = faker.internet.password();

      const { status } = await post().send({ email, password: invalidPassword });

      expect(status).to.equal(401);
    });

    it('Response should have status 200 and "Authorization" header set if sign in was successful', async () => {
      const { email, password } = await createUser();

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
