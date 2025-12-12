import { toast } from "react-toastify";

/**
 * Utility functions cho toast notifications
 */

/**
 * Hiển thị toast thành công
 * @param {string} message - Thông báo hiển thị
 */
export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

/**
 * Hiển thị toast lỗi
 * @param {string} message - Thông báo hiển thị
 */
export const showError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 4000,
  });
};

/**
 * Hiển thị toast cảnh báo
 * @param {string} message - Thông báo hiển thị
 */
export const showWarning = (message) => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

/**
 * Hiển thị toast thông tin
 * @param {string} message - Thông báo hiển thị
 */
export const showInfo = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

/**
 * Export toast object để sử dụng trực tiếp nếu cần
 */
export { toast };
