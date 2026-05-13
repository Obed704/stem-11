import { createContext, useState, useEffect } from "react";
import {
  authApi,
  setToken,
  setAdmin,
  removeToken,
  removeAdmin,
  getToken,
  getAdmin,
} from "../api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdminState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: persistent preAuthToken
  const [preAuthToken, setPreAuthToken] = useState(
    localStorage.getItem("preAuthToken") || null
  );

  const [emailSent, setEmailSent] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  // ─────────────────────────────────────────────
  // INIT SESSION
  // ─────────────────────────────────────────────
  useEffect(() => {
    const storedToken = getToken();
    const storedAdmin = getAdmin();

    if (storedToken && storedAdmin) {
      setTokenState(storedToken);
      setAdminState(storedAdmin);

      authApi.getProfile().then((res) => {
        if (!res.ok) handleLogout();
      }).catch(handleLogout);
    }

    setLoading(false);
  }, []);

  // ─────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch { }

    setTokenState(null);
    setAdminState(null);

    setPreAuthToken(null);
    setEmailSent(false);
    setAdminEmail("");

    removeToken();
    removeAdmin();
    localStorage.removeItem("preAuthToken");
  };

  // ─────────────────────────────────────────────
  // LOGIN (STEP 1)
  // ─────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const res = await authApi.login(email, password);

      if (!res.ok) {
        return {
          success: false,
          message: res.data?.message || "Login failed",
        };
      }

      // 🔐 2FA FLOW
      if (res.data.requiresTwoFactor) {
        setPreAuthToken(res.data.preAuthToken);
        localStorage.setItem("preAuthToken", res.data.preAuthToken);

        setAdminEmail(email);
        setEmailSent(true);

        return {
          success: true,
          requiresTwoFactor: true,
          message: res.data.message,
        };
      }

      // 🔓 DIRECT LOGIN (no 2FA)
      setTokenState(res.data.token);
      setAdminState(res.data.admin);

      setToken(res.data.token);
      setAdmin(res.data.admin);

      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  };

  // ─────────────────────────────────────────────
  // VERIFY CODE (STEP 2)
  // ─────────────────────────────────────────────
  const verifyCode = async (code) => {
    const storedToken =
      preAuthToken || localStorage.getItem("preAuthToken");

    if (!storedToken) {
      return {
        success: false,
        message: "Session expired. Please login again.",
      };
    }

    const res = await authApi.verifyEmailCode(storedToken, code);

    if (!res.ok) {
      return {
        success: false,
        message: res.data?.message || "Verification failed",
      };
    }

    // 🔓 SUCCESS LOGIN
    setTokenState(res.data.token);
    setAdminState(res.data.admin);

    setToken(res.data.token);
    setAdmin(res.data.admin);

    // 🧹 CLEANUP
    setPreAuthToken(null);
    setEmailSent(false);
    setAdminEmail("");

    localStorage.removeItem("preAuthToken");

    return { success: true };
  };

  // ─────────────────────────────────────────────
  // RESEND CODE
  // ─────────────────────────────────────────────
  const resendCode = async () => {
    const storedToken =
      preAuthToken || localStorage.getItem("preAuthToken");

    if (!storedToken) {
      return {
        success: false,
        message: "Session expired. Please login again.",
      };
    }

    const res = await authApi.resendVerificationCode(storedToken);

    if (!res.ok) {
      return {
        success: false,
        message: res.data?.message || "Failed to resend code",
      };
    }

    if (res.data.preAuthToken) {
      setPreAuthToken(res.data.preAuthToken);
      localStorage.setItem("preAuthToken", res.data.preAuthToken);
    }

    return {
      success: true,
      message: res.data?.message || "New code sent!",
    };
  };

  // ─────────────────────────────────────────────
  // CHANGE PASSWORD
  // ─────────────────────────────────────────────
  const changePassword = async (currentPassword, newPassword) => {
    const res = await authApi.changePassword(currentPassword, newPassword);

    if (res.ok) {
      await handleLogout();
      return { success: true, message: res.data?.message };
    }

    return { success: false, message: res.data?.message };
  };

  // ─────────────────────────────────────────────
  // CONTEXT VALUE
  // ─────────────────────────────────────────────
  const value = {
    admin,
    token,
    loading,
    preAuthToken,
    emailSent,
    adminEmail,
    login,
    verifyCode,
    resendCode,
    logout: handleLogout,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};