import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
}

interface UpdateProfileData {
  name: string;
  email: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (password.length < 6) {
        throw new Error('Invalid credentials');
      }

      const mockUser = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const mockUser = {
        id: `user-${Date.now()}`,
        email,
        name,
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Signup failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out');
    navigate('/');
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('If an account exists with this email, you will receive password reset instructions.');
    } catch (error) {
      toast.error('Failed to process password reset request');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true);
    try {
      const updatedUser = {
        ...user!,
        name: data.name,
        email: data.email,
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
