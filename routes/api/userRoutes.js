const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require('../../controllers/userController');

// GET all users and POST a new user
router.route('/').get(getUsers).post(createUser);

// GET one user, PUT to update, DELETE to remove
router.route('/:id').get(getSingleUser).put(updateUser).delete(deleteUser);

// POST to add a friend, DELETE to remove a friend
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;

