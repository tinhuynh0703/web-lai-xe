import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Tạo QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 phút
      gcTime: 1000 * 60 * 10, // 10 phút (trước đây là cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Không refetch khi component mount lại
      retry: false, // Không retry khi lỗi để tránh loading lâu
      retryOnMount: false, // Không retry khi mount
      networkMode: 'online',
    },
    mutations: {
      retry: false, // Không retry mutations
    },
  },
})

/**
 * QueryProvider component để wrap app với React Query
 */
export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && (
        // React Query Devtools - cài đặt: npm install @tanstack/react-query-devtools --save-dev
        // {<ReactQueryDevtools initialIsOpen={false} />}
        null
      )}
    </QueryClientProvider>
  )
}

