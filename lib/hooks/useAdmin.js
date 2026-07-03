import { useState, useEffect } from 'react';
import supabase from '../supabase';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a saved admin session
    const checkAdminSession = async () => {
      try {
        setIsLoading(true);
        
        // Check for admin auth token in localStorage
        const adminToken = localStorage.getItem('codesnap_admin_token');
        
        if (!adminToken) {
          setIsAdmin(false);
          setAdminUser(null);
          return;
        }
        
        // Verify admin token with the server
        const response = await fetch('/api/admin/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: adminToken }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.valid) {
          setIsAdmin(true);
          setAdminUser(data.user);
        } else {
          // Clear invalid token
          localStorage.removeItem('codesnap_admin_token');
          setIsAdmin(false);
          setAdminUser(null);
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
        setIsAdmin(false);
        setAdminUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminSession();
  }, []);

  // Function to log in as admin
  const loginAsAdmin = async (username, password) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Save admin token
      localStorage.setItem('codesnap_admin_token', data.token);
      
      setIsAdmin(true);
      setAdminUser(data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to log in as admin' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Function to log out admin
  const logoutAdmin = () => {
    localStorage.removeItem('codesnap_admin_token');
    setIsAdmin(false);
    setAdminUser(null);
  };

  return {
    isAdmin,
    adminUser,
    isLoading,
    loginAsAdmin,
    logoutAdmin
  };
}