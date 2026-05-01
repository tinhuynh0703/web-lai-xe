import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    mutationFn: ({ idNopTien }) => tuitionApi.deletePaymentHistoryById(idNopTien),
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
