import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tuitionApi } from "../lib/api";

export function useTuitionProfiles(maKhoaHoc, maHangDT) {
  return useQuery({
    queryKey: ["tuitionProfiles", maKhoaHoc, maHangDT],
    queryFn: async () =>
      tuitionApi.getTuitionProfilesByCourse({
        ma_khoa_hoc: maKhoaHoc,
        hang_dt: maHangDT,
      }),
    enabled: Boolean(maKhoaHoc && maHangDT),
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

export function useCreateTuitionPaymentHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => tuitionApi.createPaymentHistory(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tuitionPaymentHistory", variables?.ma_dk],
      });
    },
  });
}

export function useDeleteTuitionPaymentHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idNopTien }) =>
      tuitionApi.deletePaymentHistoryById(idNopTien),
    onSuccess: (_, variables) => {
      const maDk = variables?.maDk;
      if (maDk) {
        queryClient.invalidateQueries({
          queryKey: ["tuitionPaymentHistory", maDk],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["tuitionPaymentHistory"] });
      }
    },
  });
}

export function useNhatKyChungTu(fromDate, toDate) {
  return useQuery({
    queryKey: ["nhatKyChungTu", fromDate, toDate],
    queryFn: () =>
      tuitionApi.getNhatKyChungTu({
        fromDate,
        toDate,
      }),
    enabled: Boolean(fromDate && toDate),
    placeholderData: [],
  });
}

export function useCreateNhatKyChungTu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => tuitionApi.createNhatKyChungTu(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nhatKyChungTu"] });
    },
  });
}

export function useTongHopTaiKhoanChaTheoThoiGian(fromDate, toDate) {
  return useQuery({
    queryKey: ["tongHopTaiKhoanChaTheoThoiGian", fromDate, toDate],
    queryFn: async () => {
      const res = await tuitionApi.getTongHopTaiKhoanChaTheoThoiGian({
        fromDate,
        toDate,
      });
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    },
    enabled: Boolean(fromDate && toDate),
    placeholderData: [],
  });
}
