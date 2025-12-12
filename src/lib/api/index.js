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
export { setupInterceptors } from "./interceptors";
