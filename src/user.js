const fs = require('fs').promises; // Use promises for async file handling
const path = require('path');
const bcrypt = require('bcrypt'); // Password hashing library

// Define the file path to store users' data
const userFilePath = path.join(__dirname, '../data/users.json');

class User {
  // Constructor to create a new user instance
  constructor(username, password) {
    this.username = username;
    this.password = password; // Store the hashed password
  }

  // Static method to get all users from the JSON file (Async)
  static async getAllUsers() {
    try {
      // If file doesn't exist, return an empty array
      if (!await User.fileExists(userFilePath)) return [];
      
      // Read the file asynchronously
      const raw = await fs.readFile(userFilePath, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading users file:', err);
      return [];
    }
  }

  // Static method to check if file exists
  static async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  // Static method to save all users to the JSON file (Async)
  static async saveAllUsers(users) {
    try {
      // Write users to the file asynchronously
      await fs.writeFile(userFilePath, JSON.stringify(users, null, 2));
    } catch (err) {
      console.error('Error saving users file:', err);
    }
  }

  // Static method to find a user by username
  static async findUser(username) {
    const users = await User.getAllUsers();
    return users.find(u => u.username === username);
  }

  // Static method to create a new user (including password validation and hashing)
  static async createUser(username, password) {
    username = username.trim(); // Sanitize username input
    password = password.trim(); // Sanitize password input

    const users = await User.getAllUsers();

    // Check if username already exists
    if (users.find(u => u.username === username)) {
      return { error: 'Username already exists' };
    }

    // Validate password strength
    if (!User.validatePassword(password)) {
      return { error: 'Password must be at least 8 characters, include a number and a capital letter' };
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User(username, hashedPassword);
    users.push(newUser);

    // Save the new list of users
    await User.saveAllUsers(users);

    return newUser;
  }

  // Static method to validate password strength (at least 8 characters, one number, one capital letter)
  static validatePassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  }

  // Static method to authenticate a user (compare provided password with the stored hashed password)
  static async authenticateUser(username, password) {
    const user = await User.findUser(username);

    if (!user) {
      return { error: 'User not found' };
    }

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'Invalid password' };
    }

    return user;
  }
}

module.exports = User;
