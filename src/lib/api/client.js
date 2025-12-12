/**
 * API Client configuration
 * Base URL và các cấu hình chung cho API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Request interceptors
const requestInterceptors = []
// Response interceptors
const responseInterceptors = []
// Error interceptors
const errorInterceptors = []

/**
 * Thêm request interceptor
 * @param {function} interceptor - Function nhận (config) và trả về config
 */
export function addRequestInterceptor(interceptor) {
  requestInterceptors.push(interceptor)
}

/**
 * Thêm response interceptor
 * @param {function} interceptor - Function nhận (response) và trả về response
 */
export function addResponseInterceptor(interceptor) {
  responseInterceptors.push(interceptor)
}

/**
 * Thêm error interceptor
 * @param {function} interceptor - Function nhận (error) và xử lý error
 */
export function addErrorInterceptor(interceptor) {
  errorInterceptors.push(interceptor)
}

/**
 * Áp dụng tất cả request interceptors
 */
async function applyRequestInterceptors(config) {
  let finalConfig = { ...config }
  
  for (const interceptor of requestInterceptors) {
    finalConfig = await interceptor(finalConfig) || finalConfig
  }
  
  return finalConfig
}

/**
 * Áp dụng tất cả response interceptors
 */
async function applyResponseInterceptors(response) {
  let finalResponse = response
  
  for (const interceptor of responseInterceptors) {
    finalResponse = await interceptor(finalResponse) || finalResponse
  }
  
  return finalResponse
}

/**
 * Áp dụng tất cả error interceptors
 */
async function applyErrorInterceptors(error) {
  for (const interceptor of errorInterceptors) {
    await interceptor(error)
  }
  throw error
}

/**
 * Custom fetch wrapper với interceptor support và timeout
 */
async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Base config
  let config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Thêm token nếu có (default request interceptor)
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    // Áp dụng request interceptors
    config = await applyRequestInterceptors(config)

    // Thêm timeout (5 giây)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    config.signal = controller.signal

    // Gửi request
    const response = await fetch(url, config)
    clearTimeout(timeoutId)
    
    // Áp dụng response interceptors
    const processedResponse = await applyResponseInterceptors(response)

    // Xử lý lỗi HTTP
    if (!processedResponse.ok) {
      // Xử lý 401 Unauthorized - token hết hạn
      if (processedResponse.status === 401) {
        // Xóa token cũ
        localStorage.removeItem('token')
        // Có thể redirect đến trang login
        if (window.location.pathname !== '/login') {
          // window.location.href = '/login'
        }
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      }

      // Xử lý 403 Forbidden
      if (processedResponse.status === 403) {
        throw new Error('Bạn không có quyền truy cập tài nguyên này.')
      }

      // Xử lý 404 Not Found
      if (processedResponse.status === 404) {
        throw new Error('Không tìm thấy tài nguyên.')
      }

      // Xử lý 500 Server Error
      if (processedResponse.status >= 500) {
        throw new Error('Lỗi máy chủ. Vui lòng thử lại sau.')
      }

      // Xử lý lỗi khác
      const error = await processedResponse.json().catch(() => ({
        message: processedResponse.statusText,
      }))
      throw new Error(error.message || 'Có lỗi xảy ra')
    }

    // Parse response
    const contentType = processedResponse.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await processedResponse.json()
    }
    
    return await processedResponse.text()
  } catch (error) {
    // Xử lý timeout và network errors
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Vui lòng kiểm tra kết nối mạng.')
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra lại.')
    }
    
    // Áp dụng error interceptors
    await applyErrorInterceptors(error)
    
    // Log error
    console.error('API Error:', error)
    throw error
  }
}

/**
 * HTTP Methods
 */
export const api = {
  get: (endpoint, options) => {
    const params = options?.params
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiClient(endpoint + queryString, { ...options, method: 'GET' })
  },
  post: (endpoint, data, options) =>
    apiClient(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: (endpoint, data, options) =>
    apiClient(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  patch: (endpoint, data, options) =>
    apiClient(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (endpoint, options) =>
    apiClient(endpoint, { ...options, method: 'DELETE' }),
}

// Setup default interceptors
// Request interceptor: Thêm timestamp
addRequestInterceptor((config) => {
  config.headers['X-Request-Time'] = new Date().toISOString()
  return config
})

// Response interceptor: Log response time (optional)
addResponseInterceptor((response) => {
  // Có thể thêm logic xử lý response ở đây
  return response
})

// Error interceptor: Xử lý network errors
addErrorInterceptor((error) => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    console.error('Network error: Không thể kết nối đến server')
  }
})

export default api
