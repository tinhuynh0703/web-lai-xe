import { api } from "./client";

export const tuitionApi = {
  getTuitionProfilesByCourse: (payload) =>
    api.post("/HoSoHocPhi/danh-sach-hoc-phi-khoa-hoc", payload),

  getPaymentHistoryByMaDk: (maDk) =>
    api.get(`/LichSuNopHocPhi/by-ma-dk/${encodeURIComponent(maDk)}`),

  /** POST body: các field có thể null */
  searchLichSuNopHocPhi: (payload) =>
    api.post("/LichSuNopHocPhi/search", payload, { timeoutMs: 60_000 }),

  createPaymentHistory: (payload) => api.post("/LichSuNopHocPhi", payload),

  deletePaymentHistoryById: (idNopTien) =>
    api.delete(`/LichSuNopHocPhi/${encodeURIComponent(idNopTien)}`),

  getNhatKyChungTu: ({ fromDate, toDate }) =>
    api.get("/NhatKyChungTu", {
      params: {
        fromDate,
        toDate,
      },
    }),

  getTongHopTaiKhoanChaTheoThoiGian: ({ fromDate, toDate }) =>
    api.get("/NhatKyChungTu/tong-hop-theo-tai-khoan-cha-theo-thoi-gian", {
      params: { fromDate, toDate },
    }),

  /** Tổng hợp theo tháng (bảng cân đối / thống kê học phí) */
  getTongHopTheoThang: ({ nam, thang }) =>
    api.get("/NhatKyChungTu/tong-hop-theo-thang", {
      params: { nam, thang },
    }),

  createNhatKyChungTu: (payload) => api.post("/NhatKyChungTu", payload),

  /** POST với query fromDate, toDate — trả về file (Excel) */
  exportFileHoaDonNopTienHocPhi: ({ fromDate, toDate }) => {
    const qs = new URLSearchParams({ fromDate, toDate }).toString();
    return api.post(
      `/NhatKyChungTu/file-hoa-don-nop-tien-hoc-phi?${qs}`,
      {},
      { blobResponse: true, timeoutMs: 120_000 },
    );
  },
};
