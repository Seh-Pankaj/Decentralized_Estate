import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [walletAddress, setWalletAddress] = useState( JSON.parse(localStorage.getItem("wallet")) || null);


  const updateUser = (data) => {
    setCurrentUser(data);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("wallet", JSON.stringify(walletAddress));
  }, [walletAddress]);

  return (
    <AuthContext.Provider value={{ currentUser,updateUser, walletAddress, setWalletAddress }}>
      {children}
    </AuthContext.Provider>
  );
};
