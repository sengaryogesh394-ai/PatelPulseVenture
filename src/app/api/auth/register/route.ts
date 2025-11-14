import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    const user = await User.create({
      name: name?.trim() || '',
      email: String(email).toLowerCase(),
      password: hashPassword(password),
      role: 'user',
    });

    return NextResponse.json({ success: true, data: { id: user._id, email: user.email, name: user.name, role: user.role } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Registration failed' }, { status: 500 });
  }
}
