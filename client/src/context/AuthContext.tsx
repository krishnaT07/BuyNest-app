"use client";
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import type { User as AppUser, UserRole } from "@/types";

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<AppUser>) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to resolve effective role priority
  const getEffectiveRole = (roles: { role: string }[]): UserRole => {
    const roleSet = new Set(roles.map((r) => r.role));
    if (roleSet.has("admin")) return "admin";
    if (roleSet.has("seller")) return "seller";
    return "buyer";
  };

  // Ensure user's profile and role records exist (runs after first login)
  const bootstrapUser = async (uid: string, metadata: any) => {
    try {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", uid)
        .maybeSingle();

      if (!existingProfile) {
        await supabase.from("profiles").insert({
          user_id: uid,
          name: metadata?.name ?? "",
          phone: metadata?.phone ?? null,
        });
      }

      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", uid)
        .limit(1);

      if (!existingRole || existingRole.length === 0) {
        const desiredRole =
          metadata?.role === "seller" || metadata?.role === "buyer"
            ? metadata.role
            : "buyer";
        await supabase.from("user_roles").insert({
          user_id: uid,
          role: desiredRole,
        });
      }
    } catch (e) {
      console.error("bootstrapUser failed", e);
    }
  };

  const fetchProfileAndRole = useCallback(async (uid: string, currentSession: Session | null) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, phone, avatar, address, is_verified, created_at, updated_at")
        .eq("user_id", uid)
        .maybeSingle();

      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid);

      const effectiveRole: UserRole = rolesData && rolesData.length > 0 ? getEffectiveRole(rolesData as any) : "buyer";

      const email = currentSession?.user?.email ?? "";
      const mapped: AppUser = {
        id: uid,
        name: profile?.name ?? (email ? email.split("@")[0] : "User"),
        email,
        phone: profile?.phone ?? "",
        role: effectiveRole,
        avatar: profile?.avatar ?? undefined,
        address: profile?.address ?? undefined,
        isVerified: Boolean(profile?.is_verified),
        createdAt: profile?.created_at ? new Date(profile.created_at) : new Date(),
        updatedAt: profile?.updated_at ? new Date(profile.updated_at) : new Date(),
      };

      setUser(mapped);
      
      // Redirect to appropriate dashboard after successful login
      if (currentSession && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        // Only redirect if we're on login page or home page
        if (currentPath === '/auth/login' || currentPath === '/') {
          setTimeout(() => {
            switch (effectiveRole) {
              case 'admin':
                window.location.href = '/admin-dashboard';
                break;
              case 'seller':
                window.location.href = '/seller-dashboard';
                break;
              case 'buyer':
              default:
                window.location.href = '/browse';
                break;
            }
          }, 100);
        }
      }
    } catch (e) {
      // Silent fail; keep user null
      console.error("Failed to load profile/roles", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1) Subscribe to auth changes first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(null);
      if (s?.user) {
        // 2) Defer bootstrap + fetch to avoid deadlocks
        setTimeout(() => {
          void bootstrapUser(s.user!.id, s.user!.user_metadata || {});
          fetchProfileAndRole(s.user!.id, s);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    // 3) Then check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setTimeout(() => {
          void bootstrapUser(session.user!.id, session.user!.user_metadata || {});
          fetchProfileAndRole(session.user!.id, session);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfileAndRole]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setIsLoading(false);
        // Check if it's a network error
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
          throw new Error("Unable to connect to the server. Please check your internet connection and verify your Supabase configuration.");
        }
        throw new Error(error.message || "Login failed");
      }
      // State will be updated by onAuthStateChange
    } catch (error: any) {
      setIsLoading(false);
      // Re-throw network errors with a user-friendly message
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error("Network error: Unable to connect to the authentication server. Please check your Supabase configuration.");
      }
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login`,
          data: {
            name: userData.name,
            phone: userData.phone,
            role: userData.role,
          },
        },
      });

      if (error) {
        setIsLoading(false);
        // Check if it's a network error
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
          throw new Error("Unable to connect to the server. Please check your internet connection and verify your Supabase configuration.");
        }
        throw new Error(error.message || "Registration failed");
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      // Re-throw network errors with a user-friendly message
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error("Network error: Unable to connect to the authentication server. Please check your Supabase configuration.");
      }
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    void supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const updateUser = useCallback(async (userData: Partial<AppUser>) => {
    if (!session?.user) return;
    const updates: Record<string, any> = {};
    if (userData.name !== undefined) updates.name = userData.name;
    if (userData.phone !== undefined) updates.phone = userData.phone;
    if (userData.avatar !== undefined) updates.avatar = userData.avatar;
    if (userData.address !== undefined) updates.address = userData.address;

    if (Object.keys(updates).length === 0) return;

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", session.user.id);

    if (error) throw new Error(error.message || "Failed to update user");

    // Refresh local state
    await fetchProfileAndRole(session.user.id, session);
  }, [session, fetchProfileAndRole]);

  const value: AuthContextType = useMemo(() => ({
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }), [user, isLoading, login, register, logout, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};