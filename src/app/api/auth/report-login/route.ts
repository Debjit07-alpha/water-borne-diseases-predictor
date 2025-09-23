import { NextRequest, NextResponse } from 'next/server';

// Shared mock database - includes approved users from registration
const reportUsers = [
  {
    id: 1,
    username: 'asha_priya',
    password: 'report123',
    role: 'asha',
    name: 'Priya Sharma',
    employeeId: 'ASHA001',
    email: 'priya.sharma@health.gov.in',
    phone: '+91-9876543210',
    district: 'West Bengal',
    block: 'Kolkata North',
    village: 'Shyambazar',
    approved: true
  },
  {
    id: 2,
    username: 'volunteer_raj',
    password: 'local123',
    role: 'local-volunteer',
    name: 'Raj Kumar',
    employeeId: 'LV001',
    email: 'raj.kumar@community.org',
    phone: '+91-9876543211',
    district: 'West Bengal',
    block: 'Howrah',
    village: 'Shibpur',
    approved: true
  },
  {
    id: 3,
    username: 'asha_anita',
    password: 'hashedPassword789',
    role: 'asha',
    name: 'Anita Das',
    employeeId: 'ASHA003',
    email: 'anita.das@health.gov.in',
    phone: '+91 9988776655',
    district: 'North 24 Parganas',
    block: 'Barasat',
    village: 'Madhyamgram',
    approved: true
  }
];

export async function POST(req: NextRequest) {
  try {
    const { username, password, role } = await req.json();

    // Validate input
    if (!username || !password || !role) {
      return NextResponse.json(
        { error: 'Username, password, and role are required' },
        { status: 400 }
      );
    }

    // Find user by username or employeeId and role
    const user = reportUsers.find(u => 
      (u.username === username || u.employeeId === username) && 
      u.role === role && 
      u.approved === true
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials or user not found' },
        { status: 401 }
      );
    }

    // Verify password (in production, use proper password hashing)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token (simplified for demo)
    const token = Buffer.from(`${user.username}:${Date.now()}:${role}`).toString('base64');
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    return NextResponse.json({
      success: true,
      token,
      role: user.role,
      username: user.username,
      name: user.name,
      employeeId: user.employeeId,
      expiresAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        district: user.district,
        block: user.block,
        village: user.village,
        role: user.role,
        employeeId: user.employeeId
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}