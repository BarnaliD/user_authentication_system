const User = require('./user');
const bcrypt = require('bcrypt');

/**
 * Changes a user's password with proper validation and hashing.
 *
 * @param {string} username - The user's username.
 * @param {string} oldPassword - The user's current password (plaintext).
 * @param {string} newPassword - The new password (plaintext).
 * @returns {Promise<object|string>} - The updated user or an error message.
 */
async function changePassword(username, oldPassword, newPassword) {
  const users = await User.getAllUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return 'User not found';
  }

  const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordCorrect) {
    return 'Old password is incorrect';
  }

  if (oldPassword === newPassword) {
    return 'New password must be different from old password';
  }

  if (!User.validatePassword(newPassword)) {
    return 'New password does not meet security requirements';
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;

  await User.saveAllUsers(users);

  return user;
}

module.exports = changePassword;
