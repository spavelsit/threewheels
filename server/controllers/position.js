const
  Position      = require('../models/Position'),
  error_handler = require('../common/utils/error_handler');

module.exports.all_positions = async (req, res) => {
  const query = {};

  if (req.query.name) query.name = req.query.name;
  if (req.query.article) query.article = req.query.article;

  query.type = req.params.type;

  try {
    const positions = await Position.find(query).sort({quantity: -1}).skip(+req.query.offset).limit(+req.query.limit);
    res.status(200).json(positions);
  } catch (e) {
    error_handler(res, e);
  }
};

module.exports.create_position = async (req, res) => {
  try {
    const position = await new Position({
      name: req.body.name,
      article: req.body.article,
      cost: req.body.cost,
      orderCost: req.body.orderCost,
      quantity: req.body.quantity,
      type: req.body.type,
    }).save();

    res.status(201).json(position)
  } catch (e) {
    error_handler(res, e)
  }
};

module.exports.remove_position = async (req, res) => {
  try {
    await Position.remove({_id: req.params.id});
    res.status(202);
  } catch (e) {
    error_handler(res, e)
  }
};

module.exports.update_position = async (req, res) => {
  try {
    const position = await Position.findOneAndUpdate(
      {_id: req.params.id},
      {$set: req.body},
      {new: true}
    );

    res.status(202).json(position);
  } catch (e) {
    error_handler(res, e);
  }
};

module.exports.update_quantity_position = async (req, res) => {
  try {
    await Position.findOneAndUpdate(
      {_id: req.params.id},
      {$inc: {quantity: 1}},
      {new: true},
    );

    res.status(202);
  } catch (e) {
    error_handler(res, e);
  }
};

module.exports.qr_code_position = async (req, res) => {
  try {
    const position = await Position.findOne({_id: req.params.id});
    res.status(200).json(position);
  } catch (e) {
    error_handler(res, e);
  }
};

module.exports.search_positions = async (req, res) => {
  try {
    const positions = await Position.find(
      {$or: [
          {name: {$regex: req.query.text, $options: 'i'}},
          {article: {$regex: req.query.text,  $options: 'i'}},
        ]}
    ).limit(10);
    res.status(200).json(positions);
  } catch (e) {
    error_handler(res, e);
  }
};