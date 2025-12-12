import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentsApi } from "../lib/api";

/**
 * Hook để tạo thông tin học viên (API /NguoiLxes)
 */
export function useCreateStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => studentsApi.createStudent(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["courses", "byDateRange"] });
      // Invalidate danh sách học viên của khóa học vừa tạo
      if (variables.ma_khoa_hoc) {
        queryClient.invalidateQueries({
          queryKey: ["students", "byCourse", variables.ma_khoa_hoc],
        });
      }
    },
  });
}

/**
 * Hook để lấy danh sách học viên theo mã khóa học
 */
export function useStudentsByCourse(maKH) {
  return useQuery({
    queryKey: ["students", "byCourse", maKH],
    queryFn: async () => {
      try {
        const data = await studentsApi.getStudentsByCourse(maKH);
        return data || [];
      } catch (error) {
        console.warn("Không thể lấy danh sách học viên:", error.message);
        return [];
      }
    },
    enabled: !!maKH, // Chỉ fetch khi có maKH
    staleTime: 30000, // Cache 30 giây
    placeholderData: [], // Data mặc định
  });
}

/**
 * Hook để cập nhật học viên
 * Lưu ý: API method update() không còn tồn tại
 */
export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      console.warn("API method update() không còn tồn tại");
      throw new Error("API method không còn tồn tại");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["students", variables.id] });
    },
  });
}

/**
 * Hook để xóa học viên
 * Lưu ý: API method delete() không còn tồn tại
 */
export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      console.warn("API method delete() không còn tồn tại");
      throw new Error("API method không còn tồn tại");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

/**
 * Hook để tìm kiếm học viên
 * Lưu ý: API method search() không còn tồn tại
 */
export function useSearchStudents(query) {
  return useQuery({
    queryKey: ["students", "search", query],
    queryFn: async () => {
      console.warn("API method search() không còn tồn tại");
      return [];
    },
    enabled: false, // Disable vì API không tồn tại
  });
}
