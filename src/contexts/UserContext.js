import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../config/firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          name: user.displayName || 'Chef User',
          email: user.email
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return React.createElement(
    UserContext.Provider,
    { value: { user, setUser, loading } },
    children
  );
};

export { UserContext };