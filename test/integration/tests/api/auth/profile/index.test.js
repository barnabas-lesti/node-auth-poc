const { expect, agent, moduleProxy, data } = require('../../../../index');
const { auth, User } = moduleProxy;

const url = '/api/auth/profile';

const get = () => agent().get(url);
const patch = () => agent().patch(url);

describe(url, () => {
  beforeEach(async () => {
    await data.users.removeUsers();
  });

  describe('GET', () => {
    it('Should have status 401 if user is not signed in', async () => {
      const { status } = await get().send();
      expect(status).to.equal(401);
    });

    it('Should have status 200 and return the signed in user object with the appropriate fields', async () => {
      const existingUser = await data.users.createAndInsertFakeUser();
      const authHeaderString = await auth.createAuthorizationHeaderStringFromUser(existingUser);
      const { status, body: user } = await get().set(auth.HTTP_HEADER_NAME, authHeaderString).send();

      expect(status).to.equal(200);

      expect(user).not.to.be.undefined;
      expect(user.passwordHash).to.be.undefined;
      expect(user.userId).not.to.be.undefined;
      expect(user.email).equal(existingUser.email);
      expect(user.fullName).equal(existingUser.fullName);
    });
  });

  describe('PATCH', () => {
    it('Should have status 401 if user is not signed in', async () => {
      const { status } = await patch().send();
      expect(status).to.equal(401);
    });

    it('Should have status 200, update and return the user object with the appropriate fields', async () => {
      const existingUser = await data.users.createAndInsertFakeUser();
      const userInDbBeforeUpdate = await User.findOne({ email: existingUser.email });
      const userUpdate = data.users.createFakeUser();
      const authHeaderString = await auth.createAuthorizationHeaderStringFromUser(existingUser);

      const { status, body } = await patch()
        .set(auth.HTTP_HEADER_NAME, authHeaderString)
        .send(userUpdate);

      const userInDbAfterUpdate = await User.findOne({ email: existingUser.email });

      expect(status).to.equal(200);

      expect(body).not.to.be.undefined;
      expect(body.passwordHash).to.be.undefined;
      expect(body.userId).equal(userInDbBeforeUpdate.userId);
      expect(body.email).equal(existingUser.email);
      expect(body.fullName).equal(userUpdate.fullName);

      expect(userInDbBeforeUpdate.userId).equal(userInDbAfterUpdate.userId);
      expect(userInDbBeforeUpdate.passwordHash).equal(userInDbAfterUpdate.passwordHash);
    });
  });
});
