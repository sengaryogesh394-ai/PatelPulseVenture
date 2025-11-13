'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  loginTime: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const authenticated = localStorage.getItem('admin_authenticated');
      const userData = localStorage.getItem('admin_user');

      if (authenticated === 'true' && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (username: string) => {
    const userData = {
      username,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('admin_authenticated', 'true');
    localStorage.setItem('admin_user', JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_user');
    
    setUser(null);
    setIsAuthenticated(false);
    
    router.push('/admin/login');
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    checkAuth
  };
}
