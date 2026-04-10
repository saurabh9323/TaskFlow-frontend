"use client";
import { useState, useEffect } from "react";
import { User } from "@/types";
import { getStoredUser, isAuthenticated, logout } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getStoredUser());
    }
    setLoading(false);
  }, []);

  return { user, loading, isAdmin: user?.role === "admin", logout };
}
