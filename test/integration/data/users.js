const faker = require('faker');
const { User, auth } = require('../module-proxy');

const createFakeUser = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  fullName: faker.name.findName(),
});

const createAndInsertFakeUser = async () => {
  const user = createFakeUser();
  await User.create({
    passwordHash: await auth.hashPassword(user.password),
    ...user,
  });
  return user;
};

const removeUsers = async (query = {}) => await User.deleteMany(query);

module.exports = {
  createFakeUser,
  createAndInsertFakeUser,
  removeUsers,
};
