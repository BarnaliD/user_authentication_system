const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

// Define the file path to store users' data
const userFilePath = path.join(__dirname, '../data/users.json');

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  // Ensure the data directory and file exist
  static async ensureUserFileExists() {
    const dir = path.dirname(userFilePath);
    try {
      await fs.mkdir(dir, { recursive: true });
      try {
        await fs.access(userFilePath);
      } catch {
        await fs.writeFile(userFilePath, '[]', 'utf-8');
      }
    } catch (err) {
      console.error('Error ensuring user file exists:', err);
    }
  }

  static async getAllUsers() {
    try {
      await User.ensureUserFileExists();
      const raw = await fs.readFile(userFilePath, 'utf-8');
      if (!raw.trim()) return [];
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading users file:', err);
      return [];
    }
  }

  static async saveAllUsers(users) {
    try {
      await fs.writeFile(userFilePath, JSON.stringify(users, null, 2));
    } catch (err) {
      console.error('Error saving users file:', err);
    }
  }

  static async findUser(username) {
    const users = await User.getAllUsers();
    return users.find(u => u.username === username);
  }

  static async createUser(username, password) {
    username = username.trim();
    password = password.trim();

    const users = await User.getAllUsers();

    if (users.find(u => u.username === username)) {
      return { error: 'Username already exists' };
    }

    if (!User.validatePassword(password)) {
      return { error: 'Password must be at least 8 characters, include a number and a capital letter' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(username, hashedPassword);
    users.push(newUser);

    await User.saveAllUsers(users);
    return newUser;
  }

  static validatePassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  }

  static async authenticateUser(username, password) {
    const user = await User.findUser(username);
    if (!user) {
      return { error: 'User not found' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'Invalid password' };
    }

    return user;
  }
}

module.exports = User;
