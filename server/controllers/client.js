const
  Client         = require('../models/Client'),
  error_handler = require('../common/utils/error_handler');

module.exports.all_client = async (req, res) => {
    try {
    const client = await Client.find({})
    res.status(200).json(client);
  } catch (e) {
    error_handler(res, e);
  }

};

module.exports.create_client = async (req, res) => {
  try {
    const client = await new Client(req.body).save();

    res.status(201).json(client);
  } catch (e) {
    error_handler(res, e);
  }
};

module.exports.update_client = async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      {_id: req.params.id},
      {$set: req.body},
      {new: true}
    );

    res.status(202).json(client);
  } catch (e) {
    error_handler(res, e)
  }
};

module.exports.remove_client = async (req, res) => {
  try {
    await Client.remove({_id: req.params.id});
    res.status(202).json({status: true});
  } catch (e) {
    error_handler(res, e);
  }
};