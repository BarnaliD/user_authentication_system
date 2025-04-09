const User = require('./user');

/**
 * Authenticates a user using async bcrypt comparison.
 * 
 * @param {string} username - The user's username.
 * @param {string} password - The plaintext password to check.
 * @returns {Promise<true | { error: string }>} - True if login is successful, otherwise an error object.
 */
async function login(username, password) {
  // Delegate to the new async authentication method in the User class
  const result = await User.authenticateUser(username, password);

  if (result.error) {
    return { error: result.error };
  }

  return true;
}

module.exports = login;
