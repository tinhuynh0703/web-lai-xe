import { useQuery } from "@tanstack/react-query";
import { danhMucsApi } from "../lib/api";

/**
 * Hook để lấy danh sách đơn vị hành chính từ API
 */
export function useAdministrativeUnits() {
  return useQuery({
    queryKey: ["administrativeUnits"],
    queryFn: async () => {
      try {
        const data = await danhMucsApi.getAdministrativeUnits();
        return data || [];
      } catch (error) {
        console.warn(
          "Không thể lấy danh sách đơn vị hành chính:",
          error.message
        );
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    placeholderData: [], // Data mặc định
  });
}






