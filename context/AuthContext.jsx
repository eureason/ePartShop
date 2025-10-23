'use client'
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromCookies = async () => {
      try {
        const res = await axios.get("/api/auth/me"); // A new API route to get user data
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("Error loading user from cookies:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUserFromCookies();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      if (res.data.success) {
        setUser(res.data.user); // Assuming login API returns user data
        toast.success("Logged in successfully!");
        router.push("/"); // Redirect to home or dashboard
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post("/api/auth/register", { name, email, password });
      if (res.data.success) {
        toast.success("Registered successfully! Please log in.");
        router.push("/login"); // Redirect to login page
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.error("Registration error:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout"); // A new API route for logout
      setUser(null);
      toast.success("Logged out successfully!");
      router.push("/login"); // Redirect to login page
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
