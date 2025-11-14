import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/password';

// Seeds a default admin user if not present.
// WARNING: Keep this route temporary. Remove or protect after running once.
export async function GET(_req: NextRequest) {
  try {
    await connectDB();
    const email = 'vpatelpulse@gmail.com';
    const password = 'PPVpatel@#602';

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
      }
      return NextResponse.json({ success: true, message: 'Admin user already exists', data: { id: existing._id, email: existing.email, role: existing.role } });
    }

    const user = await User.create({
      name: 'Administrator',
      email: email.toLowerCase(),
      password: hashPassword(password),
      role: 'admin',
    });

    return NextResponse.json({ success: true, message: 'Admin user created', data: { id: user._id, email: user.email, role: user.role } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to seed admin' }, { status: 500 });
  }
}
