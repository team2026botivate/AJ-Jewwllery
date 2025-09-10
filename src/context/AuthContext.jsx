import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('aj_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (id, password) => {
    try {
      setIsLoading(true);

      console.log('Login attempt:', id, password);

      // Check credentials (case insensitive for id)
      if (id.toLowerCase() === 'admin' && password === 'admin123') {
        const userData = {
          id: 'admin',
          name: 'Administrator',
          role: 'admin'
        };
        setUser(userData);
        localStorage.setItem('aj_user', JSON.stringify(userData));
        console.log('Login successful for admin');
        return { success: true };
      } else if (id.toLowerCase() === 'user' && password === 'user123') {
        const userData = {
          id: 'user',
          name: 'Regular User',
          role: 'user'
        };
        setUser(userData);
        localStorage.setItem('aj_user', JSON.stringify(userData));
        console.log('Login successful for user');
        return { success: true };
      } else {
        console.log('Invalid credentials');
        return { success: false, error: 'Invalid ID or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aj_user');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};