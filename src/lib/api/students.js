import { api } from "./client";
import { objectToFormData } from "../utils";

/**
 * API endpoints cho quản lý học viên
 */

export const studentsApi = {
  // Tạo thông tin học viên (multipart/form-data)
  createStudent: (data) => {
    const formData = objectToFormData(data);
    return api.post("/NguoiLxes", formData);
  },

  // Cập nhật thông tin học viên (cùng endpoint với create)
  updateStudent: (data) => api.put("/NguoiLxes", data),

  // Lấy danh sách học viên theo mã khóa học
  getStudentsByCourse: (maKH) =>
    api.get(`/NguoiLxes/danh-sach-hoc-vien/${maKH}`),

  // Lấy thông tin chi tiết học viên theo mã đăng ký
  getStudentDetail: (maDK) =>
    api.get(`/NguoiLxes/thong-tin-nguoi-lai-xe/${maDK}`),

  // Lấy danh sách học viên chưa phân khóa
  getUnassignedStudents: () => api.get("/HocVienChuaPhanKhoa"),

  // Lấy danh sách giáo viên
  getTeachers: () => api.get("/GiaoViens"),

  // Tạo học viên chưa phân khóa
  createUnassignedStudent: (data) => api.post("/HocVienChuaPhanKhoa", data),

  // Cập nhật học viên chưa phân khóa
  updateUnassignedStudent: (data) => api.put("/HocVienChuaPhanKhoa", data),

  // Upload ảnh thẻ cho học viên
  uploadCardImage: (maDk, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/NguoiLxes/upload-hinh-the/${maDk}`, formData);
  },
};
