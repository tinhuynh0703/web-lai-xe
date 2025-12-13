/**
 * API Interceptors configuration
 * File riêng để quản lý các interceptors
 */

import { addRequestInterceptor, addResponseInterceptor, addErrorInterceptor } from './client'

/**
 * Setup tất cả interceptors cho ứng dụng
 */
export function setupInterceptors() {
  // Request Interceptor: Thêm loading state
  addRequestInterceptor((config) => {
    // Có thể dispatch action để hiển thị loading
    // store.dispatch(setLoading(true))
    return config
  })

  // Response Interceptor: Xử lý response thành công
  addResponseInterceptor((response) => {
    // Có thể dispatch action để tắt loading
    // store.dispatch(setLoading(false))
    
    // Log response trong development
    if (import.meta.env.DEV) {
      // console.log('API Response:', response)
    }
    
    return response
  })

  // Error Interceptor: Xử lý lỗi chung
  addErrorInterceptor((error) => {
    // Tắt loading khi có lỗi
    // store.dispatch(setLoading(false))
    
    // Có thể hiển thị toast notification
    // toast.error(error.message)
    
    // Log error trong development
    if (import.meta.env.DEV) {
      console.error('API Error:', error)
    }
  })

  // Request Interceptor: Refresh token nếu cần
  addRequestInterceptor(async (config) => {
    const token = localStorage.getItem('token')
    const tokenExpiry = localStorage.getItem('tokenExpiry')
    
    // Kiểm tra token sắp hết hạn (trước 5 phút)
    if (token && tokenExpiry) {
      const expiryTime = new Date(tokenExpiry).getTime()
      const now = Date.now()
      const fiveMinutes = 5 * 60 * 1000
      
      if (expiryTime - now < fiveMinutes) {
        // Có thể gọi API refresh token ở đây
        // const newToken = await refreshToken()
        // localStorage.setItem('token', newToken)
      }
    }
    
    return config
  })
}






