/**
 * Export tất cả API modules
 */
export {
  api,
  addRequestInterceptor,
  addResponseInterceptor,
  addErrorInterceptor,
} from "./client";
export { coursesApi } from "./courses";
export { studentsApi } from "./students";
export { danhMucsApi } from "./danhMucs";
export { authApi } from "./auth";
export { schedulesApi } from "./schedules";
export { setupInterceptors } from "./interceptors";
