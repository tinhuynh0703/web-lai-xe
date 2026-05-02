import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Camera,
  FileImage,
  FolderOpen,
  FileText,
  Trash2,
  Printer,
  FileSpreadsheet,
  ArrowLeft,
  RotateCcw,
  Save,
} from "lucide-react";
import { Button } from "../components/ui";
import { Table } from "../components/ui";
import { Modal } from "../components/ui";
import { PageHeader } from "../components/layout";
import {
  Input,
  SingleSelect,
  Form,
  Textarea,
  Checkbox,
  DatePicker,
} from "../components/forms";
import { studentEnrollmentSchema } from "../lib/validations/schemas";
import { parseFormOptionalInt } from "../lib/utils";
import { GENDERS } from "../constants";
import {
  useCoursesByDateRange,
  useProfileTypes,
  useAdministrativeUnits,
  useNationalities,
  useCreateStudentProfile,
  useStudentsByCourse,
  useTrainingClasses,
  useUploadStudentImage,
} from "../hooks";

function UploadImageAction({ maDk, courseId, uploadStudentImage }) {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    event.stopPropagation();
    const file = event.target.files?.[0];
    if (!file || !maDk) return;

    uploadStudentImage.mutate({
      maDk,
      file,
      ma_khoa_hoc: courseId,
    });
  };

  const handleButtonClick = (event) => {
    event.stopPropagation();
    inputRef.current?.click();
  };

  if (!maDk) return null;

  return (
    <div
      className="flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleButtonClick}
      >
        Tải ảnh thẻ
      </Button>
    </div>
  );
}
import { showSuccess, showError } from "../utils";

const OLD_LICENSE_CLASSES = [
  "A1",
  "A11",
  "A2",
  "A3",
  "B1",
  "B11",
  "B12",
  "B13",
  "B14",
  "B15",
  "B2",
  "C",
  "D",
  "E",
  "FB2",
  "FC",
  "FD",
  "FE",
].map((item) => ({ value: item, label: item }));

