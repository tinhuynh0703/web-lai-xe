export function cn(...inputs) {
  return inputs
    .filter(Boolean)
    .map((input) => {
      if (typeof input === 'string') return input
      if (typeof input === 'object' && input !== null) {
        return Object.entries(input)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(' ')
      }
      return ''
    })
    .join(' ')
    .trim()
}

/**
 * Ô số form: để trống -> null; có giá trị -> số nguyên (kể cả 0).
 */
export function parseFormOptionalInt(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  if (s === "") return null;
  const n = parseInt(s, 10);
  if (Number.isNaN(n)) return null;
  return n;
}

/**
 * Lọc theo chuỗi: so khớp nếu bất kỳ giá trị nguyên thủy nào của object chứa chuỗi tìm (không phân biệt hoa thường).
 * @param {Record<string, unknown>} rowObject
 * @param {unknown} filterValue
 */
export function rowMatchesGlobalSearch(rowObject, filterValue) {
  const q = String(filterValue ?? "").trim().toLowerCase();
  if (!q) return true;
  if (rowObject == null || typeof rowObject !== "object") return false;
  return Object.values(rowObject).some((val) => {
    if (val == null) return false;
    if (typeof val === "object") {
      try {
        return JSON.stringify(val).toLowerCase().includes(q);
      } catch {
        return false;
      }
    }
    return String(val).toLowerCase().includes(q);
  });
}

export function objectToFormData(data) {
  const formData = new FormData()
  
  Object.entries(data).forEach(([key, value]) => {
    // Bỏ qua null/undefined: không append (tránh gửi "" — API .NET báo lỗi với chuỗi rỗng cho int?)
    if (value === null || value === undefined) {
      return
    }
    
    if (value instanceof File) {
      formData.append(key, value)
      return
    }
    
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object') {
        formData.append(key, JSON.stringify(value))
      } else {
        value.forEach((item, index) => {
          if (item !== null && item !== undefined) {
            formData.append(`${key}[${index}]`, String(item))
          }
        })
      }
      return
    }
    
    if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value))
      return
    }
    
    formData.append(key, String(value))
  })
  
  return formData
}