import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, RotateCcw, Save, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/layout";
import { Button, Loading, Table } from "../components/ui";
import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  SingleSelect,
  Textarea,
} from "../components/forms";
import {
  useCreateUnassignedStudent,
  useNationalities,
  useTeachers,
  useTrainingClasses,
  useUnassignedStudents,
} from "../hooks";
import { formatCurrency, formatDate } from "../utils/format";
import { showError, showSuccess } from "../utils";

const PROFILE_REQUIRED_FIELDS = [
  "cam_ket",
  "anh_the",
  "don",
  "hop_dong",
  "don_sat_hach",
  "gksk",
  "van_tay_khuon_mat",
  "chup_anh",
];

const toCheckMark = (value) => (value ? "✓" : "");
const formatThousandsVn = (value) => {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("vi-VN");
};
const getTodayYmd = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDefaultValues = () => ({
  fullName: "",
  ma_quoc_tich: "VNM",
  ngay_sinh: "",
  hang_dao_tao: "",
  so_dien_thoai: "",
  so_tien_nop: "",
  ma_gv: "",
  ghi_chu: "",
  ngay_nop_ho_so: getTodayYmd(),
  bang_a1: "Có",
  cam_ket: true,
  anh_the: true,
  don: true,
  hop_dong: true,
  don_sat_hach: true,
  gksk: true,
  van_tay_khuon_mat: true,
  chup_anh: true,
});

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
    return { hoDem: "", ten: nameParts[0] };
  }

  return {
    hoDem: nameParts.slice(0, -1).join(" "),
    ten: nameParts[nameParts.length - 1],
  };
};

