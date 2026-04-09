import { useQuery } from "@tanstack/react-query";
import { schedulesApi } from "../lib/api";

/**
 * Hook để lấy lịch học toàn trung tâm
 * @param {Object} params - Tham số query: { page_index, page_size, ma_kh }
 */
export function useScheduleCenter(params = {}) {
  return useQuery({
    queryKey: ["scheduleCenter", params],
    queryFn: async () => {
      try {
        const response = await schedulesApi.getCenterSchedule(params);
        
        // Hỗ trợ cả hai format: array trực tiếp hoặc object có metadata
        if (Array.isArray(response)) {
          return {
            data: response,
            total: response.length,
            page_index: params.page_index || 1,
            page_size: params.page_size || 10,
            total_pages: Math.ceil(response.length / (params.page_size || 10)),
          };
        }
        
        // Nếu API trả về object với metadata
        if (response && typeof response === 'object') {
          return {
            data: response.data || response.items || response.results || [],
            total: response.total || response.total_count || response.count || 0,
            page_index: response.page_index || response.page || params.page_index || 1,
            page_size: response.page_size || response.pageSize || params.page_size || 10,
            total_pages: response.total_pages || response.totalPages || Math.ceil((response.total || 0) / (response.page_size || params.page_size || 10)),
          };
        }
        
        return {
          data: [],
          total: 0,
          page_index: 1,
          page_size: 10,
          total_pages: 0,
        };
      } catch (error) {
        console.error("Không thể lấy lịch học:", error.message);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // Cache 2 phút
    placeholderData: {
      data: [],
      total: 0,
      page_index: 1,
      page_size: 10,
      total_pages: 0,
    },
  });
}

