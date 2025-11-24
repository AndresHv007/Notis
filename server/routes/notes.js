const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  searchNotes,
  getTodaysNotes,
  getAllNotes,
  searchAllNotes,
  getTodaysAllNotes,
} = require('../controllers/notes');

router.get('/all', auth, getAllNotes);
router.get('/search/all', auth, searchAllNotes);
router.get('/today/all', auth, getTodaysAllNotes);
router.get('/today', auth, getTodaysNotes);
router.get('/search', auth, searchNotes);

// @route   GET api/notes
// @desc    Get all user notes
// @access  Private
router.get('/', auth, getNotes);

// @route   POST api/notes
// @desc    Create a note
// @access  Private
router.post('/', auth, createNote);

// @route   GET api/notes/:id
// @desc    Get note by ID
// @access  Private
router.get('/:id', auth, getNoteById);

// @route   PUT api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', auth, updateNote);

// @route   DELETE api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', auth, deleteNote);

module.exports = router;
