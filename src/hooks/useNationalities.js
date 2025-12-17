import { useQuery } from "@tanstack/react-query";
import { danhMucsApi } from "../lib/api";

/**
 * Hook để lấy danh sách loại quốc tịch từ API
 */
export function useNationalities() {
  return useQuery({
    queryKey: ["nationalities"],
    queryFn: async () => {
      try {
        const data = await danhMucsApi.getNationalities();
        return data || [];
      } catch (error) {
        console.warn("Không thể lấy danh sách quốc tịch:", error.message);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    placeholderData: [], // Data mặc định
  });
}




