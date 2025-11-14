// Standalone seeding script (no Next.js server required)
// Usage:
//   1) Ensure MONGODB_URI is set in your environment or .env
//   2) Run: node scripts/seed-admin.js

const crypto = require('crypto');
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/patel-pulse-ventures';

// User model (mirror of src/models/User.ts)
const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

function hashPassword(plain) {
  const ITERATIONS = 100000;
  const KEYLEN = 64;
  const DIGEST = 'sha512';
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(plain, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
  return `${salt}:${ITERATIONS}:${hash}`;
}

async function main() {
  const email = 'vpatelpulse@gmail.com';
  const password = 'PPVpatel@#602';

  console.log('Connecting to MongoDB:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('Connected. Seeding admin user...');

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log('Existing user promoted to admin:', existing.email);
    } else {
      console.log('Admin already exists:', existing.email);
    }
  } else {
    const user = await User.create({
      name: 'Administrator',
      email: email.toLowerCase(),
      password: hashPassword(password),
      role: 'admin',
    });
    console.log('Admin user created:', user.email);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
