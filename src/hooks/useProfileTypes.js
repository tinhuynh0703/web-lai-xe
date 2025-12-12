import { useQuery } from "@tanstack/react-query";
import { danhMucsApi } from "../lib/api";

/**
 * Hook để lấy danh sách loại hồ sơ từ API
 */
export function useProfileTypes() {
  return useQuery({
    queryKey: ["profileTypes"],
    queryFn: async () => {
      try {
        const data = await danhMucsApi.getProfileTypes();
        return data || [];
      } catch (error) {
        console.warn("Không thể lấy danh sách loại hồ sơ:", error.message);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    placeholderData: [], // Data mặc định
  });
}





