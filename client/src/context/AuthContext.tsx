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
      // Wait for session to be available
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn("No session available for bootstrapUser");
        return;
      }

      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", uid)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found" which is OK
        console.error("Error checking profile:", profileError);
        // If it's a 401, the session might not be ready yet, retry once
        if (profileError.code === '42501' || profileError.message.includes('401')) {
          await new Promise(resolve => setTimeout(resolve, 500));
          const retry = await supabase
            .from("profiles")
            .select("user_id")
            .eq("user_id", uid)
            .maybeSingle();
          if (retry.error && retry.error.code !== 'PGRST116') {
            throw retry.error;
          }
        } else {
          throw profileError;
        }
      }

      if (!existingProfile) {
        const { error: insertError } = await supabase.from("profiles").insert({
          user_id: uid,
          name: metadata?.name ?? "",
          phone: metadata?.phone ?? null,
        });
        if (insertError) {
          // If insert fails due to 401, wait and retry
          if (insertError.code === '42501' || insertError.message.includes('401')) {
            await new Promise(resolve => setTimeout(resolve, 500));
            await supabase.from("profiles").insert({
              user_id: uid,
              name: metadata?.name ?? "",
              phone: metadata?.phone ?? null,
            });
          } else {
            console.error("Error inserting profile:", insertError);
          }
        }
      }

      const { data: existingRole, error: roleError } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", uid)
        .limit(1);

      if (roleError && roleError.code !== 'PGRST116') {
        console.error("Error checking role:", roleError);
        if (roleError.code === '42501' || roleError.message.includes('401')) {
          await new Promise(resolve => setTimeout(resolve, 500));
          const retry = await supabase
            .from("user_roles")
            .select("id")
            .eq("user_id", uid)
            .limit(1);
          if (retry.error && retry.error.code !== 'PGRST116') {
            throw retry.error;
          }
        } else {
          throw roleError;
        }
      }

      if (!existingRole || existingRole.length === 0) {
        const desiredRole =
          metadata?.role === "seller" || metadata?.role === "buyer"
            ? metadata.role
            : "buyer";
        const { error: insertRoleError } = await supabase.from("user_roles").insert({
          user_id: uid,
          role: desiredRole,
        });
        if (insertRoleError) {
          if (insertRoleError.code === '42501' || insertRoleError.message.includes('401')) {
            await new Promise(resolve => setTimeout(resolve, 500));
            await supabase.from("user_roles").insert({
              user_id: uid,
              role: desiredRole,
            });
          } else {
            console.error("Error inserting role:", insertRoleError);
          }
        }
      }
    } catch (e) {
      console.error("bootstrapUser failed", e);
    }
  };

  const fetchProfileAndRole = useCallback(async (uid: string, currentSession: Session | null) => {
    try {
      // Ensure session is available
      if (!currentSession) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.warn("No session available for fetchProfileAndRole");
          setIsLoading(false);
          return;
        }
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name, phone, avatar, address, is_verified, created_at, updated_at")
        .eq("user_id", uid)
        .maybeSingle();

      // Handle 401 errors with retry
      let profileData = profile;
      if (profileError) {
        if (profileError.code === '42501' || profileError.message.includes('401')) {
          // Wait a bit and retry once
          await new Promise(resolve => setTimeout(resolve, 500));
          const retry = await supabase
            .from("profiles")
            .select("name, phone, avatar, address, is_verified, created_at, updated_at")
            .eq("user_id", uid)
            .maybeSingle();
          if (retry.error && retry.error.code !== 'PGRST116') {
            console.error("Failed to fetch profile after retry:", retry.error);
            setIsLoading(false);
            return;
          }
          profileData = retry.data;
        } else if (profileError.code !== 'PGRST116') {
          console.error("Failed to fetch profile:", profileError);
          setIsLoading(false);
          return;
        }
      }

      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid);

      // Handle 401 errors with retry for roles
      let rolesDataFinal = rolesData;
      if (rolesError) {
        if (rolesError.code === '42501' || rolesError.message.includes('401')) {
          await new Promise(resolve => setTimeout(resolve, 500));
          const retry = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", uid);
          if (retry.error) {
            console.error("Failed to fetch roles after retry:", retry.error);
            // Continue with default role
          } else {
            rolesDataFinal = retry.data;
          }
        } else {
          console.error("Failed to fetch roles:", rolesError);
          // Continue with default role
        }
      }

      const effectiveRole: UserRole = (rolesDataFinal && rolesDataFinal.length > 0) ? getEffectiveRole(rolesDataFinal as any) : "buyer";

      const email = currentSession?.user?.email ?? "";
      const mapped: AppUser = {
        id: uid,
        name: profileData?.name ?? (email ? email.split("@")[0] : "User"),
        email,
        phone: profileData?.phone ?? "",
        role: effectiveRole,
        avatar: profileData?.avatar ?? undefined,
        address: profileData?.address ?? undefined,
        isVerified: Boolean(profileData?.is_verified),
        createdAt: profileData?.created_at ? new Date(profileData.created_at) : new Date(),
        updatedAt: profileData?.updated_at ? new Date(profileData.updated_at) : new Date(),
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      setUser(null);
      if (s?.user) {
        // Wait a bit to ensure session is fully initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        // 2) Defer bootstrap + fetch to avoid deadlocks
        setTimeout(() => {
          void bootstrapUser(s.user!.id, s.user!.user_metadata || {});
          fetchProfileAndRole(s.user!.id, s);
        }, 100);
      } else {
        setIsLoading(false);
      }
    });

    // 3) Then check for an existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Wait a bit to ensure session is fully initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        setTimeout(() => {
          void bootstrapUser(session.user!.id, session.user!.user_metadata || {});
          fetchProfileAndRole(session.user!.id, session);
        }, 100);
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
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
          throw new Error("Unable to connect to the server. Please check your internet connection and verify your Supabase configuration.");
        }
        // 400 Bad Request - invalid credentials
        if ((error as any).status === 400 || error.message?.toLowerCase().includes('invalid')) {
          throw new Error("Invalid email or password. Please try again.");
        }
        if ((error as any).status === 429) {
          throw new Error("Too many attempts. Please wait a few minutes and try again.");
        }
        throw new Error(error.message || "Login failed");
      }
      // State will be updated by onAuthStateChange
    } catch (error: any) {
      setIsLoading(false);
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
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_NAME_NOT_RESOLVED')) {
          throw new Error("Unable to connect to the server. Please check your internet connection and verify your Supabase configuration.");
        }
        // 429 Too Many Requests - rate limited by Supabase
        if ((error as any).status === 429 || error.message?.includes('429') || error.message?.toLowerCase().includes('too many')) {
          throw new Error("Too many signup attempts. Please wait 5–10 minutes and try again.");
        }
        // 400 Bad Request - e.g. email already registered, invalid data
        if ((error as any).status === 400) {
          throw new Error(error.message || "Invalid request. This email may already be registered—try logging in instead.");
        }
        throw new Error(error.message || "Registration failed");
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
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