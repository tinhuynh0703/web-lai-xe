/**
 * Application configuration
 */

export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000,
  },
  app: {
    name: 'Trung Tâm Đào Tạo Lái Xe',
    version: '1.0.0',
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 30, 50, 100],
  },
}






