import { useQuery } from "@tanstack/react-query";
import { danhMucsApi } from "../lib/api";

/**
 * Hook để lấy danh sách mã hạng đào tạo từ API
 * API trả về mảng string, transform sang format options cho SingleSelect (value, label)
 */
export function useTrainingClasses() {
  return useQuery({
    queryKey: ["trainingClassCodes"],
    queryFn: async () => {
      try {
        const data = await danhMucsApi.getTrainingClassCodes();
        return data.map((item) => {
          // API mới trả về { ma_hang, ma_hang_moi }
          // Hiển thị label = ma_hang_moi, value = ma_hang
          if (typeof item === "object") {
            const hangGplx = item.hang_gplx || item.value || item.label || "";
            const hangGplxMoi = item.ma_hang_gplx_moi || item.label || maHang;
            return {
              value: hangGplx,
              label: hangGplxMoi, // hiển thị ma_hang_moi trong dropdown
              hangGplx,
              hangGplxMoi,
            };
          }

          // Fallback nếu API trả về string
          return {
            value: item,
            label: item,
            maHang: item,
            maHangMoi: item,
          };
        });
      } catch (error) {
        console.warn("Không thể lấy danh sách mã hạng đào tạo:", error.message);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    placeholderData: [], // Data mặc định
  });
}
