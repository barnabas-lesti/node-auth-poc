const { expect, agent, moduleProxy, methods } = require('../../index');
const { auth } = moduleProxy;

const url = '/api/auth/profile';

const get = () => agent().get(url);
const patch = () => agent().patch(url);

let existingUser;

describe(url, () => {
  beforeEach(async () => {
    await methods.removeUsers();
    existingUser = await methods.createAndInsertFakeUser();
  });

  describe('GET', () => {
    it('Should have status 401 if user is not signed in', async () => {
      const { status } = await get().send();
      expect(status).to.equal(401);
    });

    it('Should have status 200 and return the signed in user', async () => {
      const authHeaderString = await auth.createAuthorizationHeaderStringFromUser(existingUser);
      const { status, body } = await get().set(auth.HTTP_HEADER_NAME, authHeaderString).send();
      expect(status).to.equal(200);
      expect(body).not.to.be.undefined;
      expect(body.passwordHash).to.be.undefined;
      expect(body.email).equal(existingUser.email);
    });
  });

  describe('PATCH', () => {
    it('Should have status 401 if user is not signed in', async () => {
      const { status } = await patch().send();
      expect(status).to.equal(401);
    });

    it('Should have status 200 and update the user', async () => {
      const userUpdate = methods.createFakeUser();

      const authHeaderString = await auth.createAuthorizationHeaderStringFromUser(existingUser);
      const { status, body } = await patch()
        .set(auth.HTTP_HEADER_NAME, authHeaderString)
        .send({
          fullName: userUpdate.fullName,
        });

      expect(status).to.equal(200);
      expect(body).not.to.be.undefined;
      expect(body.passwordHash).to.be.undefined;
      expect(body.email).equal(existingUser.email);
      expect(body.fullName).equal(userUpdate.fullName);
    });
  });
});
