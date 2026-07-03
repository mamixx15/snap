import supabase from '../../../lib/supabase';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';

// Hash password using SHA-256
const hashPassword = (password) => {
  return createHash('sha256')
    .update(password)
    .digest('hex');
};

// Generate JWT token for admin
const generateToken = (adminUser) => {
  // In a real app, you should store this secret in an environment variable
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  
  return jwt.sign(
    { 
      id: adminUser.id,
      username: adminUser.username,
      display_name: adminUser.display_name
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Hash the provided password
    const hashedPassword = hashPassword(password);
    
    // Look up admin in database
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .eq('password_hash', hashedPassword)
      .single();
    
    if (error || !admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(admin);
    
    // Return admin info and token (excluding password hash)
    const { password_hash, ...adminWithoutPassword } = admin;
    
    return res.status(200).json({
      user: adminWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}