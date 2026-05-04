/**
 * Utility functions for formatting data
 */

/**
 * Format số tiền VNĐ
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Phần số có dấu chấm nghìn (vd. 1.234.567)
 * @param {number|string} amount
 * @returns {string}
 */
export function formatVndGrouped(amount) {
  if (amount == null || amount === "") return "";
  const n = Number(amount);
  if (Number.isNaN(n)) return "";
  const rounded = Math.round(n);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Hiển thị số tiền kiểu kế toán: x.xxx.xxx
 * @param {number|string} amount
 * @returns {string}
 */
export function formatVndAmountDisplay(amount) {
  return formatVndGrouped(amount);
}

/**
 * Tải file từ Blob (Excel, PDF, …)
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadFileFromBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Format ngày tháng
 * @param {string|Date} date
 * @param {string} format
 * @returns {string}
 */
export function formatDate(date, format = "dd/MM/yyyy") {
  if (!date) return "";

  // Support compact date string yyyymmdd, e.g. "20030404"
  if (typeof date === "string" && /^\d{8}$/.test(date)) {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);
    return format.replace("dd", day).replace("MM", month).replace("yyyy", year);
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return format.replace("dd", day).replace("MM", month).replace("yyyy", year);
}

/**
 * Format số điện thoại
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  }
  return phone;
}

/**
 * Format tên (viết hoa chữ cái đầu)
 * @param {string} name
 * @returns {string}
 */
export function formatName(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
