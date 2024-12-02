const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
  getUsers(req, res) {
    User.find()
      .then(users => res.json(users))
      .catch(err => res.status(500).json(err));
  },
  getUserById(req, res) {
    User.findById(req.params.id)
      .populate('thoughts')
      .populate('friends')
      .then(user => user ? res.json(user) : res.status(404).json({ message: 'No user found with this ID' }))
      .catch(err => res.status(500).json(err));
  },
  createUser(req, res) {
    User.create(req.body)
      .then(user => res.json(user))
      .catch(err => res.status(500).json(err));
  },
  updateUser(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then(user => user ? res.json(user) : res.status(404).json({ message: 'No user found with this ID' }))
      .catch(err => res.status(500).json(err));
  },
  deleteUser(req, res) {
    User.findByIdAndDelete(req.params.id)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'No user found with this ID' });
        }
        // Delete user's thoughts
        return Thought.deleteMany({ _id: { $in: user.thoughts } });
      })
      .then(() => res.json({ message: 'User and thoughts deleted!' }))
      .catch(err => res.status(500).json(err));
  },
  addFriend(req, res) {
    User.findByIdAndUpdate(req.params.id, { $addToSet: { friends: req.params.friendId } }, { new: true })
      .then(user => user ? res.json(user) : res.status(404).json({ message: 'No user found with this ID' }))
      .catch(err => res.status(500).json(err));
  },
  removeFriend(req, res) {
    User.findByIdAndUpdate(req.params.id, { $pull: { friends: req.params.friendId } }, { new: true })
      .then(user => user ? res.json(user) : res.status(404).json({ message: 'No user found with this ID' }))
      .catch(err => res.status(500).json(err));
  },
};
