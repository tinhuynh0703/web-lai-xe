import { useForm, useWatch } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import {
  Camera,
  FileImage,
  FolderOpen,
  ArrowLeft,
  Save,
} from "lucide-react";
import { Button } from "../components/ui";
import { PageHeader } from "../components/layout";
import {
  Input,
  SingleSelect,
  Form,
  Textarea,
  Checkbox,
  DatePicker,
} from "../components/forms";
import { GENDERS } from "../constants";
import {
  useProfileTypes,
  useAdministrativeUnits,
  useNationalities,
  useStudentDetail,
  useUpdateStudentProfile,
  useTrainingClasses,
} from "../hooks";
import { showSuccess, showError } from "../utils";

export default function EditStudentPage() {
  const { maDK } = useParams();
  const navigate = useNavigate();
  const { data: studentData, isLoading, error } = useStudentDetail(maDK);
  const updateStudentProfile = useUpdateStudentProfile();

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
        label: unit.ten_day_du
      })),
    [administrativeUnits]
  );

  const nationalityOptions = useMemo(
    () =>
      nationalities.map((nationality) => ({
        value: nationality.ma,
        label: nationality.ten_vn,
      })),
    [nationalities]
  );

  const studentMethods = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  // Set values cho từng field khi có studentData
  useEffect(() => {
    if (!studentData) {
      return;
    }

    const formatDateFromYYYYMMDDToInput = (dateString) => {
      if (!dateString || dateString.length !== 8) return "";
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${year}-${month}-${day}`;
    };

    const formatISOToDateInput = (isoString) => {
      if (!isoString) return "";
      try {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      } catch {
        return "";
      }
    };

    console.log("Setting form values with studentData:", {
      ten_nlx: studentData.ten_nlx,
      ma_dk: studentData.ma_dk,
      ngay_sinh: studentData.ngay_sinh,
    });

    // Sử dụng setValue cho từng field để đảm bảo các component re-render
    const { setValue } = studentMethods;
    
    // Ghép ho_dem_nlx và ten_nlx thành fullName nếu có
    const hoDemNlx = studentData.ho_dem_nlx || "";
    const tenNlx = studentData.ten_nlx || "";
    const fullName = hoDemNlx && tenNlx 
      ? `${hoDemNlx} ${tenNlx}`.trim()
      : tenNlx || hoDemNlx || "";
    
    setValue("registrationCode", studentData.ma_dk || "", { shouldValidate: false, shouldDirty: false });
    setValue("fullName", fullName, { shouldValidate: false, shouldDirty: false });
    setValue("printName", fullName, { shouldValidate: false, shouldDirty: false });
    setValue("dateOfBirth", formatDateFromYYYYMMDDToInput(studentData.ngay_sinh), { shouldValidate: false, shouldDirty: false });
    setValue("gender", studentData.gioi_tinh || "", { shouldValidate: false, shouldDirty: false });
    setValue("nationality", studentData.ma_quoc_tich || "", { shouldValidate: false, shouldDirty: false });
    setValue("idCard", studentData.so_cmt || "", { shouldValidate: false, shouldDirty: false });
    setValue("idCardIssueDate", formatISOToDateInput(studentData.ngay_cap_cmt), { shouldValidate: false, shouldDirty: false });
    setValue("idCardIssuePlace", studentData.noi_cap_cmt || "", { shouldValidate: false, shouldDirty: false });
    setValue("permanentAddress", studentData.noi_tt_ma_dvhc || "", { shouldValidate: false, shouldDirty: false });
    setValue("permanentAddressDetail", "", { shouldValidate: false, shouldDirty: false });
    setValue("currentAddress", studentData.noi_ct_ma_dvhc || "", { shouldValidate: false, shouldDirty: false });
    setValue("currentAddressDetail", "", { shouldValidate: false, shouldDirty: false });
    setValue("notes", studentData.ghi_chu || "", { shouldValidate: false, shouldDirty: false });
    setValue("drivingYears", studentData.so_nam_lx?.toString() || "", { shouldValidate: false, shouldDirty: false });
    setValue("drivingKilometers", studentData.so_km_lxan_toan?.toString() || "", { shouldValidate: false, shouldDirty: false });
    // Giấy phép lái xe đã có
    setValue("existingLicenseNumber", studentData.so_gplxda_co || "", { shouldValidate: false, shouldDirty: false });
    setValue("existingLicenseClass", studentData.hang_gplxda_co || "", { shouldValidate: false, shouldDirty: false });
    setValue("existingLicenseTestDate", formatISOToDateInput(studentData.ngay_ttgplxda_co), { shouldValidate: false, shouldDirty: false });
    setValue("existingLicenseIssueDate", formatISOToDateInput(studentData.ngay_cap_gplxda_co), { shouldValidate: false, shouldDirty: false });
    setValue("existingLicenseExpiryDate", formatISOToDateInput(studentData.ngay_hhgplxda_co), { shouldValidate: false, shouldDirty: false });
    setValue("existingLicenseIssuingUnit", studentData.don_vi_cap_gplxda_co || "", { shouldValidate: false, shouldDirty: false });
    setValue("existingLicenseIssuingCountry", studentData.noi_cap_gplxda_co || "VNM", { shouldValidate: false, shouldDirty: false });
  }, [studentData, studentMethods.setValue]);

  // Update profileTypes riêng khi cả studentData và profileTypes đều có
  useEffect(() => {
    if (!studentData || !profileTypes || profileTypes.length === 0) {
      return;
    }

    // Map profileTypes từ giay_tos
    const profileTypesMap = {};
    profileTypes.forEach((type) => {
      profileTypesMap[type.ma_loai_hs] = studentData.giay_tos?.some(
        (gt) => gt.ma_gt === type.ma_loai_hs
      ) || false;
    });

    // Update profileTypes field
    studentMethods.setValue("profileTypes", profileTypesMap, {
      shouldValidate: false,
      shouldDirty: false,
    });
  }, [studentData, profileTypes, studentMethods.setValue]);

  // Sử dụng useWatch để đảm bảo component re-render khi fullName thay đổi
  const fullName = useWatch({
    control: studentMethods.control,
    name: "fullName",
  });

  // Tự động điền "Tên in" khi "Họ và tên" thay đổi
  useEffect(() => {
    // Chỉ cập nhật khi fullName có giá trị (không phải undefined, null, hoặc empty string)
    if (fullName) {
      studentMethods.setValue("printName", fullName, { 
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
    } else if (fullName === "") {
      // Nếu fullName là empty string, cũng clear printName
      studentMethods.setValue("printName", "", { 
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [fullName, studentMethods]);

  const convertDateToISO = (dateString) => {
    if (!dateString) return null;
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    const isoString = isDateOnly
      ? new Date(`${dateString}T00:00:00.000Z`)
      : new Date(dateString);
    if (isNaN(isoString.getTime())) return null;
    return isoString.toISOString();
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
    if (!value || !administrativeUnits) return null;
    return administrativeUnits.find(
      (unit) => unit.ma_dvhc === value
    );
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

  const handleSave = (data) => {
    if (!studentData) return;

    const permanentAddressUnit = findAdministrativeUnit(data.permanentAddress);
    const currentAddressUnit = findAdministrativeUnit(data.currentAddress);

    // Map profileTypes thành giay_tos
    const giayTos = [];
    if (data.profileTypes) {
      Object.entries(data.profileTypes).forEach(([maLoaiHs, isSelected]) => {
        if (isSelected === true) {
          const profileType = profileTypes.find(
            (pt) => pt.ma_loai_hs.toString() === maLoaiHs
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
      MaCsdt: studentData.ma_csdt || "48012",
      HoDemNlx: hoDem,
      TenNlx: ten,
      MaQuocTich: data.nationality || "",
      NgaySinh: formatDateToYYYYMMDD(data.dateOfBirth),
      SoCmt: data.idCard || "",
      NgayCapCmt: convertDateToISO(data.idCardIssueDate),
      NoiCapCmt: data.idCardIssuePlace || "",
      GhiChu: data.notes || "",
      GioiTinh: data.gender || "",
      SoCmndCu: "",
      HangGplx: studentData.hang_gplx || "",
      HangDaoTao: studentData.hang_dao_tao || "",
      MaKhoaHoc: studentData.ma_khoa_hoc || "",
      NamHocLx: 0,
      NoiTtMaDvhc:
        permanentAddressUnit?.ma_dvhc || "",
      NoiTtMaDvql: permanentAddressUnit?.ma_dvql || "",
      NoiCtMaDvhc:
        currentAddressUnit?.ma_dvhc || "",
      NoiCtMaDvql: currentAddressUnit?.ma_dvql || "",
      DuongDanAnh: studentData.duong_dan_anh || "",
      SoNamLx: data.drivingYears ? parseInt(data.drivingYears) || 0 : 0,
      SoKmLxanToan: data.drivingKilometers
        ? parseInt(data.drivingKilometers) || 0
        : 0,
      GiayTos: giayTos,
      MaDk: studentData.ma_dk || maDK || "",
      MaLoaiHs: studentData.ma_loai_hs || 0,
      // Giấy phép lái xe đã có
      SoGplxDaCo: data.existingLicenseNumber || "",
      HangGplxDaCo: data.existingLicenseClass || "",
      NgayTtgplxDaCo: convertDateToISO(data.existingLicenseTestDate) || "",
      NgayCapGplxDaCo: convertDateToISO(data.existingLicenseIssueDate) || "",
      NgayHhgplxDaCo: convertDateToISO(data.existingLicenseExpiryDate) || "",
      DonViCapGplxDaCo: data.existingLicenseIssuingUnit || "",
      NoiCapGplxDaCo: data.existingLicenseIssuingCountry || "VNM",
    };

    updateStudentProfile.mutate(payload, {
      onSuccess: () => {
        showSuccess("Cập nhật thông tin học viên thành công!");
        navigate(-1);
      },
      onError: (error) => {
        showError(
          error.message || "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại."
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="mb-4">Không thể tải thông tin học viên. Vui lòng thử lại.</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <PageHeader
        title={`Chỉnh sửa thông tin học viên: ${studentData?.ten_nlx || ""}`}
        sectionTitle="Thông tin Hồ sơ"
        sectionDescription="Vui lòng điền đầy đủ thông tin các trường có dấu *"
        icon={FileImage}
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
        <Form methods={studentMethods} onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <Input
                name="registrationCode"
                label="Mã đăng ký"
                disabled
              />
              <Input
                name="fullName"
                label="Họ và tên"
                required
                autoUppercase
              />
              <Input
                name="printName"
                label="Tên in"
                disabled
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker
                  name="dateOfBirth"
                  label="Ngày sinh"
                  type="date"
                  required
                />
                <SingleSelect
                  name="gender"
                  label="Giới tính"
                  options={GENDERS}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SingleSelect
                  name="nationality"
                  label="Quốc tịch"
                  options={nationalityOptions}
                  disabled={isLoadingNationalities}
                  required
                />
                <Input
                  name="idCard"
                  label="CMT/HC"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker
                  name="idCardIssueDate"
                  label="Ngày cấp"
                  type="date"
                />
                <Input
                  name="idCardIssuePlace"
                  label="Nơi cấp"
                />
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
                    disabled={isLoadingAdministrativeUnits}
                    required
                  />
                  <Input
                    name="permanentAddressDetail"
                    label="Chi tiết"
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
                    disabled={isLoadingAdministrativeUnits}
                    required
                  />
                  <Input
                    name="currentAddressDetail"
                    label="Chi tiết"
                  />
                </div>
              </div>
              <Textarea
                name="notes"
                label="Ghi chú"
                rows={3}
              />
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
                    <div className="w-24 h-32 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                      {studentData?.duong_dan_anh ? (
                        <img
                          src={studentData.duong_dan_anh}
                          alt="Ảnh chân dung"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <FileImage className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-1" />
                        Chụp ảnh
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <FolderOpen className="w-4 h-4 mr-1" />
                        Chọn tệp...
                      </Button>
                    </div>
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
                    />
                    <SingleSelect
                      name="existingLicenseStatus"
                      label="Loại"
                      options={[
                        { value: "Moi", label: "Mới" },
                        { value: "Cu", label: "Cũ" },
                      ]}
                    />
                    <SingleSelect
                      name="existingLicenseClass"
                      label="Hạng GPLX"
                      options={gplxClasses}
                      disabled={isLoadingGplxClasses}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <DatePicker
                      name="existingLicenseTestDate"
                      label="Ngày TT"
                      type="date"
                    />
                    <DatePicker
                      name="existingLicenseIssueDate"
                      label="Ngày cấp"
                      type="date"
                    />
                    <DatePicker
                      name="existingLicenseExpiryDate"
                      label="Ngày HH"
                      type="date"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      name="existingLicenseIssuingUnit"
                      label="Đơn vị cấp"
                    />
                    <SingleSelect
                      name="existingLicenseIssuingCountry"
                      label="Nơi cấp (NN)"
                      options={nationalityOptions}
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
                  />
                  <Input
                    name="drivingKilometers"
                    label="Số km lái xe"
                    type="number"
                  />
                </div>
              </div>

              {/* Giấy tờ kèm theo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Giấy tờ kèm theo
                </label>
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

          {/* Submit button */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pb-6">
            <Button
              type="submit"
              variant="primary"
              loading={updateStudentProfile.isPending}
              className="w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

