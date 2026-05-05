import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentsApi } from "../lib/api";
import { showSuccess, showError } from "../utils";

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
 * Hook để lấy danh sách học viên chưa phân khóa
 */
export function useUnassignedStudents() {
  return useQuery({
    queryKey: ["students", "unassigned"],
    queryFn: async () => {
      try {
        const data = await studentsApi.getUnassignedStudents();
        return data || [];
      } catch (error) {
        console.warn(
          "Không thể lấy danh sách học viên chưa phân khóa:",
          error.message,
        );
        return [];
      }
    },
    staleTime: 30000,
    placeholderData: [],
  });
}

/**
 * Hook để lấy danh sách giáo viên
 */
export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      try {
        const data = await studentsApi.getTeachers();
        return data || [];
      } catch (error) {
        console.warn("Không thể lấy danh sách giáo viên:", error.message);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: [],
  });
}

/**
 * Hook để tạo học viên chưa phân khóa
 */
export function useCreateUnassignedStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => studentsApi.createUnassignedStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students", "unassigned"] });
    },
  });
}

/**
 * Hook để cập nhật học viên chưa phân khóa
 */
export function useUpdateUnassignedStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => studentsApi.updateUnassignedStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students", "unassigned"] });
    },
  });
}

/**
 * Hook để lấy thông tin chi tiết học viên theo mã đăng ký
 */
export function useStudentDetail(maDK) {
  return useQuery({
    queryKey: ["students", "detail", maDK],
    queryFn: async () => {
      try {
        const data = await studentsApi.getStudentDetail(maDK);
        return data;
      } catch (error) {
        console.warn("Không thể lấy thông tin học viên:", error.message);
        throw error;
      }
    },
    enabled: !!maDK, // Chỉ fetch khi có maDK
    staleTime: 0, // Không cache để luôn lấy data mới nhất
  });
}

/**
 * Hook để cập nhật thông tin học viên (API /NguoiLxes với POST)
 */
export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => studentsApi.updateStudent(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["courses", "byDateRange"] });
      // Invalidate danh sách học viên của khóa học
      if (variables.ma_khoa_hoc) {
        queryClient.invalidateQueries({
          queryKey: ["students", "byCourse", variables.ma_khoa_hoc],
        });
      }
      // Invalidate thông tin chi tiết học viên
      if (variables.ma_dk) {
        queryClient.invalidateQueries({
          queryKey: ["students", "detail", variables.ma_dk],
        });
      }
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
 * Hook để upload ảnh thẻ cho học viên
 */
export function useUploadStudentImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ maDk, file, ma_khoa_hoc }) =>
      studentsApi.uploadCardImage(maDk, file),
    onSuccess: (_, variables) => {
      showSuccess("Tải ảnh thẻ thành công!");
      if (variables?.ma_khoa_hoc) {
        queryClient.invalidateQueries({
          queryKey: ["students", "byCourse", variables.ma_khoa_hoc],
        });
      }
    },
    onError: (error) => {
      showError(
        error?.message || "Tải ảnh thẻ không thành công. Vui lòng thử lại."
      );
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
