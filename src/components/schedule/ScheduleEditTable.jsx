import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Select } from "../ui/Select";
import { formatDateToDDMMYYYY } from "../../utils/scheduleHelpers";
import { cn } from "../../lib/utils";

export function ScheduleEditTable({
  data = [],
  trainingPlanOptions = [],
  isLoadingPlans = false,
  editingIndex = null,
  onGiaiDoanChange,
  onEditingIndexChange,
}) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "thang",
        header: "Tháng",
        cell: ({ getValue }) => (
          <div className="text-sm text-gray-900">{getValue() || "-"}</div>
        ),
      },
      {
        accessorKey: "tuan",
        header: "Tuần",
        cell: ({ getValue }) => (
          <div className="text-sm text-gray-900">{getValue() || "-"}</div>
        ),
      },
      {
        id: "thoi_gian",
        header: "Thời gian",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="text-sm text-gray-900 whitespace-nowrap">
              {item.tu_ngay && item.den_ngay
                ? `${formatDateToDDMMYYYY(
                    item.tu_ngay
                  )} - ${formatDateToDDMMYYYY(item.den_ngay)}`
                : "-"}
            </div>
          );
        },
      },
      {
        id: "giai_doan",
        header: "Giai đoạn",
        cell: ({ row }) => {
          const index = row.index;
          const item = row.original;
          return (
            <div className="text-sm">
              {isLoadingPlans ? (
                <div className="text-gray-400">Đang tải...</div>
              ) : (
                <Select
                  value={item.giai_doan || ""}
                  onChange={(newValue) => onGiaiDoanChange(index, newValue)}
                  options={trainingPlanOptions}
                  placeholder="Chọn giai đoạn"
                  className="w-full"
                  onFocus={() => onEditingIndexChange(index)}
                  onBlur={() => onEditingIndexChange(null)}
                />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "kiem_tra",
        header: "Kiểm tra",
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <div className="text-sm text-gray-900">
              {value ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                  {value}
                </span>
              ) : (
                "-"
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "ghi_chu",
        header: "Ghi chú",
        cell: ({ getValue }) => (
          <div className="text-sm text-gray-900">{getValue() || "-"}</div>
        ),
      },
    ],
    [
      trainingPlanOptions,
      isLoadingPlans,
      onGiaiDoanChange,
      onEditingIndexChange,
    ]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const index = row.index;
                  return (
                    <tr
                      key={row.id}
                      className={cn(
                        "hover:bg-gray-50 transition-colors",
                        editingIndex === index && "bg-blue-50"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
