"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  companyName: string;
  contactPhone: string | null;
  category: string | null;
  verified: boolean;
  metadata: string | null; // stringified JSON
}

export interface AuthUser {
  id: string;
  email: string;
  role: "VENDOR" | "ORGANIZER" | "BRAND" | "ADMIN";
  profile?: UserProfile;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password?: string, otp?: string) => Promise<void>;
  loginWithGoogle: (credential: string, role: "VENDOR" | "ORGANIZER" | "BRAND" | "ADMIN") => Promise<void>;
  signup: (email: string, role: "VENDOR" | "ORGANIZER" | "BRAND" | "ADMIN", profileData: Partial<UserProfile>, metadata: any, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount and verify it
  useEffect(() => {
    const verifyUserSession = async () => {
      const storedUser = localStorage.getItem("gz_session");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const response = await fetch("/api/auth/verify-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: parsed.id,
              email: parsed.email,
              role: parsed.role
            })
          });
          if (response.ok) {
            const data = await response.json();
            if (data.valid) {
              setUser(data.user);
              if (data.refreshed) {
                localStorage.setItem("gz_session", JSON.stringify(data.user));
              }
            } else {
              localStorage.removeItem("gz_session");
              setUser(null);
            }
          }
        } catch (e) {
          console.error("Error validating session on mount:", e);
          // Fallback to cached session if network error
          try {
            setUser(JSON.parse(storedUser));
          } catch (err) {}
        }
      }
      setLoading(false);
    };

    verifyUserSession();
  }, []);

  const login = async (email: string, password?: string, otp?: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otp }),
      });

      const contentType = response.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Unable to establish a secure connection with the server. Please try again in a few moments.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to log in.");
      }

      setUser(data.user);
      localStorage.setItem("gz_session", JSON.stringify(data.user));
      setLoading(false);

      // Redirect to correct dashboard based on role
      redirectBasedOnRole(data.user.role);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async (credential: string, role: "VENDOR" | "ORGANIZER" | "BRAND" | "ADMIN") => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, role }),
      });

      const contentType = response.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Unable to establish a secure connection with the Google Auth endpoint.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Google login failed.");
      }

      setUser(data.user);
      localStorage.setItem("gz_session", JSON.stringify(data.user));
      setLoading(false);

      redirectBasedOnRole(data.user.role);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (
    email: string,
    role: "VENDOR" | "ORGANIZER" | "BRAND" | "ADMIN",
    profileData: Partial<UserProfile>,
    metadata: any,
    password?: string
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          companyName: profileData.companyName,
          contactPhone: profileData.contactPhone,
          category: profileData.category,
          metadata: JSON.stringify(metadata),
          password
        }),
      });

      const contentType = response.headers.get("content-type");
      let data: any = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Unable to establish a secure connection with the server. Please try again in a few moments.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign up.");
      }

      setUser(data.user);
      localStorage.setItem("gz_session", JSON.stringify(data.user));
      setLoading(false);

      redirectBasedOnRole(data.user.role);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gz_session");
    router.push("/");
  };

  const redirectBasedOnRole = (role: "VENDOR" | "ORGANIZER" | "BRAND" | "ADMIN") => {
    if (role === "ADMIN") {
      router.push("/dashboard/admin");
    } else if (role === "ORGANIZER") {
      router.push("/dashboard/organizer");
    } else {
      router.push("/discover");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, signup, logout }}>
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
