import { createContext, useContext, useState, useEffect } from 'react';
// import { db } from './database';

const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const setCurrentUser = async (token) => {
  // const token = localStorage.getItem('token');
  
  if (!token) {
    return null;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};



  useEffect(() => {
    // Check for existing session
    // const currentUser = db.getCurrentUser();
    // if (currentUser) {
    //   setUser(currentUser);
    // }
    // setLoading(false);
    setCurrentUser(token).then(() => setLoading(false));
  }, []);

  const login = (email, password) => {
    const existingUser = db.getUserByEmail(email);
    
    if (existingUser && existingUser.password === password) {
      setUser(existingUser);
      db.setCurrentUser(existingUser);
      return { success: true, user: existingUser };
    }
    
    return { success: false, message: 'Invalid credentials' };
  };

  const register = (userData) => {
    const existingUser = db.getUserByEmail(userData.email);
    
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser = db.createUser(userData);
    setUser(newUser);
    db.setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    db.logout();
  };

  const updateUserProfile = (updates) => {
    if (user) {
      const updatedUser = db.updateUser(user.id, updates);
      setUser(updatedUser);
      db.setCurrentUser(updatedUser);
      return updatedUser;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      setCurrentUser,
      updateUserProfile,
      loading,
      isAuthenticated: !!user,
      isBuyer: user?.role === 'buyer',
      isViewer: user?.role === 'viewer' || !user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
