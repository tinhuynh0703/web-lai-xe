import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import {
  FileText,
  Save,
  RotateCcw,
  ClipboardCheck,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../components/ui";
import { PageHeader } from "../components/layout";
import {
  Input,
  InputWithPrefix,
  Textarea,
  SingleSelect,
  DatePicker,
  Form,
} from "../components/forms";
import { trainingCourseSchema } from "../lib/validations/schemas";
import {
  useCreateCourse,
  useTrainingClasses,
  useTrainingTypes,
} from "../hooks";
import { showSuccess, showError } from "../utils";
import { useMemo } from "react";

export default function AddCoursePage() {
  const navigate = useNavigate();
  const createCourse = useCreateCourse();
  const { data: trainingClasses = [], isLoading: isLoadingTrainingClasses } =
    useTrainingClasses();

  const methods = useForm({
    resolver: yupResolver(trainingCourseSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      department: "48",
      trainingFacility: "48012",
      courseCode: "",
      trainingClass: "",
      decisionNumberKG: "",
      openingDate: "",
      examDate: "",
      totalStudents: "",
      trainingObjectives: "",
      notes: "",
      courseName: "",
      trainingType: "",
      decisionDateKG: "",
      closingDate: "",
      assessmentDate: "",
    },
  });

  const selectedTrainingClass = methods.watch("trainingClass");
  const selectedTrainingClassOption = useMemo(
    () =>
      trainingClasses.find((item) => item.value === selectedTrainingClass) ||
      null,
    [trainingClasses, selectedTrainingClass]
  );

  const { data: trainingTypes = [], isLoading: isLoadingTrainingTypes } =
    useTrainingTypes(
      selectedTrainingClassOption?.maHangMoi || selectedTrainingClass
    );

  useEffect(() => {
    if (selectedTrainingClass) {
      methods.setValue("trainingType", "");
    }
  }, [selectedTrainingClass, methods]);

  // Hàm chuyển đổi ngày thành ISO string chỉ có phần ngày (không có giờ)
  // Dùng cho các trường ngày như ngày KG, ngày BG, ngày nhận HS, v.v.
  const convertToISODateOnly = (dateString) => {
    if (!dateString || dateString.trim() === "") {
      return null;
    }

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

  const convertToNumber = (value) => {
    if (!value || value === "") {
      return 0;
    }
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const onSubmit = (data) => {
    const payload = {
      ma_csdt: data.trainingFacility || "",
      ma_so_gtvt: data.department || "",
      ten_kh: data.courseName || "",
      hang_gplx:
        data.trainingType && data.trainingType.trim() !== ""
          ? data.trainingType
          : null,
      hang_dt: data.trainingClass || "",
      so_qd_khai_giang: data.decisionNumberKG || "",
      ngay_qd_khai_giang: convertToISODateOnly(data.decisionDateKG),
      ngay_kg: convertToISODateOnly(data.openingDate),
      ngay_bg: convertToISODateOnly(data.closingDate),
      muc_tieu_dt: data.trainingObjectives || "",
      tong_so_hv: convertToNumber(data.totalStudents),
      ngay_thi: convertToISODateOnly(data.examDate),
      ngay_sh: convertToISODateOnly(data.assessmentDate),
      ghi_chu: data.notes || "",
    };

    createCourse.mutate(payload, {
      onSuccess: (response) => {
        showSuccess("Tạo khóa đào tạo thành công!");
        methods.reset();
        // Lấy mã khóa học từ response (có thể là response.data.ma_kh hoặc response.ma_kh)
        const courseId = response?.data?.ma_kh || response?.ma_kh;
        if (courseId) {
          // Điều hướng đến trang thêm học viên với mã khóa học vừa tạo
          navigate("/hoc-vien/them", {
            state: { courseId },
          });
        }
      },
      onError: (error) => {
        showError("Có lỗi xảy ra: " + (error.message || "Vui lòng thử lại"));
      },
    });
  };

  const handleNewEntry = () => {
    methods.reset();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-linear-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <PageHeader
        title="Thêm khóa đào tạo"
        sectionTitle="Thông tin khóa đào tạo"
        sectionDescription="Vui lòng điền đầy đủ thông tin các trường có dấu *"
        icon={FileText}
      />

      <div className="container mx-auto px-4 sm:px-6 py-4">
        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <Form methods={methods} onSubmit={onSubmit} className="p-4">
            <div className="space-y-5">
              {/* Full width fields */}
              <InputWithPrefix
                name="department"
                label="Sở GTVT"
                prefixCode="48"
                prefixName="Đà Nẵng"
                placeholder=""
                disabled
              />

              <InputWithPrefix
                name="trainingFacility"
                label="Cơ sở đào tạo"
                prefixCode="48012"
                prefixName="TTgdnn Đào tạo lái xe Sơn Hùng"
                placeholder=""
                disabled
              />

              {/* Two column fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <Input
                    name="courseCode"
                    label="Mã khóa học"
                    placeholder="Nhập mã khóa học"
                    disabled
                  />
                </div>
                <div>
                  <Input
                    name="courseName"
                    label="Tên khóa học"
                    placeholder="Nhập tên khóa học"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <SingleSelect
                    name="trainingClass"
                    label="Hạng đào tạo"
                    options={trainingClasses}
                    placeholder={
                      isLoadingTrainingClasses
                        ? "Đang tải..."
                        : "Chọn hạng đào tạo"
                    }
                    disabled={isLoadingTrainingClasses}
                    required
                  />
                </div>
                <div>
                  <SingleSelect
                    name="trainingType"
                    label="Loại hình đào tạo"
                    options={trainingTypes}
                    placeholder={
                      !selectedTrainingClass
                        ? "Vui lòng chọn hạng đào tạo trước"
                        : isLoadingTrainingTypes
                        ? "Đang tải..."
                        : trainingTypes.length === 0
                        ? "Không có loại hình đào tạo"
                        : "Chọn loại hình đào tạo"
                    }
                    disabled={!selectedTrainingClass || isLoadingTrainingTypes}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <Input
                    name="decisionNumberKG"
                    label="Số quyết định KG"
                    placeholder="Nhập số quyết định KG"
                  />
                </div>
                <div>
                  <DatePicker
                    name="decisionDateKG"
                    label="Ngày quyết định KG"
                    placeholder="mm/dd/yyyy"
                    type="date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <DatePicker
                    name="openingDate"
                    label="Ngày khai giảng"
                    placeholder="mm/dd/yyyy"
                    type="date"
                    required
                  />
                </div>
                <div>
                  <DatePicker
                    name="closingDate"
                    label="Ngày bế giảng"
                    placeholder="mm/dd/yyyy"
                    type="date"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <DatePicker
                    name="examDate"
                    label="Ngày thi"
                    placeholder="mm/dd/yyyy"
                    type="date"
                  />
                </div>
                <div>
                  <DatePicker
                    name="assessmentDate"
                    label="Ngày sát hạch"
                    placeholder="mm/dd/yyyy"
                    type="date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Input
                    name="totalStudents"
                    label="Tổng số học viên"
                    type="number"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              {/* Full width fields */}
              <Textarea
                name="trainingObjectives"
                label="Mục tiêu đào tạo"
                placeholder="Nhập mục tiêu đào tạo"
                rows={4}
              />

              <Textarea
                name="notes"
                label="Ghi chú"
                placeholder="Nhập ghi chú"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end md:gap-3 mt-10 pt-8 border-t border-gray-200 bg-gray-50/50 -mx-8 -mb-8 px-8 pb-8">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => navigate(-1)}
                className="min-w-[110px] w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleNewEntry}
                className="min-w-[130px] w-full sm:w-auto"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Nhập mới
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => navigate("/lich-hoc")}
                className="min-w-[180px] w-full sm:w-auto"
              >
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Cập nhật lịch học
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="md"
                className="min-w-[200px] w-full sm:w-auto"
              >
                <Users className="w-4 h-4 mr-2" />
                Khóa học - giáo viên
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={createCourse.isPending}
                className="w-full sm:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                Lưu
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
