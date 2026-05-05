import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, RotateCcw, Save, Users } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/layout";
import { Button } from "../components/ui";
import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  SingleSelect,
  Textarea,
} from "../components/forms";
import {
  useNationalities,
  useTeachers,
  useTrainingClasses,
  useUpdateUnassignedStudent,
} from "../hooks";
import { showError, showSuccess } from "../utils";

const splitFullName = (fullName) => {
  if (!fullName || typeof fullName !== "string") {
    return { hoDem: "", ten: "" };
  }
  const trimmedName = fullName.trim();
  if (!trimmedName) {
    return { hoDem: "", ten: "" };
  }
  const nameParts = trimmedName.split(/\s+/).filter(Boolean);
  if (nameParts.length === 1) {
    return { hoDem: "", ten: nameParts[0] };
  }
  return {
    hoDem: nameParts.slice(0, -1).join(" "),
    ten: nameParts[nameParts.length - 1],
  };
};

const formatMoneyWithDots = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const toInputDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toIsoDate = (value) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const createDefaultValues = (hocVien = {}) => ({
  fullName: `${hocVien.ho_dem_nlx || ""} ${hocVien.ten_nlx || ""}`.trim(),
  ma_quoc_tich: hocVien.ma_quoc_tich || "VNM",
  ngay_sinh: toInputDate(hocVien.ngay_sinh),
  hang_dao_tao: hocVien.hang_dao_tao || "",
  so_dien_thoai: hocVien.so_dien_thoai || "",
  so_tien_nop: formatMoneyWithDots(hocVien.so_tien_nop || ""),
  ma_gv: hocVien.ma_gv || "",
  ghi_chu: hocVien.ghi_chu || "",
  ngay_nop_ho_so: toInputDate(hocVien.ngay_nop_ho_so),
  bang_a1: hocVien.bang_a1 || "Có",
  cam_ket: Boolean(hocVien.cam_ket),
  anh_the: Boolean(hocVien.anh_the),
  don: Boolean(hocVien.don),
  hop_dong: Boolean(hocVien.hop_dong),
  don_sat_hach: Boolean(hocVien.don_sat_hach),
  gksk: Boolean(hocVien.gksk),
  van_tay_khuon_mat: Boolean(hocVien.van_tay_khuon_mat),
  chup_anh: Boolean(hocVien.chup_anh),
});

