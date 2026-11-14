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

    // Fetch the full user object after login
    const meRes = await fetch(`${localhost}/auth/me`, {
      headers: { Authorization: `Bearer ${data.token}` },
    });

    const meData = await meRes.json();
    setUser(meData);

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
      setUser(data.user); 
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


// import { createContext, useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Alert } from "react-native";
// import { localhost } from "../components/utility";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [authLoading, setAuthLoading] = useState(false); // For login/register buttons

//   // Reusable fetch helper
//   const api = async (endpoint, options = {}) => {
//     try {
//       const res = await fetch(`${localhost}${endpoint}`, options);
//       const data = await res.json();
//       return { ok: res.ok, data };
//     } catch (err) {
//       return { ok: false, data: { error: err.message } };
//     }
//   };

//   // Fetch full user object
//   const loadUserFromToken = async (authToken) => {
//     const { ok, data } = await api("/auth/me", {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     });

//     if (!ok) return null;
//     return data;
//   };

//   // --------------------------
//   // LOGIN
//   // --------------------------
//   const login = async (email, password) => {
//     setAuthLoading(true);
//     try {
//       const { ok, data } = await api("/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!ok) {
//         Alert.alert("Login Failed", data.error || "Invalid credentials");
//         return false;
//       }

//       await AsyncStorage.setItem("token", data.token);
//       setToken(data.token);

//       const userData = await loadUserFromToken(data.token);
//       setUser(userData);

//       return true;
//     } catch (err) {
//       Alert.alert("Error", err.message);
//       return false;
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   // --------------------------
//   // REGISTER
//   // --------------------------
//   const register = async (email, password) => {
//     setAuthLoading(true);
//     try {
//       const { ok, data } = await api("/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email,
//           password,
//           isProfileComplete: false,
//         }),
//       });

//       if (!ok) {
//         Alert.alert("Registration Failed", data.error || "Unable to register");
//         return false;
//       }

//       await AsyncStorage.setItem("token", data.token);
//       setToken(data.token);

//       const userData = await loadUserFromToken(data.token);
//       setUser(userData);

//       return true;
//     } catch (err) {
//       Alert.alert("Error", err.message);
//       return false;
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   // --------------------------
//   // LOGOUT
//   // --------------------------
//   const logout = async () => {
//     await AsyncStorage.removeItem("token");
//     setUser(null);
//     setToken(null);
//   };

//   // --------------------------
//   // PERSIST LOGIN
//   // --------------------------
//   const checkLoginStatus = async () => {
//     const storedToken = await AsyncStorage.getItem("token");

//     if (storedToken) {
//       const userData = await loadUserFromToken(storedToken);

//       if (userData) {
//         setToken(storedToken);
//         setUser(userData);
//       } else {
//         // Token invalid
//         await AsyncStorage.removeItem("token");
//       }
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     checkLoginStatus();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         authLoading,
//         login,
//         register,
//         logout,
//         setUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
