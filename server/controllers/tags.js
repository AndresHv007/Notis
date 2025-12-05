const Tag = require('../models/Tag');

exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find({ user: req.user.id }).sort({ name: 1 });
    res.json(tags);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createTag = async (req, res) => {
  const { name } = req.body;

  if (name.includes(' ')) {
    return res.status(400).json({ msg: 'Tag names cannot contain spaces' });
  }

  try {
    const newTag = new Tag({
      name,
      user: req.user.id,
    });

    const tag = await newTag.save();
    res.json(tag);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Tag already exists' });
    }
    res.status(500).send('Server Error');
  }
};

exports.deleteTag = async (req, res) => {
  try {
    let tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ msg: 'Tag not found' });
    }

    // Make sure user owns tag
    if (tag.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Tag.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Tag removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tag not found' });
    }
    res.status(500).send('Server Error');
  }
};
