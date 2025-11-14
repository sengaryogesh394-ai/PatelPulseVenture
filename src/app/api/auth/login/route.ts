import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const ok = verifyPassword(password, user.password);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Login failed' }, { status: 500 });
  }
}
