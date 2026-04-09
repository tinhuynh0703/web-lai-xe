import { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Loading } from "../ui/Loading";
import { SingleSelect } from "../forms/SingleSelect";
import { ScheduleEditTable } from "./ScheduleEditTable";
import { useTrainingPlans, useCoursesWithoutSchedule } from "../../hooks";
import { useCreateDefaultSchedule, useCreateManySchedules } from "../../hooks";
import { showSuccess, showError } from "../../utils";

/**
 * Modal để tạo lịch học mới
 */
export function CreateScheduleModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Form cho step 1 (chọn khóa học)
  const courseForm = useForm({
    defaultValues: {
      courseId: "",
    },
  });

  // Fetch data
  const { data: courses = [], isLoading: isLoadingCourses } =
    useCoursesWithoutSchedule();
  const { data: trainingPlans = [], isLoading: isLoadingPlans } =
    useTrainingPlans();

  // Mutations
  const createDefaultSchedule = useCreateDefaultSchedule();
  const createManySchedules = useCreateManySchedules();

  // Convert courses to options
  const courseOptions = useMemo(() => {
    return courses.map((course) => ({
      value: course.ma_kh || course.maKh,
      label: `${course.ma_kh || course.maKh} - ${
        course.ten_kh || course.tenKh || ""
      }`,
    }));
  }, [courses]);

  // Convert training plans to options
  const trainingPlanOptions = useMemo(() => {
    return trainingPlans.map((plan) => ({
      value: plan.ma_dao_tao,
      label: plan.ten_dao_tao,
    }));
  }, [trainingPlans]);

  // Reset state khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedCourse(null);
      setScheduleData([]);
      setEditingIndex(null);
      courseForm.reset();
    }
  }, [isOpen, courseForm]);

  // Watch course selection
  const selectedCourseId = courseForm.watch("courseId");

  // Xử lý chọn khóa học
  useEffect(() => {
    if (selectedCourseId && step === 1) {
      handleCourseSelect(selectedCourseId);
    }
  }, [selectedCourseId, step]);

  const handleCourseSelect = async (maKh) => {
    if (!maKh) return;

    const course = courses.find((c) => (c.ma_kh || c.maKh) === maKh);
    setSelectedCourse(course);

    try {
      // Gọi API để tạo lịch học mặc định
      const response = await createDefaultSchedule.mutateAsync(maKh);
      const defaultSchedules = Array.isArray(response)
        ? response
        : response?.data || [];
      setScheduleData(defaultSchedules);
      setStep(2);
    } catch (error) {
      showError(
        error.message || "Không thể tạo lịch học mặc định. Vui lòng thử lại."
      );
    }
  };

  // Xử lý thay đổi giai đoạn
  const handleGiaiDoanChange = (index, newGiaiDoan) => {
    const updated = [...scheduleData];
    updated[index] = {
      ...updated[index],
      giai_doan: newGiaiDoan,
    };
    setScheduleData(updated);
  };

  // Xử lý xác nhận và lưu
  const handleConfirm = async () => {
    if (scheduleData.length === 0) {
      showError("Không có dữ liệu lịch học để lưu");
      return;
    }

    // Validate: kiểm tra tất cả các hàng đã có giai_doan chưa
    const hasEmptyGiaiDoan = scheduleData.some(
      (item) => !item.giai_doan || item.giai_doan.trim() === ""
    );
    if (hasEmptyGiaiDoan) {
      showError("Vui lòng chọn giai đoạn cho tất cả các hàng");
      return;
    }

    try {
      // Chuẩn bị payload
      const payload = scheduleData.map((item) => {
        // Normalize giai_doan (trim và pad với khoảng trắng nếu cần)
        let giaiDoan = (item.giai_doan || "").trim();
        // API có thể yêu cầu format "L    " (4 ký tự), nên pad thêm khoảng trắng
        if (giaiDoan.length > 0 && giaiDoan.length < 4) {
          giaiDoan = giaiDoan.padEnd(4, " ");
        }

        return {
          ma_kh: selectedCourse?.ma_kh || selectedCourse?.maKh || "",
          thang: item.thang || 0,
          tuan: item.tuan || 0,
          tu_ngay: item.tu_ngay || "",
          den_ngay: item.den_ngay || "",
          giai_doan: giaiDoan,
          kiem_tra: item.kiem_tra || "",
          ghi_chu: item.ghi_chu || "",
        };
      });

      await createManySchedules.mutateAsync(payload);
      showSuccess("Tạo lịch học thành công!");
      onSuccess?.();
      onClose();
    } catch (error) {
      showError(error.message || "Không thể lưu lịch học. Vui lòng thử lại.");
    }
  };

  const handleBack = () => {
    setStep(1);
    setSelectedCourse(null);
    setScheduleData([]);
    setEditingIndex(null);
    courseForm.reset();
  };

  // Render footer buttons cho step 2
  const renderFooter = () => {
    if (step === 1) {
      return (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
        </div>
      );
    }

    return (
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleBack}>
          Quay lại
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={createManySchedules.isPending || scheduleData.length === 0}
          loading={createManySchedules.isPending}
        >
          Xác nhận
        </Button>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        step === 1 ? "Danh sách khoá học chưa có lịch học" : "Cập nhật lịch học"
      }
      size="xl"
      footer={renderFooter()}
    >
      {step === 1 ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Vui lòng chọn khóa học để tạo lịch học mặc định
          </p>

          <FormProvider {...courseForm}>
            {isLoadingCourses ? (
              <div className="py-8">
                <Loading />
              </div>
            ) : courseOptions.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                Không có khóa học nào chưa có lịch học
              </div>
            ) : (
              <div className="space-y-4">
                <SingleSelect
                  name="courseId"
                  label="Chọn khóa học"
                  options={courseOptions}
                  placeholder={
                    isLoadingCourses ? "Đang tải..." : "Chọn khóa học"
                  }
                  disabled={isLoadingCourses}
                  required
                />
              </div>
            )}
          </FormProvider>
        </div>
      ) : (
        <div className="space-y-4">
          {createDefaultSchedule.isPending ? (
            <div className="py-8">
              <Loading />
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Khóa học:</strong>{" "}
                  {selectedCourse?.ma_kh || selectedCourse?.maKh}
                </p>
              </div>

              {scheduleData.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  Không có dữ liệu lịch học
                </div>
              ) : (
                <ScheduleEditTable
                  data={scheduleData}
                  trainingPlanOptions={trainingPlanOptions}
                  isLoadingPlans={isLoadingPlans}
                  editingIndex={editingIndex}
                  onGiaiDoanChange={handleGiaiDoanChange}
                  onEditingIndexChange={setEditingIndex}
                />
              )}
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
