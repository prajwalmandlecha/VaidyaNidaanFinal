import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync("jwt");
      if (token) {
        setUser({ token });
      }
    };
    loadToken();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
