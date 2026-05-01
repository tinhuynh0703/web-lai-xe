import * as yup from "yup";

export const trainingCourseSchema = yup.object({
  // Left column
  department: yup.string().optional().default(""), // Sở GTVT
  trainingFacility: yup.string().optional().default(""), // Cơ sở đào tạo
  courseCode: yup.string().optional().default(""), // Mã khóa học
  trainingClass: yup.string().trim().required("Hạng đào tạo là bắt buộc"), // Hạng đào tạo - required
  decisionNumberKG: yup.string().optional().default(""), // Số quyết định KG
  openingDate: yup
    .string()
    .trim()
    .required("Ngày khai giảng là bắt buộc")
    .test("is-not-empty", "Ngày khai giảng là bắt buộc", (value) => {
      return value !== undefined && value !== null && value !== "";
    }), // Ngày khai giảng - required
  examDate: yup.string().optional().default(""), // Ngày thi
  totalStudents: yup
    .mixed()
    .required("Tổng số học viên là bắt buộc")
    .transform((value, originalValue) => {
      // Convert number to string, or return original if already string
      if (
        originalValue === null ||
        originalValue === undefined ||
        originalValue === ""
      ) {
        return "";
      }
      if (typeof originalValue === "number") {
        return String(originalValue);
      }
      return String(originalValue);
    })
    .test("is-not-empty", "Tổng số học viên là bắt buộc", (value) => {
      return value !== undefined && value !== null && value !== "";
    })
    .test("is-number", "Tổng số học viên phải là số", (value) => {
      if (!value || value === "") return false;
      return /^\d+$/.test(String(value));
    }), // Tổng số học viên - required
  trainingObjectives: yup.string().optional().default(""), // Mục tiêu đào tạo
  notes: yup.string().optional().default(""), // Ghi chú

  // Right column
  courseName: yup
    .string()
    .trim()
    .required("Tên khóa học là bắt buộc")
    .test("is-not-empty", "Tên khóa học là bắt buộc", (value) => {
      return value !== undefined && value !== null && value.trim() !== "";
    }), // Tên khóa học - required
  trainingType: yup.string().nullable().default(null), // Loại hình đào tạo - có thể null
  decisionDateKG: yup.string().optional().default(""), // Ngày quyết định KG
  closingDate: yup
    .string()
    .trim()
    .required("Ngày bế giảng là bắt buộc")
    .test("is-not-empty", "Ngày bế giảng là bắt buộc", (value) => {
      return value !== undefined && value !== null && value !== "";
    }), // Ngày bế giảng - required
  assessmentDate: yup.string().optional().default(""), // Ngày sát hạch
});

// Schema cho học viên (đơn giản)
export const studentSchema = yup.object({
  fullName: yup
    .string()
    .required("Họ tên là bắt buộc")
    .min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: yup.string().email("Email không hợp lệ").required(),
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  address: yup.string().optional(),
  dateOfBirth: yup.string().required("Ngày sinh là bắt buộc"),
  licenseType: yup.string().required("Vui lòng chọn loại bằng lái"),
});

// Schema cho form thu nhận hồ sơ cấp mới (đầy đủ)
export const studentEnrollmentSchema = yup.object({
  // Chọn khóa học
  courseId: yup.string().required("Vui lòng chọn khóa học"),
  gplxClass: yup.string().optional(),
  minimumAge: yup.string().optional(),
  openingDate: yup.string().optional(),
  closingDate: yup.string().optional(),
  trainingClass: yup.string().optional(),
  profileReceiveDate: yup.string().optional(),
  totalStudents: yup.string().optional(),
  currentStudents: yup.string().optional(),

  // Thông tin hồ sơ - Left column
  registrationCode: yup.string().optional(),
  fullName: yup
    .string()
    .required("Họ và tên là bắt buộc")
    .min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  printName: yup.string().optional(),
  dateOfBirth: yup.string().required("Ngày sinh là bắt buộc"),
  gender: yup.string().required("Giới tính là bắt buộc"),
  nationality: yup.string().required("Quốc tịch là bắt buộc"),
  idCard: yup
    .string()
    .required("CMT/HC là bắt buộc")
    .min(9, "CMT/HC phải có ít nhất 9 ký tự"),
  idCardIssueDate: yup.string().optional(),
  idCardIssuePlace: yup.string().optional(),
  permanentAddress: yup
    .string()
    .required("Địa chỉ nơi đăng ký hộ khẩu thường trú là bắt buộc"),
  permanentAddressDetail: yup.string().optional(),
  currentAddress: yup.string().required("Địa chỉ nơi cư trú là bắt buộc"),
  currentAddressDetail: yup.string().optional(),
  notes: yup.string().optional(),

  // Thông tin hồ sơ - Right column
  // profileNumber: yup.string().optional(),

  // Giấy tờ kèm theo
  hasApplicationForm: yup.boolean().optional(),
  hasIdCardCopy: yup.boolean().optional(),
  hasHealthCertificate: yup.boolean().optional(),

  // Ảnh chân dung
  drivingYears: yup.string().optional(),
  drivingKilometers: yup.string().optional(),

  // In GPLX
  printLicenseType: yup.string().optional(),
});

// Schema cho form đăng ký
export const enrollmentSchema = yup.object({
  courseId: yup.string().required("Vui lòng chọn khóa học"),
  studentId: yup.string().required("Vui lòng chọn học viên"),
});

// Schema cho form nộp học phí
export const tuitionPaymentSchema = yup.object({
  soTienNop: yup
    .number()
    .typeError("Số tiền nộp phải là số")
    .required("Số tiền nộp là bắt buộc")
    .moreThan(0, "Số tiền nộp phải lớn hơn 0"),
  ngayNop: yup.string().trim().required("Ngày nộp là bắt buộc"),
  taiKhoanNo: yup.string().trim().required("Tài khoản nợ là bắt buộc"),
  taiKhoanCo: yup.string().trim().required("Tài khoản có là bắt buộc"),
  soBienLai: yup.string().optional().default(""),
  ghiChu: yup.string().optional().default(""),
});

// Schema cho form nhật ký chứng từ
export const nhatKyChungTuSchema = yup.object({
  soChungTu: yup.string().trim().required("Số chứng từ là bắt buộc"),
  ngayLap: yup.string().trim().required("Ngày lập là bắt buộc"),
  dienGiai: yup.string().trim().required("Diễn giải là bắt buộc"),
  taiKhoanNo: yup.string().trim().required("Tài khoản nợ là bắt buộc"),
  taiKhoanCo: yup.string().trim().required("Tài khoản có là bắt buộc"),
  soTien: yup
    .number()
    .typeError("Số tiền phải là số")
    .required("Số tiền là bắt buộc")
    .moreThan(0, "Số tiền phải lớn hơn 0"),
  ghiChu: yup.string().optional().default(""),
});
