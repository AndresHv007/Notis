const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getTags,
  createTag,
  deleteTag,
} = require('../controllers/tags');

// @route   GET api/tags
// @desc    Get all user tags
// @access  Private
router.get('/', auth, getTags);

// @route   POST api/tags
// @desc    Create a tag
// @access  Private
router.post('/', auth, createTag);

// @route   DELETE api/tags/:id
// @desc    Delete a tag
// @access  Private
router.delete('/:id', auth, deleteTag);

module.exports = router;
