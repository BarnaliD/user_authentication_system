const fs = require('fs').promises;
const path = require('path');
const User = require('../src/user');
const changePassword = require('../src/password');

const userFilePath = path.join(__dirname, '../data/users.json');

beforeEach(async () => {
  await fs.writeFile(userFilePath, '[]');
});

describe('Change Password', () => {

  it('should change the password successfully', async () => {
    await User.createUser('Frank', 'FirstPass123');
    const result = await changePassword('Frank', 'FirstPass123', 'SecondPass123');
    expect(result).toHaveProperty('username', 'Frank');
  });

  it('should reject incorrect old password', async () => {
    await User.createUser('Grace', 'RightOne123');
    const result = await changePassword('Grace', 'WrongOne123', 'SomethingNew123');
    expect(result).toBe('Old password is incorrect');

    
  });

  it('should reject weak new password', async () => {
    await User.createUser('Hank', 'GoodPass123');
    const result = await changePassword('Hank', 'GoodPass123', 'weak');
    expect(result).toBe('New password does not meet security requirements');
  });

  it('should reject non-existent user', async () => {
    const result = await changePassword('NonExistentUser', 'OldPass123', 'NewPass123');
    expect(result).toBe('User not found');
  });

  
});
