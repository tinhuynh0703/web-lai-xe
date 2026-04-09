import { api } from "./client";

/**
 * API endpoints cho quản lý lịch học
 */

export const schedulesApi = {
  // Lấy lịch học toàn trung tâm (POST method)
  getCenterSchedule: (params = {}) => {
    const { page_index = 1, page_size = 10, ma_kh } = params;
    
    const body = {};
    if (page_index) body.page_index = page_index;
    if (page_size) body.page_size = page_size;
    if (ma_kh) body.ma_kh = ma_kh;
    
    return api.post("/LichHocs/lich-hoc-toan-trung-tam", body);
  },

  // Tạo lịch học mặc định (truyền maKhoaHoc qua parameter)
  createDefaultSchedule: (maKhoaHoc) => {
    return api.post(`/LichHocs/tao-lich-hoc-mac-dinh?maKhoaHoc=${maKhoaHoc}`, {});
  },

  // Tạo nhiều lịch học
  createMany: (data) => {
    return api.post("/LichHocs/create-many", data);
  },

  // Cập nhật nhiều lịch học
  updateMany: (data) => {
    return api.put("/LichHocs/update-many", data);
  },
};

