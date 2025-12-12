import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "../lib/api";

/**
 * Hook để lấy danh sách tất cả khóa học
 */
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      try {
        return await coursesApi.getAll();
      } catch (error) {
        // Trả về mảng rỗng nếu API không có hoặc lỗi
        console.warn("API không khả dụng, sử dụng mock data:", error.message);
        return [];
      }
    },
    retry: false,
    staleTime: Infinity, // Không refetch tự động
    placeholderData: [], // Data mặc định
  });
}

/**
 * Hook để lấy thông tin một khóa học
 */
export function useCourse(id) {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: () => coursesApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook để tạo khóa học mới
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => coursesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

/**
 * Hook để cập nhật khóa học
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => coursesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", variables.id] });
    },
  });
}

/**
 * Hook để xóa khóa học
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => coursesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

/**
 * Hook để lấy danh sách khóa học theo thời gian (với body rỗng)
 */
export function useCoursesByDateRange() {
  return useQuery({
    queryKey: ["courses", "byDateRange"],
    queryFn: async () => {
      try {
        return await coursesApi.getByDateRange();
      } catch (error) {
        console.warn("API không khả dụng:", error.message);
        return [];
      }
    },
    retry: false,
    staleTime: 30000, // Cache trong 30 giây
    placeholderData: [], // Data mặc định
  });
}
