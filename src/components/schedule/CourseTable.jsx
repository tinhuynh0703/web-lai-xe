import { useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Table } from "../ui/Table";
import { ScheduleDetail } from "./ScheduleDetail";
import { cn } from "../../lib/utils";

/**
 * Component bảng hiển thị danh sách khóa học với expandable rows
 * Sử dụng Table component có sẵn với TanStack Table
 */
export function CourseTable({
  data = [],
  total = 0,
  pageIndex = 1,
  pageSize = 10,
  totalPages = 0,
  onPageChange,
  onPageSizeChange,
}) {
  // Định nghĩa columns cho TanStack Table
  const columns = useMemo(
    () => [
      {
        id: "expand",
        header: () => null,
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            {row.getIsExpanded() ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </div>
        ),
        size: 48,
      },
      {
        accessorKey: "ma_kh",
        header: "Mã Khóa Học",
        cell: ({ getValue }) => (
          <div className="text-sm font-medium text-gray-900">{getValue()}</div>
        ),
      },
      {
        id: "schedule_count",
        header: "Số Tuần Học",
        cell: ({ row }) => {
          const scheduleCount = row.original.thong_tin_chi_tiets?.length || 0;
          return <div className="text-sm text-gray-900">{scheduleCount} tuần</div>;
        },
      },
    ],
    []
  );

  // Render sub-component cho expanded row
  const renderSubComponent = ({ row }) => {
    const scheduleDetails = row.original.thong_tin_chi_tiets || [];
    return <ScheduleDetail scheduleDetails={scheduleDetails} />;
  };

  // Tính toán pageCount cho manual pagination
  const pageCount = totalPages || Math.ceil(total / pageSize);

  // Handler cho pagination change
  const handlePaginationChange = (newPagination) => {
    // TanStack Table sử dụng 0-based index, API sử dụng 1-based
    if (newPagination.pageIndex !== undefined) {
      onPageChange(newPagination.pageIndex + 1);
    }
    if (newPagination.pageSize !== undefined) {
      onPageSizeChange(newPagination.pageSize);
      // Reset về trang đầu khi đổi page size
      if (newPagination.pageIndex === undefined) {
        onPageChange(1);
      }
    }
  };

  return (
    <Table
      data={data}
      columns={columns}
      enablePagination={true}
      enableSorting={false}
      enableExpanding={true}
      renderSubComponent={renderSubComponent}
      manualPagination={true}
      pageCount={pageCount}
      onPaginationChange={handlePaginationChange}
      initialState={{
        pagination: {
          pageIndex: pageIndex - 1, // Convert từ 1-based sang 0-based
          pageSize: pageSize,
        },
      }}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
    />
  );
}
