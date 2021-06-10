const
  Callback      = require('../models/Callback'),
  error_handler = require('../common/utils/error_handler');

module.exports.all_callback = async (req, res) => {
  try {
    const callback = await Callback.find().sort({date: -1});
    res.status(200).json(callback);
  } catch (e) {
    error_handler(res, e)
  }
};

module.exports.create_callback = async (req, res) => {
  try {
    await new Callback({name: req.body.name, phone: req.body.phone});
    res.status(201);
  } catch (e) {
    error_handler(res, e)
  }
};

module.exports.update_callback = async (req, res) => {
  try {
    const callback = await Callback.findOneAndUpdate(
      {_id: req.params.id},
      {$set: req.body},
      {new: true},
    );

    res.status(202).json(callback);
  } catch (e) {

  }
};