const { agent, moduleProxy, expect, faker, methods } = require('../../resources');

const { User, auth } = moduleProxy;

const url = '/api/auth/profile';

describe(url, () => {
  let authHeaderString = null;
  let createdUser = null;

  beforeEach(async () => {
    await User.deleteMany({});
    createdUser = await methods.createUser();
    authHeaderString = ;
  });

  describe('GET', () => {
    const get = () => agent().get(url);
    const getWithAuth = () => getWithoutAuth().set('Authorization', authHeaderString);

    it('Should have status 401 if user is not signed in', async () => {
      const { status } = await get().send({});
      expect(status).to.equal(401);
    });

    it('Should have status 404 if user was not found', async () => {
      const { status } = await get()
        .set('Authorization', await auth.createAuthorizationHeaderStringFromUser(createdUser));
    });

    it('Should have status 200 and return the requested user object', async () => {
      const { status } = await getWithAuth().send({});
      expect(status).to.equal(200);
    });
  });

  describe('PATCH', () => {
    const patchWithoutAuth = () => agent().patch(url);
    const patchWithAuth = () => patchWithoutAuth().set('Authorization', authHeaderString);

    it('Should have status 401 if user is not signed in', async () => {});
    it('Should have status 400 if user was not found', async () => {});
    it('Should have status 404 if user was not found', async () => {});
    it('Should have status 200 and update the user in the database', async () => {});
  });
});
