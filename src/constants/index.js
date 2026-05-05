/**
 * Application constants
 */

// Giới tính
export const GENDERS = [
  { value: "M", label: "Nam" },
  { value: "F", label: "Nữ" },
];

/** Giá trị gửi API `hinh_thuc_thanh_toan` */
export const PAYMENT_METHODS = [
  { value: "Tiền mặt", label: "Tiền mặt" },
  { value: "Chuyển khoản", label: "Chuyển khoản" },
];

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  COURSES: "/khoa-hoc/them",
  STUDENTS: "/hoc-vien/them",
  UNASSIGNED_STUDENTS: "/hoc-vien/chua-phan-khoa",
  EDIT_UNASSIGNED_STUDENT: "/hoc-vien/chua-phan-khoa/chinh-sua/:idHs",
  EDIT_STUDENT: "/hoc-vien/chinh-sua/:maDK",
  DASHBOARD: "/dashboard",
  SCHEDULE: "/lich-hoc",
  TUITION_PROFILES: "/ke-toan/ho-so-hoc-phi",
  TUITION_PAYMENT_HISTORY: "/ke-toan/ho-so-hoc-phi/:maDK",
  LICH_SU_NOP_HOC_PHI: "/ke-toan/lich-su-nop-hoc-phi",
  NHAT_KY_CHUNG_TU: "/ke-toan/nhat-ky-chung-tu",
  CAN_DOI_TAI_KHOAN: "/ke-toan/can-doi-tai-khoan",
  SETTINGS: "/cai-dat",
};
