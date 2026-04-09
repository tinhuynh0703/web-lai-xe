import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "../lib/api";

/**
 * Hook để lấy danh sách khóa học chưa có lịch học
 */
export function useCoursesWithoutSchedule() {
  return useQuery({
    queryKey: ["coursesWithoutSchedule"],
    queryFn: async () => {
      try {
        const data = await coursesApi.getCoursesWithoutSchedule();
        return data || [];
      } catch (error) {
        console.error("Không thể lấy danh sách khóa học:", error.message);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // Cache 2 phút
    placeholderData: [],
  });
}