export default function AddStudentPage() {
  const createStudentProfile = useCreateStudentProfile();
  const uploadStudentImage = useUploadStudentImage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [portraitFile, setPortraitFile] = useState(null);
  const portraitInputRef = useRef(null);

  const methods = useForm({
    resolver: yupResolver(studentEnrollmentSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      // Chọn khóa học
      courseId: "",
      gplxClass: "",
      minimumAge: "18",
      openingDate: "",
      closingDate: "",
      trainingClass: "",
      profileReceiveDate: "",
      totalStudents: "",
      currentStudents: "",

      // Thông tin hồ sơ
      registrationCode: "",
      fullName: "",
      printName: "",
      dateOfBirth: "",
      gender: "",
      nationality: "VNM",
      idCard: "",
      idCardIssueDate: "",
      idCardIssuePlace: "",
      permanentAddress: "",
      permanentAddressDetail: "",
      currentAddress: "",
      currentAddressDetail: "",
      notes: "",
      // Giấy phép lái xe hiện có
      existingLicenseNumber: "",
      existingLicenseStatus: "",
      existingLicenseClass: "",
      existingLicenseTestDate: "",
      existingLicenseIssueDate: "",
      existingLicenseExpiryDate: "",
      existingLicenseIssuingUnit: "",
      existingLicenseIssuingCountry: "VNM",

      profileTypes: {},

      drivingYears: "",
      drivingKilometers: "",
    },
  });

  const resetApplicantSection = () => {
    // Reset về defaultValues ban đầu
    methods.reset(
      {
        // Chọn khóa học
        courseId: "",
        gplxClass: "",
        minimumAge: "18",
        openingDate: "",
        closingDate: "",
        trainingClass: "",
        profileReceiveDate: "",
        totalStudents: "",
        currentStudents: "",

        // Thông tin hồ sơ
        registrationCode: "",
        fullName: "",
        printName: "",
        dateOfBirth: "",
        gender: "",
        nationality: "VNM",
        idCard: "",
        idCardIssueDate: "",
        idCardIssuePlace: "",
        permanentAddress: "",
        permanentAddressDetail: "",
        currentAddress: "",
        currentAddressDetail: "",
        notes: "",
        // Giấy phép lái xe hiện có
        existingLicenseNumber: "",
        existingLicenseStatus: "",
        existingLicenseClass: "",
        existingLicenseTestDate: "",
        existingLicenseIssueDate: "",
        existingLicenseExpiryDate: "",
        existingLicenseIssuingUnit: "",
        existingLicenseIssuingCountry: "VNM",

        profileTypes: {},

        drivingYears: "",
        drivingKilometers: "",
      },
      {
        keepErrors: false,
        keepDirty: false,
        keepTouched: false,
      },
    );
  };

  const resetStudentProfileSection = () => {
    // Chỉ reset phần thông tin hồ sơ, giữ nguyên form chọn khóa học
    const currentValues = methods.getValues();
    methods.reset(
      {
        // Giữ nguyên các trường chọn khóa học
        courseId: currentValues.courseId || "",
        gplxClass: currentValues.gplxClass || "",
        minimumAge: currentValues.minimumAge || "18",
        openingDate: currentValues.openingDate || "",
        closingDate: currentValues.closingDate || "",
        trainingClass: currentValues.trainingClass || "",
        profileReceiveDate: currentValues.profileReceiveDate || "",
        totalStudents: currentValues.totalStudents || "",
        currentStudents: currentValues.currentStudents || "",

        // Reset thông tin hồ sơ
        registrationCode: "",
        fullName: "",
        printName: "",
        dateOfBirth: "",
        gender: "",
        nationality: "VNM",
        idCard: "",
        idCardIssueDate: "",
        idCardIssuePlace: "",
        permanentAddress: "",
        permanentAddressDetail: "",
        currentAddress: "",
        currentAddressDetail: "",
        notes: "",
        // Giấy phép lái xe hiện có
        existingLicenseNumber: "",
        existingLicenseStatus: "",
        existingLicenseClass: "",
        existingLicenseTestDate: "",
        existingLicenseIssueDate: "",
        existingLicenseExpiryDate: "",
        existingLicenseIssuingUnit: "",
        existingLicenseIssuingCountry: "VNM",

        profileTypes: {},

        drivingYears: "",
        drivingKilometers: "",
      },
      {
        keepErrors: false,
        keepDirty: false,
        keepTouched: false,
      },
    );
    // Reset ảnh chân dung
    setPortraitFile(null);
    if (portraitInputRef.current) {
      portraitInputRef.current.value = "";
    }
  };

  const courseId = methods.watch("courseId");

  const { data: studentsData = [], isLoading: isLoadingStudents } =
    useStudentsByCourse(courseId);

  const formatDateFromYYYYMMDD = (dateString) => {
    if (!dateString || dateString.length !== 8) return "-";
    try {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "-";
    }
  };

  const formatDateFromISO = (isoString) => {
    if (!isoString) return "-";
    try {
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "-";
    }
  };

  const formatGender = (gender) => {
    if (!gender) return "-";
    if (gender === "F") return "Nữ";
    if (gender === "M") return "Nam";
    return gender;
  };

  const courseStudents = useMemo(() => {
    if (!studentsData || studentsData.length === 0) return [];

    return studentsData.map((student) => ({
      maDK: student.ma_dk || student.so_cmt || "", // Lưu ma_dk để dùng cho API
      fullName: student.ho_va_ten || "-",
      dateOfBirth: formatDateFromYYYYMMDD(student.ngay_sinh),
      gender: formatGender(student.gioi_tinh),
      nationality: "-",
      idCard: student.so_cmt || "-",
      permanentAddress: student.noi_thuong_tru || "-",
      currentAddress: student.noi_cu_tru || "-",
      imagePath: "-",
      receiveDate: formatDateFromISO(student.ngay_nhan_hso),
    }));
  }, [studentsData]);

  const filteredCourseStudents = useMemo(() => {
    if (!studentSearch.trim()) return courseStudents;
    const term = studentSearch.toLowerCase();
    return courseStudents.filter((s) =>
      [s.fullName, s.idCard, s.permanentAddress, s.currentAddress]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term)),
    );
  }, [courseStudents, studentSearch]);

  const convertDateToISO = (dateString) => {
    if (!dateString) return null;

    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    const isoString = isDateOnly
      ? new Date(`${dateString}T00:00:00.000Z`)
      : new Date(dateString);

    if (isNaN(isoString.getTime())) return null;
    return isoString.toISOString();
  };

  // Hàm chuyển đổi ngày thành ISO string chỉ có phần ngày (không có giờ)
  // Dùng cho các trường ngày như ngày KG, ngày BG, ngày nhận HS, v.v.
  const convertDateToISODateOnly = (dateString) => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;

      // Lấy phần ngày và set giờ về 00:00:00.000Z
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
    } catch (error) {
      return null;
    }
  };

  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString) return "";
    const normalized = dateString.includes("T")
      ? dateString.split("T")[0]
      : dateString;
    const cleaned = normalized.replaceAll("-", "");
    if (cleaned.length === 8) return cleaned;
    try {
      const date = new Date(normalized);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}${month}${day}`;
    } catch (error) {
      return "";
    }
  };

  const findAdministrativeUnit = (value) => {
    if (!value) return null;
    return administrativeUnits.find((unit) => unit.ma_dvhc === value);
  };

  /**
   * Tách tên đầy đủ thành họ đệm và tên
   * @param {string} fullName - Tên đầy đủ (ví dụ: "Huynh Tri Tin")
   * @returns {Object} - { hoDem: "Huynh Tri", ten: "Tin" }
   */
  const splitFullName = (fullName) => {
    if (!fullName || typeof fullName !== "string") {
      return { hoDem: "", ten: "" };
    }

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      return { hoDem: "", ten: "" };
    }

    const nameParts = trimmedName.split(/\s+/).filter(Boolean);

    if (nameParts.length === 0) {
      return { hoDem: "", ten: "" };
    }

    if (nameParts.length === 1) {
      // Nếu chỉ có 1 từ, coi đó là tên
      return { hoDem: "", ten: nameParts[0] };
    }

    // Nếu có nhiều hơn 1 từ: tất cả trừ từ cuối là họ đệm, từ cuối là tên
    const ten = nameParts[nameParts.length - 1];
    const hoDem = nameParts.slice(0, -1).join(" ");

    return { hoDem, ten };
  };

  const onSubmit = (data) => {
    const duplicateStudent = courseStudents.find(
      (s) => s.idCard === data.idCard,
    );
    if (duplicateStudent) {
      setModalMessage(
        "Số CMND/ HC bạn nhập đã có trong khóa học này. Xin vui lòng nhập lại số khác",
      );
      setIsModalOpen(true);
      return;
    }

    const permanentAddressUnit = findAdministrativeUnit(data.permanentAddress);
    const currentAddressUnit = findAdministrativeUnit(data.currentAddress);

    const giayTos = [];
    if (data.profileTypes) {
      Object.entries(data.profileTypes).forEach(([maLoaiHs, isSelected]) => {
        if (isSelected === true) {
          const profileType = profileTypes.find(
            (pt) => pt.ma_loai_hs.toString() === maLoaiHs,
          );
          if (profileType) {
            giayTos.push({
              ma_gt: profileType.ma_loai_hs,
              ten_gt: profileType.ten_loai_hs,
            });
          }
        }
      });
    }

    // Tách tên đầy đủ thành họ đệm và tên
    const { hoDem, ten } = splitFullName(data.fullName || "");

    const payload = {
      MaCsdt: "48012",
      HoDemNlx: hoDem,
      TenNlx: ten,
      MaQuocTich: data.nationality || "",
      NgaySinh: formatDateToYYYYMMDD(data.dateOfBirth),
      SoCmt: data.idCard || "",
      NgayCapCmt: convertDateToISODateOnly(data.idCardIssueDate),
      NoiCapCmt: data.idCardIssuePlace || "",
      GhiChu: data.notes || "",
      GioiTinh: data.gender || "",
      SoCmndCu: "",
      HangGplx: data.gplxClass || "",
      HangDaoTao: data.trainingClass || "",
      MaKhoaHoc: data.courseId || "",
      NamHocLx: 0,
      NoiTtMaDvhc: permanentAddressUnit?.ma_dvhc || "",
      NoiTtMaDvql: permanentAddressUnit?.ma_dvql || "",
      NoiCtMaDvhc: currentAddressUnit?.ma_dvhc || "",
      NoiCtMaDvql: currentAddressUnit?.ma_dvql || "",
      SoNamLx: parseFormOptionalInt(data.drivingYears),
      SoKmLxanToan: parseFormOptionalInt(data.drivingKilometers),
      GiayTos: giayTos,
      // Giấy phép lái xe đã có
      SoGplxdaCo: data.existingLicenseNumber || "",
      HangGplxdaCo: data.existingLicenseClass || "",
      NgayTtgplxdaCo:
        convertDateToISODateOnly(data.existingLicenseTestDate) || "",
      NgayCapGplxdaCo:
        convertDateToISODateOnly(data.existingLicenseIssueDate) || "",
      NgayHhgplxdaCo:
        convertDateToISODateOnly(data.existingLicenseExpiryDate) || "",
      DonViCapGplxdaCo: data.existingLicenseIssuingUnit || "",
      NoiCapGplxdaCo: data.existingLicenseIssuingCountry || "VNM",
    };

    // Thêm file ảnh chân dung nếu có
    if (portraitFile) {
      payload.file = portraitFile;
    }

    createStudentProfile.mutate(payload, {
      onSuccess: () => {
        showSuccess("Thêm học viên thành công!");
        resetStudentProfileSection();
      },
      onError: (error) => {
        showError(
          error.message || "Có lỗi xảy ra khi thêm học viên. Vui lòng thử lại.",
        );
      },
    });
  };

  // Sử dụng useWatch để đảm bảo component re-render khi fullName thay đổi
  const fullName = useWatch({
    control: methods.control,
    name: "fullName",
  });
  const existingLicenseStatus = useWatch({
    control: methods.control,
    name: "existingLicenseStatus",
    defaultValue: "",
  });
  const existingLicenseClass = useWatch({
    control: methods.control,
    name: "existingLicenseClass",
    defaultValue: "",
  });

  const { data: courses = [], isLoading: isLoadingCourses } =
    useCoursesByDateRange();

  const { data: profileTypes = [], isLoading: isLoadingProfileTypes } =
    useProfileTypes();

  const {
    data: administrativeUnits = [],
    isLoading: isLoadingAdministrativeUnits,
  } = useAdministrativeUnits();

  const { data: nationalities = [], isLoading: isLoadingNationalities } =
    useNationalities();

  const { data: gplxClasses = [], isLoading: isLoadingGplxClasses } =
    useTrainingClasses();

  const administrativeUnitOptions = useMemo(
    () =>
      administrativeUnits.map((unit) => ({
        value: unit.ma_dvhc,
        label: unit.ten_day_du,
      })),
    [administrativeUnits],
  );

  const nationalityOptions = useMemo(
    () =>
      nationalities.map((nationality) => ({
        value: nationality.ma,
        label: nationality.ten_vn,
      })),
    [nationalities],
  );

  const selectedCourse = useMemo(() => {
    if (!courseId) return null;
    return courses.find((c) => c.ma_kh === courseId);
  }, [courses, courseId]);

  const formatDateForDisplay = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return isoString;
    }
  };

  const formatToDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Hàm format ngày thành YYYY-MM-DD (chỉ ngày, không có giờ) cho input type="date"
  const formatToDateLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (selectedCourse && courseId) {
      methods.setValue("gplxClass", selectedCourse.hang_gplx || "");
      methods.setValue("trainingClass", selectedCourse.hang_dt || "");
      methods.setValue("totalStudents", selectedCourse.tong_so_hv || "");
      methods.setValue("currentStudents", selectedCourse.tong_so_hv || "");
      methods.setValue(
        "openingDate",
        formatToDateLocal(selectedCourse.ngay_kg),
      );
      methods.setValue(
        "closingDate",
        formatToDateLocal(selectedCourse.ngay_bg),
      );
      methods.setValue(
        "profileReceiveDate",
        formatToDateLocal(selectedCourse.ngay_nhan_hs),
      );
      methods.setValue("minimumAge", selectedCourse.tuoi_toi_thieu || "18");
    }
  }, [courseId, selectedCourse, methods]);

  // Tự động điền "Tên in" khi "Họ và tên" thay đổi
  useEffect(() => {
    // Chỉ cập nhật khi fullName có giá trị (không phải undefined, null, hoặc empty string)
    if (fullName) {
      methods.setValue("printName", fullName, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
    } else if (fullName === "") {
      // Nếu fullName là empty string, cũng clear printName
      methods.setValue("printName", "", {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [fullName, methods]);

  useEffect(() => {
    if (profileTypes.length > 0) {
      const currentProfileTypes = methods.getValues("profileTypes") || {};
      const newProfileTypes = { ...currentProfileTypes };

      profileTypes.forEach((type) => {
        if (!(type.ma_loai_hs in newProfileTypes)) {
          newProfileTypes[type.ma_loai_hs] = true;
        }
      });

      methods.setValue("profileTypes", newProfileTypes);
    }
  }, [profileTypes, methods]);

  // Tự động chọn khóa học từ location state (khi điều hướng từ trang tạo khóa học)
  useEffect(() => {
    const courseIdFromState = location.state?.courseId;
    if (courseIdFromState && courses.length > 0) {
      // Kiểm tra xem khóa học có tồn tại trong danh sách không
      const courseExists = courses.some((c) => c.ma_kh === courseIdFromState);
      if (courseExists) {
        methods.setValue("courseId", courseIdFromState);
        // Xóa state để tránh chọn lại khi refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, courses, methods]);

  const watchedProfileTypes =
    useWatch({
      control: methods.control,
      name: "profileTypes",
      defaultValue: {},
    }) || {};

  const allProfileTypesSelected =
    profileTypes.length > 0 &&
    profileTypes.every((type) => watchedProfileTypes[type.ma_loai_hs] === true);

  const handleSelectAll = () => {
    const newValue = !allProfileTypesSelected;

    profileTypes.forEach((type) => {
      methods.setValue(`profileTypes.${type.ma_loai_hs}`, newValue, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    });
  };

  const courseOptions = useMemo(
    () =>
      courses.map((course) => ({
        value: course.ma_kh,
        label: `${course.ma_kh || ""} - ${
          course.ten_kh || ""
        } (ngày KG: ${formatDateForDisplay(course.ngay_kg)})`,
      })),
    [courses],
  );

  const existingLicenseClassOptions = useMemo(() => {
    if (existingLicenseStatus === "Cu") {
      return OLD_LICENSE_CLASSES;
    }
    return gplxClasses;
  }, [existingLicenseStatus, gplxClasses]);

  const isLoadingExistingLicenseClasses =
    existingLicenseStatus === "Moi" ? isLoadingGplxClasses : false;

  useEffect(() => {
    if (!existingLicenseClass) return;
    const isValid = existingLicenseClassOptions.some(
      (option) => option.value === existingLicenseClass,
    );
    if (!isValid) {
      methods.setValue("existingLicenseClass", "");
    }
  }, [existingLicenseClass, existingLicenseClassOptions, methods]);

  const studentColumns = useMemo(
    () => [
      {
        header: "STT",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
      },
      {
        accessorKey: "fullName",
        header: "Họ và tên",
        enableSorting: true,
      },
      {
        accessorKey: "dateOfBirth",
        header: "Ngày sinh",
        enableSorting: false,
      },
      {
        accessorKey: "gender",
        header: "Giới tính",
        enableSorting: true,
      },
      {
        accessorKey: "idCard",
        header: "CMT/HC",
        enableSorting: false,
      },
      {
        accessorKey: "permanentAddress",
        header: "Nơi đăng ký HKTT",
        enableSorting: false,
      },
      {
        accessorKey: "currentAddress",
        header: "Nơi cư trú",
        enableSorting: false,
      },
      {
        accessorKey: "imagePath",
        header: "Đường dẫn ảnh",
        enableSorting: false,
      },
      {
        accessorKey: "receiveDate",
        header: "Ngày nhận HS",
        enableSorting: true,
      },
      {
        header: "Hành động",
        enableSorting: false,
        cell: ({ row }) => {
          const original = row.original;
          const maDk = original?.maDK;
          return (
            <UploadImageAction
              maDk={maDk}
              courseId={courseId}
              uploadStudentImage={uploadStudentImage}
            />
          );
        },
      },
    ],
    [uploadStudentImage, courseId],
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <PageHeader
        title="Thu nhận Hồ sơ cấp mới"
        sectionTitle="Thông tin Hồ sơ"
        sectionDescription="Tiếp nhận và quản lý hồ sơ học viên phục vụ quá trình đào tạo và theo dõi chứng từ"
        icon={FileText}
        sectionAction={
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        }
      />

      <div className="container mx-auto px-4 sm:px-6 py-4">
        <Form methods={methods} onSubmit={onSubmit} className="space-y-6">
          {/* Section 1: Chọn khóa học */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Chọn khóa học
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2 lg:col-span-2">
                <SingleSelect
                  name="courseId"
                  label="Khóa học"
                  options={courseOptions}
                  placeholder={
                    isLoadingCourses
                      ? "Đang tải danh sách khóa học..."
                      : courseOptions.length === 0
                        ? "Không có khóa học"
                        : "Chọn khóa học"
                  }
                  disabled={isLoadingCourses}
                  required
                />
              </div>
              <Input
                name="gplxClass"
                label="Hạng GPLX"
                disabled
                placeholder="Chọn khóa học để hiển thị"
              />
              <Input
                name="minimumAge"
                label="Tuổi tối thiểu"
                type="number"
                disabled
              />
              <DatePicker
                name="openingDate"
                label="Ngày KG"
                type="date"
                disabled
              />
              <DatePicker
                name="closingDate"
                label="Ngày BG"
                type="date"
                disabled
              />
              <Input
                name="trainingClass"
                label="Hạng ĐT"
                disabled
                placeholder="Chọn khóa học để hiển thị"
              />
              <DatePicker
                name="profileReceiveDate"
                label="Ngày nhận HS"
                type="date"
                disabled
              />
              <Input
                name="totalStudents"
                label="Tổng số HV"
                type="number"
                disabled
              />
              <Input
                name="currentStudents"
                label="Số HV hiện tại"
                type="number"
                disabled
              />
            </div>
          </div>

          {/* Section 2: Thông tin Hồ sơ */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Thông tin Hồ sơ
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* <div className="grid grid-cols-2 gap-4"> */}
                <Input name="registrationCode" label="Mã đăng ký" disabled />
                {/* <Input name="profileNumber" label="Số Hồ sơ" /> */}
                {/* </div> */}
                <Input
                  name="fullName"
                  label="Họ và tên"
                  required
                  autoUppercase
                />
                <Input name="printName" label="Tên in" disabled />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DatePicker
                    name="dateOfBirth"
                    label="Ngày sinh"
                    required
                    type="date"
                    placeholder="dd/MM/yyyy"
                  />
                  <SingleSelect
                    name="gender"
                    label="Giới tính"
                    options={GENDERS}
                    placeholder="Chọn giới tính"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SingleSelect
                    name="nationality"
                    label="Quốc tịch"
                    options={nationalityOptions}
                    placeholder={
                      isLoadingNationalities
                        ? "Đang tải danh sách quốc tịch..."
                        : nationalityOptions.length === 0
                          ? "Không có dữ liệu"
                          : "Chọn quốc tịch"
                    }
                    disabled={isLoadingNationalities}
                    required
                  />
                  <Input name="idCard" label="CMT/HC" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DatePicker
                    name="idCardIssueDate"
                    label="Ngày cấp"
                    type="date"
                    placeholder="dd/MM/yyyy"
                  />
                  <Input name="idCardIssuePlace" label="Nơi cấp" />
                </div>
                <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nơi đăng ký hộ khẩu thường trú
                  </label>
                  <div className="space-y-2">
                    <SingleSelect
                      name="permanentAddress"
                      label="Địa chỉ"
                      options={administrativeUnitOptions}
                      placeholder={
                        isLoadingAdministrativeUnits
                          ? "Đang tải danh sách..."
                          : "Chọn địa chỉ"
                      }
                      disabled={isLoadingAdministrativeUnits}
                      required
                    />
                    <Input
                      name="permanentAddressDetail"
                      label="Chi tiết"
                      placeholder="Nhập chi tiết địa chỉ"
                    />
                  </div>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nơi cư trú
                  </label>
                  <div className="space-y-2">
                    <SingleSelect
                      name="currentAddress"
                      label="Địa chỉ"
                      options={administrativeUnitOptions}
                      placeholder={
                        isLoadingAdministrativeUnits
                          ? "Đang tải danh sách..."
                          : "Chọn địa chỉ"
                      }
                      disabled={isLoadingAdministrativeUnits}
                      required
                    />
                    <Input
                      name="currentAddressDetail"
                      label="Chi tiết"
                      placeholder="Nhập chi tiết địa chỉ"
                    />
                  </div>
                </div>
                <Textarea name="notes" label="Ghi chú" rows={3} />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Ảnh chân dung */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ảnh chân dung (3x4)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-24 h-32 bg-gray-100 border border-gray-300 rounded flex items-center justify-center overflow-hidden">
                        {portraitFile ? (
                          <img
                            src={URL.createObjectURL(portraitFile)}
                            alt="Ảnh chân dung xem trước"
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <FileImage className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <input
                        ref={portraitInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setPortraitFile(file);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => portraitInputRef.current?.click()}
                      >
                        <FolderOpen className="w-4 h-4 mr-1" />
                        Chọn tệp...
                      </Button>
                      {portraitFile && (
                        <p className="text-xs text-gray-600 mt-1">
                          Đã chọn: {portraitFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Giấy phép lái xe hiện có */}
                <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Giấy phép lái xe hiện có
                  </label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <Input
                        name="existingLicenseNumber"
                        label="Số GPLX"
                        placeholder="Nhập số GPLX"
                      />
                      <SingleSelect
                        name="existingLicenseStatus"
                        label="Loại"
                        options={[
                          { value: "Moi", label: "Mới" },
                          { value: "Cu", label: "Cũ" },
                        ]}
                        placeholder="Chọn loại"
                      />
                      <SingleSelect
                        name="existingLicenseClass"
                        label="Hạng GPLX"
                        options={existingLicenseClassOptions}
                        placeholder={
                          isLoadingExistingLicenseClasses
                            ? "Đang tải..."
                            : existingLicenseClassOptions.length === 0
                              ? "Không có dữ liệu"
                              : "Chọn hạng"
                        }
                        disabled={isLoadingExistingLicenseClasses}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <DatePicker
                        name="existingLicenseTestDate"
                        label="Ngày TT"
                        placeholder="dd/MM/yyyy"
                        type="date"
                      />
                      <DatePicker
                        name="existingLicenseIssueDate"
                        label="Ngày cấp"
                        placeholder="dd/MM/yyyy"
                        type="date"
                      />
                      <DatePicker
                        name="existingLicenseExpiryDate"
                        label="Ngày HH"
                        placeholder="dd/MM/yyyy"
                        type="date"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        name="existingLicenseIssuingUnit"
                        label="Đơn vị cấp"
                        placeholder="Nhập đơn vị cấp"
                      />
                      <SingleSelect
                        name="existingLicenseIssuingCountry"
                        label="Nơi cấp (NN)"
                        options={nationalityOptions}
                        placeholder={
                          isLoadingNationalities
                            ? "Đang tải..."
                            : "Chọn nơi cấp"
                        }
                        disabled={isLoadingNationalities}
                      />
                    </div>
                  </div>
                </div>

                {/* Dành cho nâng hạng */}
                <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Dành cho nâng hạng
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      name="drivingYears"
                      label="Số năm lái xe"
                      type="number"
                      placeholder="25"
                    />
                    <Input
                      name="drivingKilometers"
                      label="Số km lái xe"
                      type="number"
                      placeholder="25000"
                    />
                  </div>
                </div>

                {/* Giấy tờ kèm theo */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Giấy tờ kèm theo
                    </label>
                    {profileTypes.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                      >
                        {allProfileTypesSelected
                          ? "Bỏ chọn tất cả"
                          : "Chọn tất cả"}
                      </Button>
                    )}
                  </div>
                  {isLoadingProfileTypes ? (
                    <div className="text-sm text-gray-500">
                      Đang tải danh sách...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {profileTypes.map((type) => (
                        <Checkbox
                          key={type.ma_loai_hs}
                          name={`profileTypes.${type.ma_loai_hs}`}
                          label={type.ten_loai_hs}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pb-6">
            <Button
              type="button"
              variant="secondary"
              onClick={resetApplicantSection}
              className="w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Nhập mới
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createStudentProfile.isPending}
              className="w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu
            </Button>
          </div>

          {/* Section 3: Danh sách học viên */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Danh sách học viên của khóa {selectedCourse?.ma_kh || ""}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Tìm kiếm học viên..."
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="sm:ml-auto text-sm text-gray-600">
                  Tổng số bản ghi: {filteredCourseStudents.length}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 mb-4">
              <Button
                type="button"
                variant="danger"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Xóa
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Printer className="w-4 h-4 mr-1" />
                In giấy hẹn dự Khai giảng
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Printer className="w-4 h-4 mr-1" />
                In Tờ khai
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                <FileSpreadsheet className="w-4 h-4 mr-1" />
                Kết xuất Excel
              </Button>
            </div>
            <Table
              data={filteredCourseStudents}
              columns={studentColumns}
              enablePagination
              enableSorting
              onRowClick={(row) => {
                if (row.maDK) {
                  navigate(`/hoc-vien/chinh-sua/${row.maDK}`);
                }
              }}
            />
          </div>
        </Form>
      </div>

      {/* Modal thông báo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thông báo"
        size="md"
        footer={<Button onClick={() => setIsModalOpen(false)}>OK</Button>}
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-xl font-bold">×</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-700">{modalMessage}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
