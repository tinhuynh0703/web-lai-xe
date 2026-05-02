import { api } from "./client";

export const tuitionApi = {
  getTuitionProfilesByCourse: (payload) =>
    api.post("/HoSoHocPhi/danh-sach-hoc-phi-khoa-hoc", payload),

  getPaymentHistoryByMaDk: (maDk) =>
    api.get(`/LichSuNopHocPhi/by-ma-dk/${encodeURIComponent(maDk)}`),

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

  createNhatKyChungTu: (payload) => api.post("/NhatKyChungTu", payload),
};
