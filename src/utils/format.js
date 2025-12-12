/**
 * Utility functions for formatting data
 */

/**
 * Format số tiền VNĐ
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

/**
 * Format ngày tháng
 * @param {string|Date} date
 * @param {string} format
 * @returns {string}
 */
export function formatDate(date, format = 'dd/MM/yyyy') {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year)
}

/**
 * Format số điện thoại
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
  }
  return phone
}

/**
 * Format tên (viết hoa chữ cái đầu)
 * @param {string} name
 * @returns {string}
 */
export function formatName(name) {
  if (!name) return ''
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}






