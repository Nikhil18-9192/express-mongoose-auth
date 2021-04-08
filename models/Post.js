const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Posts', postSchema);
