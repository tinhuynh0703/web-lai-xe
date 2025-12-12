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
        // API trả về dạng: [{ ma_hang_dt: "A1", ten_hang_dt: "Hạng A1" }]
        return data.map((item) => ({
          value: item.ma_hang_dt || item.value || item,
          label: item.ten_hang_dt || item.label || item.ma_hang_dt || item,
        }));
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
