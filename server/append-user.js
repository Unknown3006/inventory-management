const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

async function injectUser() {
  const usersPath = path.join(__dirname, 'prisma', 'seedData', 'users.json');
  const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

  // Check if pushkar is already in there
  const existing = usersData.find(u => u.email === "pushkar@gmail.com");
  if (existing) {
    console.log("Pushkar already exists.");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Pushkar@123', salt);

  usersData.push({
    userId: "d4b1a41a-96e0-47b8-a764-5a67c4e57b98",
    name: "Pushkar",
    email: "pushkar@gmail.com",
    password: hashedPassword,
  });

  fs.writeFileSync(usersPath, JSON.stringify(usersData, null, 2));
  console.log("Appended Pushkar to users.json successfully!");
}

injectUser().catch(console.error);
