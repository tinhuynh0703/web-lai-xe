import { useQuery } from "@tanstack/react-query";
import { danhMucsApi } from "../lib/api";

/**
 * Hook để lấy danh sách tên kế hoạch đào tạo
 */
export function useTrainingPlans() {
  return useQuery({
    queryKey: ["trainingPlans"],
    queryFn: async () => {
      try {
        const data = await danhMucsApi.getTrainingPlanNames();
        return data || [];
      } catch (error) {
        console.error("Không thể lấy danh sách kế hoạch đào tạo:", error.message);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    placeholderData: [],
  });
}

