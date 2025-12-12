import { api } from "./client";

/**
 * API endpoints cho danh mục
 */

export const danhMucsApi = {
  // Lấy danh sách mã hạng đào tạo (trả về mảng string)
  getTrainingClassCodes: () => api.get("/DanhMucs/ma-hang-gplx"),

  // Lấy danh sách loại hình đào tạo dựa trên mã hạng đào tạo
  getTrainingTypes: (maGplx) =>
    api.get(`/DanhMucs/loai-hinh-dao-tao/${maGplx}`),

  // Lấy danh sách loại hồ sơ
  getProfileTypes: () => api.get("/DanhMucs/loai-ho-so"),

  // Lấy danh sách đơn vị hành chính
  getAdministrativeUnits: () => api.get("/DanhMucs/don-vi-hanh-chinh"),

  // Lấy danh sách loại quốc tịch
  getNationalities: () => api.get("/DanhMucs/loai-quoc-tich"),
};
