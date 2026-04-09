import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schedulesApi } from "../lib/api";

/**
 * Hook để tạo lịch học mặc định
 */
export function useCreateDefaultSchedule() {
  return useMutation({
    mutationFn: (maKhoaHoc) => schedulesApi.createDefaultSchedule(maKhoaHoc),
  });
}

/**
 * Hook để tạo nhiều lịch học
 */
export function useCreateManySchedules() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => schedulesApi.createMany(data),
    onSuccess: () => {
      // Invalidate và refetch danh sách lịch học
      queryClient.invalidateQueries({ queryKey: ["scheduleCenter"] });
    },
  });
}

/**
 * Hook để cập nhật nhiều lịch học
 */
export function useUpdateManySchedules() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => schedulesApi.updateMany(data),
    onSuccess: () => {
      // Invalidate và refetch danh sách lịch học
      queryClient.invalidateQueries({ queryKey: ["scheduleCenter"] });
    },
  });
}

