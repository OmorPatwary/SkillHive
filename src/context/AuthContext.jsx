import React, {
  createContext,
  useState,
  useEffect,
} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error(
          'Failed to parse user from localStorage',
          error
        );
      }
    }

    setLoading(false);
  }, []);

  const updateUser = (newUserData) => {
    setUser((prevUser) => {
      const updatedUser = prevUser
        ? { ...prevUser, ...newUserData }
        : newUserData;

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      );

      return updatedUser;
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};