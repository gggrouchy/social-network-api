const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  
  // Get a single thought by its ID
  getThoughtById(req, res) {
    Thought.findById(req.params.id)
      .then((thought) => thought ? res.json(thought) : res.status(404).json({ message: 'No thought found with this ID' }))
      .catch((err) => res.status(500).json(err));
  },

  // Create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findByIdAndUpdate(
          req.body.userId,
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) => user ? res.json({ message: 'Thought created!' }) : res.status(404).json({ message: 'Thought created, but user not found' }))
      .catch((err) => res.status(500).json(err));
  },

  // Update a thought by its ID
  updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then((thought) => thought ? res.json(thought) : res.status(404).json({ message: 'No thought found with this ID' }))
      .catch((err) => res.status(500).json(err));
  },

  // Delete a thought by its ID
  deleteThought(req, res) {
    Thought.findByIdAndDelete(req.params.id)
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with this ID' });
        }
        // Remove thought from user's thoughts array
        return User.findByIdAndUpdate(
          thought.username,
          { $pull: { thoughts: req.params.id } },
          { new: true }
        );
      })
      .then(() => res.json({ message: 'Thought deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .then((thought) => thought ? res.json(thought) : res.status(404).json({ message: 'No thought found with this ID' }))
      .catch((err) => res.status(500).json(err));
  },

  // Remove a reaction by reactionId
  removeReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.id,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((thought) => thought ? res.json(thought) : res.status(404).json({ message: 'No thought found with this ID' }))
      .catch((err) => res.status(500).json(err));
  },
};
