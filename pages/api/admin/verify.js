import jwt from 'jsonwebtoken';
import supabase from '../../../lib/supabase';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    try {
      // Decode and verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if admin still exists in database
      const { data: admin, error } = await supabase
        .from('admins')
        .select('id, username, display_name, created_at')
        .eq('id', decoded.id)
        .single();
      
      if (error || !admin) {
        return res.status(401).json({ 
          valid: false, 
          error: 'Admin account no longer exists' 
        });
      }
      
      // Return success with admin info
      return res.status(200).json({
        valid: true,
        user: admin
      });
    } catch (jwtError) {
      // Token is invalid or expired
      return res.status(401).json({ 
        valid: false, 
        error: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ 
      valid: false, 
      error: 'Internal server error' 
    });
  }
}