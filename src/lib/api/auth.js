import { api } from "./client";

/**
 * API endpoints cho authentication
 */

export const authApi = {
  /**
   * Đăng nhập
   * @param {Object} credentials - Thông tin đăng nhập
   * @param {string} credentials.user_name - Tên đăng nhập
   * @param {string} credentials.password - Mật khẩu
   * @returns {Promise} Response từ server
   */
  login: (credentials) => 
    api.post("/UserTkn/login", {
      user_name: credentials.user_name,
      password: credentials.password,
    }),
  
  /**
   * Đăng xuất (nếu có endpoint)
   * @returns {Promise} Response từ server
   */
  logout: () => api.post("/UserTkn/logout"),
};


