const fs = require('fs').promises;
const path = require('path');
const User = require('../src/user');
const login = require('../src/auth');

const userFilePath = path.join(__dirname, '../data/users.json');

beforeEach(async () => {
  await User.ensureUserFileExists();
  await fs.writeFile(userFilePath, '[]');
});

describe('Authentication', () => {

    it ('should login with correct credentials' , async () =>{
        await User.createUser('Charlie' , 'Secret123');
        const result = await login ( 'Charlie' , 'Secret123');
        expect(result).toBe(true);

    });

    it ('should fail login with wrong password' , async () =>{
        await User.createUser('Dave' , 'JavaScript123');
        const result = await login ( 'Dave' , 'WrongPassword');
        expect(result).toEqual({error : 'Invalid password'});

    });

    it('should fail login with nonexistent user', async () => {
        const result = await login('Eve', 'DoesNotExist123');
        expect(result).toEqual({ error: 'User not found' });
      });

      
   
    
    it('should not allow login if username or password contains only spaces', async () => {
        const result = await login('   ', '   ');
        expect(result).toEqual({ error: 'User not found' });
      });

});