export default function UnassignedStudentsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const methods = useForm({ defaultValues: getDefaultValues() });
  const { data: records = [], isLoading, refetch } = useUnassignedStudents();
  const { data: teachers = [], isLoading: isLoadingTeachers } = useTeachers();
  const { data: nationalities = [], isLoading: isLoadingNationalities } =
    useNationalities();
  const { data: trainingClasses = [], isLoading: isLoadingTrainingClasses } =
    useTrainingClasses();
  const createUnassignedStudent = useCreateUnassignedStudent();

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
        label:
          `${item.ho_ten_dem || ""} ${item.ten_gv || ""}`.trim() || item.ma_gv,
      })),
    [teachers],
  );

  const resetForm = () => {
    methods.reset(getDefaultValues(), {
      keepErrors: false,
      keepDirty: false,
      keepTouched: false,
    });
  };

  const toIsoDate = (value) => {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
  };

  const onSubmit = (data) => {
    const { hoDem, ten } = splitFullName(data.fullName);
    const payload = {
      ho_dem_nlx: hoDem,
      ten_nlx: ten,
      ma_quoc_tich: data.ma_quoc_tich || "",
      ngay_sinh: toIsoDate(data.ngay_sinh),
      hang_dao_tao: data.hang_dao_tao || "",
      so_dien_thoai: data.so_dien_thoai?.trim() || "",
      so_tien_nop: Number(String(data.so_tien_nop || "").replace(/\D/g, "")) || 0,
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

    createUnassignedStudent.mutate(payload, {
      onSuccess: () => {
        showSuccess("Thêm học viên chưa phân khóa thành công.");
        resetForm();
      },
      onError: (error) => {
        showError(
          error?.message || "Không thể thêm học viên. Vui lòng thử lại.",
        );
      },
    });
  };

  useEffect(() => {
    if (location.state?.forceRefetch) {
      refetch();
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate, refetch]);

  const tableData = useMemo(
    () =>
      (records || []).map((item) => {
        const hocVien = item?.hoc_vien || {};
        const giaoVienFullName =
          `${item?.ho_ten_dem || ""} ${item?.ten_gv || ""}`.trim() || "-";
        const completedProfileCount = PROFILE_REQUIRED_FIELDS.reduce(
          (count, field) => count + (hocVien[field] ? 1 : 0),
          0,
        );

        return {
          hocVien,
          hoVaTen:
            `${hocVien.ho_dem_nlx || ""} ${hocVien.ten_nlx || ""}`.trim() ||
            "-",
          soDienThoai: hocVien.so_dien_thoai || "-",
          ngayNopHoSo: formatDate(hocVien.ngay_nop_ho_so),
          cccd: hocVien.id_hs ?? "-",
          soTienNop: hocVien.so_tien_nop || 0,
          a1: hocVien.bang_a1 || "-",
          camKet: toCheckMark(hocVien.cam_ket),
          anhThe: toCheckMark(hocVien.anh_the),
          don: toCheckMark(hocVien.don),
          hopDong: toCheckMark(hocVien.hop_dong),
          donSatHach: toCheckMark(hocVien.don_sat_hach),
          gksk: toCheckMark(hocVien.gksk),
          vanTayKhuonMat: toCheckMark(hocVien.van_tay_khuon_mat),
          chupAnh: toCheckMark(hocVien.chup_anh),
          giaoVien: giaoVienFullName,
          ghiChu: hocVien.ghi_chu || "-",
          ngaySinh: formatDate(hocVien.ngay_sinh),
        };
      }),
    [records],
  );

  const columns = useMemo(
    () => [
      { header: "STT", cell: ({ row }) => row.index + 1, enableSorting: false },
      { accessorKey: "hoVaTen", header: "HỌ VÀ TÊN" },
      { accessorKey: "ngaySinh", header: "NGÀY SINH", enableSorting: false },
      { accessorKey: "soDienThoai", header: "SDT", enableSorting: false },
      {
        accessorKey: "soTienNop",
        header: "SỐ TIỀN NỘP",
        cell: ({ row }) => formatCurrency(row.original.soTienNop),
      },
      {
        accessorKey: "ngayNopHoSo",
        header: "NGÀY NỘP HỒ SƠ",
        enableSorting: false,
      },
      { accessorKey: "a1", header: "A1", enableSorting: false },
      { accessorKey: "camKet", header: "CAM KẾT", enableSorting: false },
      { accessorKey: "anhThe", header: "ẢNH THẺ", enableSorting: false },
      { accessorKey: "don", header: "ĐƠN", enableSorting: false },
      { accessorKey: "hopDong", header: "HỢP ĐỒNG", enableSorting: false },
      {
        accessorKey: "donSatHach",
        header: "ĐƠN SÁT HẠCH",
        enableSorting: false,
      },
      { accessorKey: "gksk", header: "GKSK", enableSorting: false },
      {
        accessorKey: "vanTayKhuonMat",
        header: "VÂN TAY KHUÔN MẶT",
        enableSorting: false,
      },
      { accessorKey: "chupAnh", header: "CHỤP ẢNH", enableSorting: false },
      { accessorKey: "giaoVien", header: "GIÁO VIÊN", enableSorting: false },
      { accessorKey: "ghiChu", header: "GHI CHÚ", enableSorting: false },
    ],
    [],
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <PageHeader
        title="Học viên chưa phân khóa"
        sectionTitle="Danh sách học viên chưa phân khóa"
        sectionDescription="Tra cứu các học viên chưa được phân vào khóa đào tạo"
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

      <div className="container mx-auto px-4 sm:px-6 py-4 space-y-6">
        <Form methods={methods} onSubmit={onSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Thêm học viên chưa phân khóa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input name="fullName" label="Họ và tên" required autoUppercase />
              <SingleSelect
                name="ma_quoc_tich"
                label="Quốc tịch"
                required
                options={nationalityOptions}
                placeholder={
                  isLoadingNationalities
                    ? "Đang tải quốc tịch..."
                    : "Chọn quốc tịch"
                }
                disabled={isLoadingNationalities}
              />
              <DatePicker
                name="ngay_sinh"
                label="Ngày sinh"
                type="date"
                required
              />
              <SingleSelect
                name="hang_dao_tao"
                label="Hạng đào tạo"
                required
                options={trainingClasses}
                placeholder={
                  isLoadingTrainingClasses
                    ? "Đang tải hạng đào tạo..."
                    : "Chọn hạng đào tạo"
                }
                disabled={isLoadingTrainingClasses}
              />
              <Input name="so_dien_thoai" label="Số điện thoại" required />
              <Input
                name="so_tien_nop"
                label="Số tiền nộp"
                type="text"
                inputMode="numeric"
                placeholder="0"
                onChange={(e) => {
                  methods.setValue(
                    "so_tien_nop",
                    formatThousandsVn(e.target.value),
                    { shouldDirty: true },
                  );
                }}
              />
              <SingleSelect
                name="ma_gv"
                label="Giáo viên"
                required
                options={teacherOptions}
                placeholder={
                  isLoadingTeachers
                    ? "Đang tải danh sách giáo viên..."
                    : "Chọn giáo viên"
                }
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
                placeholder="Chọn tình trạng bằng A1"
              />
              <div className="md:col-span-2 lg:col-span-2">
                <Textarea name="ghi_chu" label="Ghi chú" rows={3} />
              </div>
            </div>

            <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Hồ sơ đi kèm
              </h3>
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
              <Button type="button" variant="secondary" onClick={resetForm}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={createUnassignedStudent.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Thêm
              </Button>
            </div>
          </div>
        </Form>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách học viên chưa phân khóa
            </h2>
            <span className="text-sm text-gray-600">
              Số dòng: {tableData.length}
            </span>
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <Table
              data={tableData}
              columns={columns}
              enablePagination
              enableSorting
              searchPlaceholder="Tìm theo tên, mã học viên, số điện thoại..."
              onRowClick={(row) =>
                navigate(`/hoc-vien/chua-phan-khoa/chinh-sua/${row?.hocVien?.id_hs || ""}`, {
                  state: { hocVien: row?.hocVien },
                })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
