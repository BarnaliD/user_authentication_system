const fs = require('fs').promises; // Use promises for async file handling
const path = require('path');
const User = require('../src/user');
const userFilePath = path.join(__dirname, '../data/users.json');

beforeEach(async () => {
  // Reset users.json to a clean slate before each test
  await fs.writeFile(userFilePath, '[]');
});

describe('User management' , () => {

  it('should create a new user sucessfully', async () => {

    const user = await User.createUser('Jhon' , 'Password!123');
    expect(user).toHaveProperty('username' , 'Jhon');
    expect(user.password).not.toBe('Password!123');
    expect(user.password).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt hash format
  });

  it('should not allow duplicate username' , async () => {

    await User.createUser('Alice' , 'Password123');
    const result = await User.createUser('Alice' , 'Password123');
    expect(result).toEqual({ error: 'Username already exists' });
  });

  it('should validate password strength', () => {
    expect(User.validatePassword('short')).toBe(false);
    expect(User.validatePassword('weakpass1')).toBe(false);
    expect(User.validatePassword('StrongPass1')).toBe(true);
  });

  it('should reject user creation with a weak password', async () => {
    const result = await User.createUser('WeakUser', '123');
    expect(result).toHaveProperty('error', 'Password must be at least 8 characters, include a number and a capital letter');
  });

  it('should hash the same password differently for different users', async () => {
    const user1 = await User.createUser('User1', 'Password!123');
    const user2 = await User.createUser('User2', 'Password!123');
    expect(user1.password).not.toBe(user2.password);
  });
  
  
});