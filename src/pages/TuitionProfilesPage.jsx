import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, CreditCard } from "lucide-react";
import { PageHeader } from "../components/layout";
import { Form, SingleSelect, Input, DatePicker } from "../components/forms";
import { Table, Loading, Button } from "../components/ui";
import { useCoursesByDateRange, useTuitionProfiles } from "../hooks";
import { formatCurrency, formatDate } from "../utils/format";

export default function TuitionProfilesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const courseIdFromUrl = searchParams.get("courseId") || "";
  const methods = useForm({
    defaultValues: {
      courseId: courseIdFromUrl,
      gplxClass: "",
      minimumAge: "",
      openingDate: "",
      closingDate: "",
      trainingClass: "",
      profileReceiveDate: "",
      totalStudents: "",
      currentStudents: "",
    },
  });

  const { data: courses = [], isLoading: isLoadingCourses } =
    useCoursesByDateRange();
  const selectedCourseId = methods.watch("courseId");
  const selectedCourse = useMemo(
    () => courses.find((course) => course.ma_kh === selectedCourseId) || null,
    [courses, selectedCourseId],
  );

  const maHangGplx = selectedCourse?.hang_gplx || "";
  const { data: tuitionProfiles = [], isLoading: isLoadingProfiles } =
    useTuitionProfiles(selectedCourseId, maHangGplx);

  const formatToDateLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const courseOptions = useMemo(
    () =>
      courses.map((course) => ({
        value: course.ma_kh,
        label: `${course.ma_kh || ""} - ${course.ten_kh || ""} (KG: ${formatDate(course.ngay_kg)})`,
      })),
    [courses],
  );

  useEffect(() => {
    if (!selectedCourseId && courseIdFromUrl) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("courseId");
      setSearchParams(nextParams, { replace: true });
      return;
    }
    if (selectedCourseId && selectedCourseId !== courseIdFromUrl) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("courseId", selectedCourseId);
      setSearchParams(nextParams, { replace: true });
    }
  }, [selectedCourseId, courseIdFromUrl, setSearchParams]);

  useEffect(() => {
    if (!selectedCourse) return;
    methods.setValue("gplxClass", selectedCourse.hang_gplx || "");
    methods.setValue("minimumAge", selectedCourse.tuoi_toi_thieu || "18");
    methods.setValue("openingDate", formatToDateLocal(selectedCourse.ngay_kg));
    methods.setValue("closingDate", formatToDateLocal(selectedCourse.ngay_bg));
    methods.setValue("trainingClass", selectedCourse.hang_dt || "");
    methods.setValue(
      "profileReceiveDate",
      formatToDateLocal(selectedCourse.ngay_nhan_hs),
    );
    methods.setValue("totalStudents", selectedCourse.tong_so_hv || "");
    methods.setValue("currentStudents", selectedCourse.tong_so_hv || "");
  }, [selectedCourse, methods]);

  const tableData = useMemo(
    () =>
      (tuitionProfiles || []).map((item) => {
        const rawGender = (item.gioi_tinh || "").toUpperCase();
        const gioiTinhLabel =
          rawGender === "M"
            ? "Nam"
            : rawGender === "F"
              ? "Nữ"
              : item.gioi_tinh || "-";
        const tongDaNop =
          item.lich_su_nop_hoc_phis?.reduce(
            (sum, p) => sum + (p.so_tien_nop || 0),
            0,
          ) || 0;
        return {
          maDK: item.ma_dk,
          hoVaTen: item.ho_va_ten || "-",
          ngaySinh: formatDate(item.ngay_sinh),
          noiCuTru: item.noi_cu_tru || "-",
          gioiTinh: gioiTinhLabel,
          soCmt: item.so_cmt || "-",
          hocPhi: item.hoc_phi || 0,
          tongDaNop,
          daHoanThanhHp: Boolean(item.da_hoan_thanh_hp),
        };
      }),
    [tuitionProfiles],
  );

  const columns = useMemo(
    () => [
      { header: "STT", cell: ({ row }) => row.index + 1, enableSorting: false },
      { accessorKey: "hoVaTen", header: "Họ và tên" },
      { accessorKey: "ngaySinh", header: "Ngày sinh", enableSorting: false },
      { accessorKey: "gioiTinh", header: "Giới tính", enableSorting: false },
      { accessorKey: "soCmt", header: "CMT/CCCD", enableSorting: false },
      { accessorKey: "noiCuTru", header: "Nơi cư trú", enableSorting: false },
      {
        accessorKey: "hocPhi",
        header: "Học phí",
        cell: ({ row }) => formatCurrency(row.original.hocPhi),
      },
      {
        accessorKey: "daHoanThanhHp",
        header: "Trạng thái",
        cell: ({ row }) =>
          row.original.daHoanThanhHp ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
              Đã hoàn thành
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
              Chưa đủ học phí
            </span>
          ),
      },
    ],
    [],
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <PageHeader
        title="Hồ sơ học phí"
        sectionTitle="Hồ sơ học phí theo khóa học"
        sectionDescription="Chọn khóa học để tra cứu tình trạng nộp học phí của học viên"
        icon={CreditCard}
        sectionAction={
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        }
      />

      <div className="container mx-auto px-4 sm:px-6 py-4 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Chọn khóa học
          </h2>
          <Form methods={methods} onSubmit={() => {}}>
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
              <Input name="minimumAge" label="Tuổi tối thiểu" disabled />
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
              <Input name="totalStudents" label="Tổng số HV" disabled />
              <Input name="currentStudents" label="Số HV hiện tại" disabled />
            </div>
          </Form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách hồ sơ học phí{" "}
              {selectedCourseId ? `- ${selectedCourseId}` : ""}
            </h2>
            <span className="text-sm text-gray-600">
              Tổng số bản ghi: {tableData.length}
            </span>
          </div>

          {!selectedCourseId ? (
            <p className="text-sm text-gray-500">
              Vui lòng chọn khóa học để hiển thị danh sách.
            </p>
          ) : isLoadingProfiles ? (
            <Loading />
          ) : (
            <Table
              data={tableData}
              columns={columns}
              enablePagination
              enableSorting
              onRowClick={(row) =>
                navigate(`/ke-toan/ho-so-hoc-phi/${row.maDK}`, {
                  state: {
                    ...row,
                    fromCourseId: selectedCourseId,
                  },
                })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
