// hooks/useClientAuth.ts
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store"; // adjust path
import {
  loginUser,
  logoutUser,
  setUserToken,
  setStatus,
} from "@/store/slices/auth.slices"; // adjust path
import type { User } from "@/store/slices/auth.slices";
import { authClient } from "@/lib/auth-client"; // path adjust

export function useClientAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, status } = useSelector(
    (state: RootState) => state.auth
  );

  /** Hydrate from parent‑provided user & token (no API call) */
  const signIn = useCallback(
    (userData: User, userToken?: string) => {
      dispatch(setStatus({ status: "loading" }));
      try {
        dispatch(loginUser({ user: userData, token: userToken }));
      } catch (err) {
        console.error("signIn (hydrate) failed:", err);
        dispatch(setStatus({ status: "error" }));
      }
    },
    [dispatch]
  );

  /** Sign‑out both locally and via Better Auth client */
  const signOut = useCallback(async () => {
    console.log("🚪 Starting sign-out process...");
    dispatch(setStatus({ status: "loading" }));
    
    try {
      // Clear better-auth session first
      const signOutResult = await authClient.signOut({
        fetchOptions: {
          credentials: "include",
        },
      });
      console.log("✅ Sign-out result:", signOutResult);
      
      // Clear local state immediately
      dispatch(logoutUser());
      
      // Clear ALL storage aggressively
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear ALL cookies aggressively
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname};`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
      });
      
      console.log("🧹 All storage and cookies cleared");
      
      // Force hard redirect to prevent any session restoration
      window.location.replace("/");
      
    } catch (err) {
      console.error("❌ signOut failed:", err);
      // Still clear everything even on error
      dispatch(logoutUser());
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/");
    }
  }, [dispatch]);

  const fetchUser = useCallback(async () => {
    dispatch(setStatus({ status: "fetching" }));
    try {
      const { data: session, error } = await authClient.getSession();

      if (error) {
        console.warn(
          "fetchUser: network or server error, keeping current user",
          error
        );
        dispatch(setStatus({ status: "error" }));
        return; // don't log out
      }

      if (session && session.user) {
        const u = session.user;
        const tok = session.session?.token;
        dispatch(
          loginUser({
            user: u as any,
            token: tok,
          })
        );
        dispatch(setStatus({ status: "success" }));
      } else {
        // No active session → log out
        dispatch(logoutUser());
        dispatch(setStatus({ status: "success" }));
      }
    } catch (err) {
      console.error(
        "fetchUser failed unexpectedly, keeping user in state:",
        err
      );
      // Keep user in Redux, just mark as error
      dispatch(setStatus({ status: "error" }));
    }
  }, [dispatch]);

  /** Optional: update token manually */
  const updateToken = useCallback(
    (newToken: string) => {
      dispatch(setUserToken({ token: newToken }));
    },
    [dispatch]
  );

  /** On mount: if token exists, attempt to refresh/fetch session */
  useEffect(() => {
    // DISABLED: Don't automatically sign in on app load
    // User should explicitly sign in
    
    // if (token) {
    //   void fetchUser();
    // } else {
    //   // no token, ensure cleared
    //   dispatch(logoutUser());
    // }
    
    // Always start logged out
    dispatch(logoutUser());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    status,
    signIn,
    signOut,
    fetchUser,
    updateToken,
  };
}
