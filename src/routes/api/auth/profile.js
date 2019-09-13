const User = require('../../../models/user');

module.exports = {
  async get (req, res) {
    if (!req.user) return res.sendStatus(401);

    const { email } = req.user;
    const result = await User.findOne({ email });
    if (!result) return res.sendStatus(404);

    const { passwordHash, ...user } = result;
    return res.send(user);
  },

  async patch (req, res) {
    if (!req.user) return res.sendStatus(401);

    const { email } = req.user;
    const update = req.body;
    const { passwordHash, ...updatedUser } = await User.update({ email }, update);

    return res.send(updatedUser);
  },
};
