"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { USERS } from "./mockData";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  position: string;
  avatar: string;
  joinDate: string;
  salary: number;
  phone: string;
  location: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, "id" | "joinDate" | "avatar" | "salary">, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("hrms_user");
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const getCustomUsers = (): any[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("hrms_custom_users");
    return stored ? JSON.parse(stored) : [];
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check custom users first
    const customUsers = getCustomUsers();
    let found = customUsers.find(u => u.email === email && u.password === password);
    
    // Fallback to static mock users
    if (!found) {
      found = USERS.find(u => u.email === email && u.password === password);
    }

    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser as User);
      localStorage.setItem("hrms_user", JSON.stringify(safeUser));
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, "id" | "joinDate" | "avatar" | "salary">, password: string): Promise<boolean> => {
    const customUsers = getCustomUsers();
    
    // Check duplicate email
    const duplicate = customUsers.some(u => u.email === userData.email) || USERS.some(u => u.email === userData.email);
    if (duplicate) return false;

    const initials = userData.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    
    const newUser = {
      ...userData,
      id: `E0${13 + customUsers.length}`,
      joinDate: new Date().toISOString().split("T")[0],
      avatar: initials || "US",
      salary: 50000, // Default CTC
      password,
    };

    // Save to custom users list
    localStorage.setItem("hrms_custom_users", JSON.stringify([...customUsers, newUser]));
    
    // Log user in automatically
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser as User);
    localStorage.setItem("hrms_user", JSON.stringify(safeUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hrms_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
