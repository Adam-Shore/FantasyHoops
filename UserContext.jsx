// UserContext.js
import { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from Session Storage when the component mounts
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (userData && userData.isLoggedIn) {
      setUser(userData);
    }
  }, []);

  // Function to set the user after successful login
  const loginUser = (userData) => {
    setUser(userData);
  };

  // Function to logout the user
  const logoutUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
