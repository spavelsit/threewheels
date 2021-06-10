const
  Workman         = require('../models/Workman'),
  error_handler = require('../common/utils/error_handler');

module.exports.all_workman = async (req, res) => {
    try {
    const workman = await Workman.find({})
    res.status(200).json(workman);
  } catch (e) {
    error_handler(res, e);
  }

};

module.exports.create_workman = async (req, res) => {
  try {
    const workman = await new Workman(req.body).save();

    res.status(201).json(workman);
  } catch (e) {
    error_handler(res, e);
  }
};

module.exports.update_workman = async (req, res) => {
  try {
    const workman = await Workman.findOneAndUpdate(
      {_id: req.params.id},
      {$set: req.body},
      {new: true}
    );

    res.status(202).json(workman);
  } catch (e) {
    error_handler(res, e)
  }
};

module.exports.remove_workman = async (req, res) => {
  try {
    await Workman.remove({_id: req.params.id});
    res.status(202).json({status: true});
  } catch (e) {
    error_handler(res, e);
  }
};