import { useQuery } from "@tanstack/react-query";
import { danhMucsApi } from "../lib/api";

/**
 * Hook để lấy danh sách loại hình đào tạo dựa trên mã hạng đào tạo
 * API trả về mảng object với { ma_hang_dt, ten_hang_dt }
 * - value: ma_hang_dt (để submit)
 * - label: ten_hang_dt (để hiển thị)
 */
export function useTrainingTypes(maHangDaoTao) {
  return useQuery({
    queryKey: ["trainingTypes", maHangDaoTao],
    queryFn: async () => {
      if (!maHangDaoTao) {
        return [];
      }
      try {
        const data = await danhMucsApi.getTrainingTypes(maHangDaoTao);
        // API trả về dạng: [{ ma_gplx: "A1", ten_hang_dt: "Hạng A1" }] hoặc [{ ma_hang_dt: "A1", ten_hang_dt: "Hạng A1" }]
        return data.map((item) => {
          // Đảm bảo value và label luôn là string, không bao giờ là object
          const value = item.ma_gplx || item.ma_hang_dt || item.value || String(item?.value || item || "");
          const label = item.ten_hang_dt || item.label || String(item?.label || value || "");
          
          // Nếu vẫn là object, chuyển thành string
          const safeValue = typeof value === "object" ? JSON.stringify(value) : String(value);
          const safeLabel = typeof label === "object" ? JSON.stringify(label) : String(label);
          
          return {
            value: safeValue,
            label: safeLabel,
          };
        });
      } catch (error) {
        console.warn(
          "Không thể lấy danh sách loại hình đào tạo:",
          error.message
        );
        // Trả về mảng rỗng nếu API lỗi
        return [];
      }
    },
    enabled: !!maHangDaoTao, // Chỉ fetch khi có maHangDaoTao
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    placeholderData: [], // Data mặc định
  });
}