export default function EditUnassignedStudentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { idHs } = useParams();
  const hocVien = location.state?.hocVien || null;

  const methods = useForm({
    defaultValues: createDefaultValues(hocVien || {}),
  });

  const { data: teachers = [], isLoading: isLoadingTeachers } = useTeachers();
  const { data: nationalities = [], isLoading: isLoadingNationalities } =
    useNationalities();
  const { data: trainingClasses = [], isLoading: isLoadingTrainingClasses } =
    useTrainingClasses();
  const updateUnassignedStudent = useUpdateUnassignedStudent();

  const nationalityOptions = useMemo(
    () =>
      (nationalities || []).map((item) => ({
        value: item.ma,
        label: item.ten_vn,
      })),
    [nationalities],
  );

  const teacherOptions = useMemo(
    () =>
      (teachers || []).map((item) => ({
        value: item.ma_gv,
        label: `${item.ho_ten_dem || ""} ${item.ten_gv || ""}`.trim() || item.ma_gv,
      })),
    [teachers],
  );

  const onSubmit = (data) => {
    if (!hocVien) {
      showError("Không có dữ liệu học viên để cập nhật. Vui lòng mở từ danh sách.");
      return;
    }

    const { hoDem, ten } = splitFullName(data.fullName);
    const payload = {
      id_hs: hocVien.id_hs,
      ho_dem_nlx: hoDem,
      ten_nlx: ten,
      ma_quoc_tich: data.ma_quoc_tich || "",
      ngay_sinh: toIsoDate(data.ngay_sinh),
      hang_dao_tao: data.hang_dao_tao || "",
      so_dien_thoai: data.so_dien_thoai?.trim() || "",
      so_tien_nop: Number(String(data.so_tien_nop || "").replace(/\./g, "")) || 0,
      ma_gv: data.ma_gv || "",
      ghi_chu: data.ghi_chu || "",
      ngay_nop_ho_so: toIsoDate(data.ngay_nop_ho_so),
      bang_a1: data.bang_a1 || "",
      cam_ket: Boolean(data.cam_ket),
      anh_the: Boolean(data.anh_the),
      don: Boolean(data.don),
      hop_dong: Boolean(data.hop_dong),
      don_sat_hach: Boolean(data.don_sat_hach),
      gksk: Boolean(data.gksk),
      van_tay_khuon_mat: Boolean(data.van_tay_khuon_mat),
      chup_anh: Boolean(data.chup_anh),
    };

    updateUnassignedStudent.mutate(payload, {
      onSuccess: () => {
        showSuccess("Cập nhật học viên chưa phân khóa thành công.");
        navigate("/hoc-vien/chua-phan-khoa", {
          state: { forceRefetch: true },
        });
      },
      onError: (error) => {
        showError(error?.message || "Không thể cập nhật học viên. Vui lòng thử lại.");
      },
    });
  };

  if (!hocVien) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            Không có dữ liệu học viên để sửa (ID: {idHs || "-"}).
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/hoc-vien/chua-phan-khoa")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <PageHeader
        title="Sửa học viên chưa phân khóa"
        sectionTitle="Thông tin học viên chưa phân khóa"
        sectionDescription="Chỉnh sửa thông tin và cập nhật lại hồ sơ học viên"
        icon={Users}
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
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Chỉnh sửa học viên chưa phân khóa
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input name="fullName" label="Họ và tên" required autoUppercase />
              <SingleSelect
                name="ma_quoc_tich"
                label="Quốc tịch"
                required
                options={nationalityOptions}
                disabled={isLoadingNationalities}
              />
              <DatePicker name="ngay_sinh" label="Ngày sinh" type="date" required />
              <SingleSelect
                name="hang_dao_tao"
                label="Hạng đào tạo"
                required
                options={trainingClasses}
                disabled={isLoadingTrainingClasses}
              />
              <Input name="so_dien_thoai" label="Số điện thoại" required />
              <Input
                name="so_tien_nop"
                label="Số tiền nộp"
                type="text"
                inputMode="numeric"
                onChange={(e) =>
                  methods.setValue("so_tien_nop", formatMoneyWithDots(e.target.value), {
                    shouldDirty: true,
                  })
                }
              />
              <SingleSelect
                name="ma_gv"
                label="Giáo viên"
                required
                options={teacherOptions}
                disabled={isLoadingTeachers}
              />
              <DatePicker
                name="ngay_nop_ho_so"
                label="Ngày nộp hồ sơ"
                type="date"
                required
              />
              <SingleSelect
                name="bang_a1"
                label="Bằng A1"
                options={[
                  { value: "Có", label: "Có" },
                  { value: "Không", label: "Không" },
                  { value: "Công an thu", label: "Công an thu" },
                ]}
              />
              <div className="md:col-span-2 lg:col-span-2">
                <Textarea name="ghi_chu" label="Ghi chú" rows={3} />
              </div>
            </div>

            <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Hồ sơ đi kèm</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Checkbox name="cam_ket" label="Cam kết" />
                <Checkbox name="anh_the" label="Ảnh thẻ" />
                <Checkbox name="don" label="Đơn" />
                <Checkbox name="hop_dong" label="Hợp đồng" />
                <Checkbox name="don_sat_hach" label="Đơn sát hạch" />
                <Checkbox name="gksk" label="GKSK" />
                <Checkbox name="van_tay_khuon_mat" label="Vân tay khuôn mặt" />
                <Checkbox name="chup_anh" label="Chụp ảnh" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => methods.reset(createDefaultValues(hocVien))}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={updateUnassignedStudent.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Lưu
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
