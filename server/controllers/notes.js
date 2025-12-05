const Note = require('../models/Note');
const Tag = require('../models/Tag');

exports.getNotes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;

  try {
    const notes = await Note.find({ user: req.user.id })
      .populate('tag')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotes = await Note.countDocuments({ user: req.user.id });
    const totalPages = Math.ceil(totalNotes / limit);

    res.json({
      notes,
      totalNotes,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createNote = async (req, res) => {
  const { title, content, tag } = req.body;

  try {
    let tagId = null;
    if (tag) {
      let tagDoc = await Tag.findOne({ name: tag, user: req.user.id });
      if (!tagDoc) {
        tagDoc = new Tag({ name: tag, user: req.user.id });
        await tagDoc.save();
      }
      tagId = tagDoc._id;
    }

    const newNote = new Note({
      title,
      content,
      tag: tagId,
      user: req.user.id,
    });

    const note = await newNote.save();
    await note.populate('tag');
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('tag');

    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    // Make sure user owns note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(note);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Note not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.updateNote = async (req, res) => {
  const { title, content, tag } = req.body;

  // Build note object
  const noteFields = {};
  if (title) noteFields.title = title;
  if (content) noteFields.content = content;

  try {
    if (tag) {
      let tagDoc = await Tag.findOne({ name: tag, user: req.user.id });
      if (!tagDoc) {
        tagDoc = new Tag({ name: tag, user: req.user.id });
        await tagDoc.save();
      }
      noteFields.tag = tagDoc._id;
    }

    let note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ msg: 'Note not found' });

    // Make sure user owns note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: noteFields },
      { new: true }
    ).populate('tag');

    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Note not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.searchNotes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;

  try {
    const query = req.query.q;
    const orConditions = [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
    ];

    if (query.toLowerCase().trim() === 'general') {
      orConditions.push({ tag: null });
    } else {
      const tag = await Tag.findOne({ user: req.user.id, name: { $regex: query, $options: 'i' } });
      if (tag) {
        orConditions.push({ tag: tag._id });
      }
    }

    const searchCriteria = {
      user: req.user.id,
      $or: orConditions,
    };

    const notes = await Note.find(searchCriteria)
      .populate('tag')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotes = await Note.countDocuments(searchCriteria);
    const totalPages = Math.ceil(totalNotes / limit);

    res.json({
      notes,
      totalNotes,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getTodaysNotes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;

  try {
    const start = new Date();
    const end = new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const searchCriteria = {
      user: req.user.id,
      createdAt: { $gte: start, $lt: end },
    };

    const notes = await Note.find(searchCriteria)
      .populate('tag')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotes = await Note.countDocuments(searchCriteria);
    const totalPages = Math.ceil(totalNotes / limit);

    res.json({
      notes,
      totalNotes,
      totalPages,
      currentPage: page,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getTodaysAllNotes = async (req, res) => {
  try {
    const start = new Date();
    const end = new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const notes = await Note.find({
      user: req.user.id,
      createdAt: { $gte: start, $lt: end },
    }).populate('tag').sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.searchAllNotes = async (req, res) => {
  try {
    const query = req.query.q;
    const orConditions = [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
    ];

    if (query.toLowerCase().trim() === 'general') {
      orConditions.push({ tag: null });
    } else {
      const tag = await Tag.findOne({ user: req.user.id, name: { $regex: query, $options: 'i' } });
      if (tag) {
        orConditions.push({ tag: tag._id });
      }
    }

    const searchCriteria = {
      user: req.user.id,
      $or: orConditions,
    };

    const notes = await Note.find(searchCriteria).populate('tag').sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).populate('tag').sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server. Error');
  }
};
