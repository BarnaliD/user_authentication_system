const readline = require('readline');
const User = require('./user');
const login = require('./auth');
const changePassword = require('./password');


// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper to prompt for input with a promise
const prompt = (query) => new Promise(resolve => rl.question(query, resolve));

// Show menu options
function showMenu() {
  console.log('\n===== USER MENU =====');
  console.log('1. Login');
  console.log('2. Create User');
  console.log('3. Change Password');
  console.log('4. Exit');
}

async function handleMenu() {
  showMenu();
  const choice = await prompt('Choose an option (1-4): ');

  switch (choice.trim()) {
    case '1': {
      const username = await prompt('Username: ');
      const password = await prompt('Password: ');
      const result = await login(username, password);

      if (result === true) {
        console.log('✅ Login successful!');
      } else {
        console.log('❌ ' + result.error);
      }
      break;
    }

    case '2': {
      const username = await prompt('New username: ');
      const password = await prompt('New password: ');
      const result = await User.createUser(username, password);

      if (result.error) {
        console.log('❌ ' + result.error);
      } else {
        console.log('✅ User created successfully!');
      }
      break;
    }

    case '3': {
      const username = await prompt('Username: ');
      const oldPassword = await prompt('Old password: ');
      const newPassword = await prompt('New password: ');
      const result = await changePassword(username, oldPassword, newPassword);

      if (typeof result === 'string') {
        console.log('❌ ' + result);
      } else {
        console.log('✅ Password changed successfully!');
      }
      break;
    }

    case '4':
      console.log('👋 Exiting...');
      rl.close();
      return;

    default:
      console.log('⚠️ Invalid choice, try again.');
  }

  handleMenu(); // Loop again
}

handleMenu(); // Start CLI
