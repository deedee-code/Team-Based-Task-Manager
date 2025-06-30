"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { apiClient, type User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = apiClient.getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    const response = await apiClient.getProfile();
    if (response.data) {
      setUser(response.data);
    } else {
      apiClient.clearToken();
    }
    setIsLoading(false);
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    const response = await apiClient.login(username, password);

    if (response.data) {
      apiClient.setToken(response.data.access_token);
      setUser(response.data.user);
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: response.error || "Login failed",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<boolean> => {
    const response = await apiClient.register(
      username,
      email,
      password,
      confirmPassword
    );

    if (response.data) {
      apiClient.setToken(response.data.access_token);
      setUser(response.data.user);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: response.error || "Registration failed",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
