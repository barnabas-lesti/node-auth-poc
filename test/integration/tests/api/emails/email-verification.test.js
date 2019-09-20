// const { expect, agent, moduleProxy, data } = require('../../../index');
// const { auth } = moduleProxy;

const url = '/api/emails/email-verification';

// const post = () => agent().post(url);

describe(url, () => {
  beforeEach(async () => {
    // await data.users.removeUsers();
  });

  describe('POST', () => {
    it('Should have status 401 if credentials are invalid', async () => {

    });
  });
});
