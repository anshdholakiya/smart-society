const { Notice } = require('../models');

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.findAll({ order: [['createdAt', 'DESC']] });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const notice = await Notice.create({ title, description, type });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: 'Error creating notice' });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await Notice.destroy({ where: { id } });
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notice' });
  }
};