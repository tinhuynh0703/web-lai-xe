/**
 * Application constants
 */

// Giới tính
export const GENDERS = [
  { value: "M", label: "Nam" },
  { value: "F", label: "Nữ" },
];

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  COURSES: "/khoa-hoc/them",
  STUDENTS: "/hoc-vien/them",
  EDIT_STUDENT: "/hoc-vien/chinh-sua/:maDK",
  DASHBOARD: "/dashboard",
  SCHEDULE: "/lich-hoc",
  TUITION_PROFILES: "/ke-toan/ho-so-hoc-phi",
  TUITION_PAYMENT_HISTORY: "/ke-toan/ho-so-hoc-phi/:maDK",
  LICH_SU_NOP_HOC_PHI: "/ke-toan/lich-su-nop-hoc-phi",
  NHAT_KY_CHUNG_TU: "/ke-toan/nhat-ky-chung-tu",
  BANG_CAN_DOI_TAI_KHOAN: "/ke-toan/bang-can-doi-tai-khoan",
  THONG_KE_HOC_PHI: "/ke-toan/thong-ke-hoc-phi",
};
