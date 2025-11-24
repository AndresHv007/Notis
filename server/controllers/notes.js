const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;

  try {
    const notes = await Note.find({ user: req.user.id })
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
  const { title, content, tags } = req.body;

  try {
    const newNote = new Note({
      title,
      content,
      tags,
      user: req.user.id,
    });

    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

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
  const { title, content, tags } = req.body;

  // Build note object
  const noteFields = {};
  if (title) noteFields.title = title;
  if (content) noteFields.content = content;
  if (tags) noteFields.tags = tags;

  try {
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
    );

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
    const searchCriteria = {
      user: req.user.id,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ],
    };

    const notes = await Note.find(searchCriteria)
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

    start.setHours(0, 0, 0, 0);



    const end = new Date();

    end.setHours(23, 59, 59, 999);



    const searchCriteria = {

      user: req.user.id,

      createdAt: { $gte: start, $lt: end },

    };



    const notes = await Note.find(searchCriteria)

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
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const notes = await Note.find({
      user: req.user.id,
      createdAt: { $gte: start, $lt: end },
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.searchAllNotes = async (req, res) => {
  try {
    const query = req.query.q;
    const notes = await Note.find({
      user: req.user.id,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
