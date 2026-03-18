import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const usersFilePath = path.join(__dirname, 'prisma', 'seedData', 'users.json');

async function hashPasswords() {
  const usersJsonString = fs.readFileSync(usersFilePath, 'utf-8');
  const users = JSON.parse(usersJsonString);

  const hashedUsers = await Promise.all(
    users.map(async (user: any) => {
      // Create a default password 'password123' for all seeded users
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      return {
        ...user,
        password: hashedPassword,
      };
    })
  );

  fs.writeFileSync(usersFilePath, JSON.stringify(hashedUsers, null, 2), 'utf-8');
  console.log('Successfully hashed all passwords in users.json');
}

hashPasswords();
