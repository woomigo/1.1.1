import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localhost } from "../components/utility";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Full user object
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${localhost}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Login Failed", data.error || "Invalid credentials");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      throw err;
    }
  };

  const register = async (email, password) => {
    try {
      const res = await fetch(`${localhost}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isProfileComplete: false }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registration failed");

      await AsyncStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user); // ⚠️ Make sure your backend returns `user` object in register response
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const checkLoginStatus = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    if (storedToken) {
      try {
        const res = await fetch(`${localhost}/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setToken(storedToken);
          setUser(data);
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, register, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
