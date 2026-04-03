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
    dispatch(setStatus({ status: "loading" }));
    try {
      // Clear better-auth session first
      await authClient.signOut({
        fetchOptions: {
          credentials: "include",
        },
      });
      
      // Clear local state
      dispatch(logoutUser());
      
      // Clear any stored tokens or session data
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      
      // Clear better-auth cookies manually if needed
      document.cookie = "better-auth.session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Redirect to home page after successful logout
      window.location.href = "/";
    } catch (err) {
      console.error("signOut failed:", err);
      dispatch(setStatus({ status: "error" }));
      // Still clear local state even on error
      dispatch(logoutUser());
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      // Redirect to home page even on error to ensure user is logged out
      window.location.href = "/";
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
    if (token) {
      void fetchUser();
    } else {
      // no token, ensure cleared
      dispatch(logoutUser());
    }
  }, [token, fetchUser, dispatch]);

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
