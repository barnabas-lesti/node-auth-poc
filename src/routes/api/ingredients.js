const { Types } = require('mongoose');

const Ingredient = require('../models/ingredient');

module.exports = (router) => {
  router.route('/ingredients')
    .get(async (req, res) => {
      const { search } = req.query;
      const query = {};
      if (search) query['content.name'] = new RegExp(search.split(',').map(fragment => fragment.trim()).join('|'), 'i');

      const docs = await Ingredient.find(query).populate('creator', '_id, fullName');
      return res.send(docs);
    })
    .put(async (req, res) => {
      if (!req.user) return res.sendStatus(401);

      const { content = {} } = req.body;
      if (!content.name) return res.sendStatus(400);

      const { _id } = await Ingredient.create({ ...req.body, creator: { _id: req.user._id } });
      const doc = await Ingredient.findById(_id).populate('creator', '_id, fullName');
      return res.send(doc);
    });

  router.route('/ingredients/:_id')
    .get(async (req, res) => {
      const { _id } = req.params;
      if (!Types.ObjectId.isValid(_id)) return res.sendStatus(404);

      const doc = await Ingredient.findById(_id).populate('creator', '_id, fullName');
      if (!doc) return res.sendStatus(404);

      return res.send(doc);
    })
    .patch(async (req, res) => {
      const { user, params: { _id } } = req;
      if (!user) return res.sendStatus(401);

      if (!Types.ObjectId.isValid(_id)) return res.sendStatus(404);

      const doc = await Ingredient.findById(_id);
      if (!doc) return res.sendStatus(404);

      if (`${doc.creator._id}` !== user._id) return res.sendStatus(403);

      const { creator, ...skeleton } = req.body;
      await Ingredient.findOneAndUpdate({ _id }, skeleton);
      return res.sendStatus(200);
    })
    .delete(async (req, res) => {
      const { user, params: { _id } } = req;
      if (!user) return res.sendStatus(401);

      if (!Types.ObjectId.isValid(_id)) return res.sendStatus(404);

      const doc = await Ingredient.findById(_id);
      if (!doc) return res.sendStatus(404);

      if (`${doc.creator._id}` !== user._id) return res.sendStatus(403);

      await Ingredient.deleteOne({ _id });
      return res.sendStatus(200);
    });

  return router;
};
