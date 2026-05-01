import { api } from "./client";

export const tuitionApi = {
  getTuitionProfilesByCourse: (payload) =>
    api.post("/HoSoHocPhi/danh-sach-hoc-phi-khoa-hoc", payload),

  getPaymentHistoryByMaDk: (maDk) =>
    api.get(`/LichSuNopHocPhi/by-ma-dk/${encodeURIComponent(maDk)}`),
};
