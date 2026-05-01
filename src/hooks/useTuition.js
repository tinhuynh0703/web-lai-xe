import { useQuery } from "@tanstack/react-query";
import { tuitionApi } from "../lib/api";

export function useTuitionProfiles(maKhoaHoc, maHangGplx) {
  return useQuery({
    queryKey: ["tuitionProfiles", maKhoaHoc, maHangGplx],
    queryFn: async () =>
      tuitionApi.getTuitionProfilesByCourse({
        ma_khoa_hoc: maKhoaHoc,
        ma_hang_gplx: maHangGplx,
      }),
    enabled: Boolean(maKhoaHoc && maHangGplx),
    placeholderData: [],
  });
}

export function useTuitionPaymentHistory(maDk) {
  return useQuery({
    queryKey: ["tuitionPaymentHistory", maDk],
    queryFn: () => tuitionApi.getPaymentHistoryByMaDk(maDk),
    enabled: Boolean(maDk),
    placeholderData: [],
  });
}
