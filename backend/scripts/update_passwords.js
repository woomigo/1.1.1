const bcrypt = require('bcrypt');
const fs = require('fs');

const password = 'abcd1234';
const saltRounds = 10;
const numUsers = 20; // Assuming users have IDs 1 to 20

(async () => {
  const lines = [];

  for (let id = 1; id <= numUsers; id++) {
    const hash = await bcrypt.hash(password, saltRounds);
    lines.push(`UPDATE users SET password = '${hash}' WHERE id = ${id};`);
  }

  fs.writeFileSync('update_passwords.sql', lines.join('\n'));
  console.log('✅ SQL update script saved to update_passwords.sql');
})();
