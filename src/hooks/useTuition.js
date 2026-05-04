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

export function useSearchLichSuNopHocPhi() {
  return useMutation({
    mutationFn: async (payload) => {
      const res = await tuitionApi.searchLichSuNopHocPhi(payload);
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    },
  });
}

export function useCreateTuitionPaymentHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => tuitionApi.createPaymentHistory(payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["tuitionPaymentHistory", variables?.ma_dk],
      });
      // Backend tạo kèm nhật ký chứng từ — global refetchOnMount=false nên chỉ invalidate không đủ;
      // refetchQueries type 'all' cập nhật cache kể cả khi trang NKCT chưa mở.
      await queryClient.invalidateQueries({ queryKey: ["nhatKyChungTu"] });
      await queryClient.refetchQueries({
        queryKey: ["nhatKyChungTu"],
        type: "all",
      });
      await queryClient.invalidateQueries({ queryKey: ["tongHopTheoThang"] });
      await queryClient.refetchQueries({
        queryKey: ["tongHopTheoThang"],
        type: "all",
      });
    },
  });
}

export function useDeleteTuitionPaymentHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idNopTien }) =>
      tuitionApi.deletePaymentHistoryById(idNopTien),
    onSuccess: async (_, variables) => {
      const maDk = variables?.maDk;
      if (maDk) {
        await queryClient.invalidateQueries({
          queryKey: ["tuitionPaymentHistory", maDk],
        });
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["tuitionPaymentHistory"],
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["nhatKyChungTu"] });
      await queryClient.refetchQueries({
        queryKey: ["nhatKyChungTu"],
        type: "all",
      });
      await queryClient.invalidateQueries({ queryKey: ["tongHopTheoThang"] });
      await queryClient.refetchQueries({
        queryKey: ["tongHopTheoThang"],
        type: "all",
      });
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
    // App mặc định refetchOnMount: false — sau nộp học phí cần thấy bản ghi mới khi vào lại trang
    refetchOnMount: true,
    staleTime: 0,
  });
}

export function useCreateNhatKyChungTu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => tuitionApi.createNhatKyChungTu(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["nhatKyChungTu"] });
      await queryClient.refetchQueries({
        queryKey: ["nhatKyChungTu"],
        type: "all",
      });
      await queryClient.invalidateQueries({ queryKey: ["tongHopTheoThang"] });
      await queryClient.refetchQueries({
        queryKey: ["tongHopTheoThang"],
        type: "all",
      });
    },
  });
}

export function useTongHopTheoThang(nam, thang) {
  const valid =
    typeof nam === "number" &&
    typeof thang === "number" &&
    Number.isFinite(nam) &&
    Number.isFinite(thang) &&
    thang >= 1 &&
    thang <= 12 &&
    nam >= 2000;

  return useQuery({
    queryKey: ["tongHopTheoThang", nam, thang],
    queryFn: () =>
      tuitionApi.getTongHopTheoThang({
        nam: Number(nam),
        thang: Number(thang),
      }),
    enabled: valid,
    refetchOnMount: true,
    staleTime: 0,
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
