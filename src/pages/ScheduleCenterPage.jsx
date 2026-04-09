import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "../components/layout";
import { ScheduleMatrixTable } from "../components/schedule/ScheduleMatrixTable";
import { Legend } from "../components/schedule/Legend";
import { Loading, Button } from "../components/ui";
import { CreateScheduleModal } from "../components/schedule/CreateScheduleModal";
import { useScheduleCenter } from "../hooks";

/**
 * Dashboard hiển thị lịch học toàn trung tâm
 */
export default function ScheduleCenterPage() {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch data từ API
  const {
    data: scheduleResponse,
    isLoading,
    error,
  } = useScheduleCenter({
    page_index: pageIndex,
    page_size: pageSize,
  });

  const scheduleData = scheduleResponse?.data || [];
  const total = scheduleResponse?.total || 0;
  const totalPages = scheduleResponse?.total_pages || 0;

  const handlePageChange = (newPage) => {
    setPageIndex(newPage);
    // Scroll to top khi đổi trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPageIndex(1); // Reset về trang đầu
  };

  const handleCreateSuccess = () => {
    // Refetch data sau khi tạo thành công
    // React Query sẽ tự động refetch khi mutation success
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <PageHeader
        title="Lịch học toàn trung tâm"
        description="Xem chi tiết lịch học của tất cả các khóa học"
      />

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Header với Legend và nút Thêm mới */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex-1">
            <Legend />
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white border border-gray-200 rounded-lg p-12">
            <Loading />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-white border border-red-200 rounded-lg p-6">
            <div className="text-center">
              <p className="text-red-600 font-medium">
                Có lỗi xảy ra khi tải dữ liệu
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {error.message || "Vui lòng thử lại sau"}
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && (
          <ScheduleMatrixTable
            data={scheduleData}
            total={total}
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}

        {/* Create Schedule Modal */}
        <CreateScheduleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
}
