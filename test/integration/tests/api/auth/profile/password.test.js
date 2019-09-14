const { expect, agent, moduleProxy, data } = require('../../../../index');
const { auth, User } = moduleProxy;

const url = '/api/auth/profile/password';

const patch = () => agent().patch(url);

describe(url, () => {
  beforeEach(async () => {
    await data.users.removeUsers();
  });

  describe('PATCH', () => {
    it('Should have status 401 if user is not signed in', async () => {
      const { status } = await patch().send();
      expect(status).to.equal(401);
    });

    it('Should have status 400 if required fields are missing', async () => {
      const existingUser = await data.users.createAndInsertFakeUser();
      const authHeaderString = await auth.createAuthorizationHeaderStringFromUser(existingUser);
      const { status } = await patch()
        .set(auth.HTTP_HEADER_NAME, authHeaderString)
        .send();

      expect(status).to.equal(400);
    });

    it('Should have status 200 and update the users password', async () => {
      const existingUser = await data.users.createAndInsertFakeUser();
      const { password: newPassword } = data.users.createFakeUser();
      const authHeaderString = await auth.createAuthorizationHeaderStringFromUser(existingUser);

      const { status } = await patch()
        .set(auth.HTTP_HEADER_NAME, authHeaderString)
        .send({ password: newPassword });

      const userInDbAfterUpdate = await User.findOne({ email: existingUser.email });

      expect(status).to.equal(200);
      expect(await auth.comparePasswords(newPassword, userInDbAfterUpdate.passwordHash)).to.be.true;
    });
  });
});
