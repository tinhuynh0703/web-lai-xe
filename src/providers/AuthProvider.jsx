import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../lib/api/auth";
import { showError, showSuccess } from "../utils/toast";
import { ROUTES } from "../constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Kiểm tra xem user đã đăng nhập chưa khi component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Đăng nhập
   */
  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      
      // Lưu token và thông tin user vào localStorage
      // Giả sử response có cấu trúc: { token: "...", user: {...} }
      // Nếu cấu trúc khác, cần điều chỉnh
      const token = response.token || response.data?.token || response.access_token;
      const userData = response.user || response.data?.user || { user_name: credentials.user_name };

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        showSuccess("Đăng nhập thành công!");
        navigate(ROUTES.HOME);
        return { success: true };
      } else {
        throw new Error("Token không được trả về từ server");
      }
    } catch (error) {
      const errorMessage = error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.";
      showError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Đăng xuất
   */
  const logout = async () => {
    try {
      // Gọi API logout nếu có
      await authApi.logout().catch(() => {
        // Bỏ qua lỗi nếu endpoint không tồn tại
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Xóa token và user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate(ROUTES.LOGIN);
    }
  };

  /**
   * Kiểm tra xem user đã đăng nhập chưa
   */
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token && !!user;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook để sử dụng AuthContext
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

