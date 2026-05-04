/**
 * Export tất cả custom hooks
 */
export * from "./useCourses";
export * from "./useStudents";
export {
  useCreateStudentProfile,
  useStudentsByCourse,
  useStudentDetail,
  useUpdateStudentProfile,
  useUploadStudentImage,
} from "./useStudents";
export { useTrainingClasses } from "./useTrainingClasses";
export { useTrainingTypes } from "./useTrainingTypes";
export { useProfileTypes } from "./useProfileTypes";
export { useAdministrativeUnits } from "./useAdministrativeUnits";
export { useNationalities } from "./useNationalities";
export { useAccountingAccountTree } from "./useAccountingAccountTree";
export { useDebounce } from "./useDebounce";
export { useLocalStorage } from "./useLocalStorage";
export { useClickOutside } from "./useClickOutside";
export { useScheduleCenter } from "./useScheduleCenter";
export { useTrainingPlans } from "./useTrainingPlans";
export { useCoursesWithoutSchedule } from "./useCoursesWithoutSchedule";
export { useCreateDefaultSchedule, useCreateManySchedules, useUpdateManySchedules } from "./useCreateSchedule";
export {
  useTuitionProfiles,
  useTuitionPaymentHistory,
  useSearchLichSuNopHocPhi,
  useCreateTuitionPaymentHistory,
  useDeleteTuitionPaymentHistory,
  useNhatKyChungTu,
  useCreateNhatKyChungTu,
  useTongHopTaiKhoanChaTheoThoiGian,
  useTongHopTheoThang,
} from "./useTuition";
