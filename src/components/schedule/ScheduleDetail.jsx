import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { StatusBadge } from "./StatusBadge";
import { formatDateToDDMMYYYY } from "../../utils/scheduleHelpers";
import { SearchInput } from "../ui/SearchInput";
import { rowMatchesGlobalSearch } from "../../lib/utils";

/**
 * Component hiển thị bảng chi tiết lịch học của một khóa học
 * Gom các hàng có cùng tháng lại thành một hàng với rowspan
 * Sử dụng Table component structure với custom body renderer để hỗ trợ rowspan
 */
export function ScheduleDetail({ scheduleDetails = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDetails = useMemo(() => {
    if (!scheduleDetails?.length) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return scheduleDetails;
    return scheduleDetails.filter((d) => rowMatchesGlobalSearch(d, q));
  }, [scheduleDetails, searchQuery]);

  // Định nghĩa columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "thang",
        header: "Tháng",
      },
      {
        accessorKey: "tuan",
        header: "Tuần",
      },
      {
        id: "thoi_gian",
        header: "Thời gian",
        cell: ({ row }) => {
          const item = row.original;
          return item.tu_ngay && item.den_ngay
            ? `${formatDateToDDMMYYYY(item.tu_ngay)} - ${formatDateToDDMMYYYY(
                item.den_ngay
              )}`
            : "-";
        },
      },
      {
        id: "giai_doan",
        header: "Giai đoạn",
        cell: ({ row }) => <StatusBadge giaiDoan={row.original.giai_doan} />,
      },
      {
        accessorKey: "kiem_tra",
        header: "Kiểm tra",
        cell: ({ getValue }) => {
          const value = getValue();
          return value ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border border-red-300">
              {value}
            </span>
          ) : (
            "-"
          );
        },
      },
      {
        accessorKey: "ghi_chu",
        header: "Ghi chú",
        cell: ({ getValue }) => getValue() || "-",
      },
    ],
    []
  );

  // Group và tính toán rowspan cho các hàng cùng tháng
  const groupedRows = useMemo(() => {
    const groups = [];
    let currentMonth = null;
    let currentGroup = null;

    filteredDetails.forEach((detail, index) => {
      const month = detail.thang;

      if (month !== currentMonth) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          month,
          rows: [detail],
          startIndex: index,
        };
        currentMonth = month;
      } else {
        currentGroup.rows.push(detail);
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  }, [filteredDetails]);

  const table = useReactTable({
    data: filteredDetails,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!scheduleDetails || scheduleDetails.length === 0) {
    return (
      <div className="px-6 py-4 text-sm text-gray-500">
        Không có thông tin lịch học chi tiết
      </div>
    );
  }

  return (
    <div className="px-6 py-4 bg-gray-50">
      <div className="mb-3">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm tuần, giai đoạn, ghi chú..."
        />
      </div>
      {filteredDetails.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          Không có dòng nào khớp tìm kiếm
        </div>
      ) : (
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
                {groupedRows.map((group, groupIndex) =>
                  group.rows.map((detail, rowIndex) => (
                    <tr
                      key={detail.ma_lich_hoc || `${groupIndex}-${rowIndex}`}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {rowIndex === 0 && (
                        <td
                          rowSpan={group.rows.length}
                          className="px-6 py-4 text-sm text-gray-900 font-medium align-top border-r border-gray-200"
                        >
                          {group.month || "-"}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {detail.tuan || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {detail.tu_ngay && detail.den_ngay
                          ? `${formatDateToDDMMYYYY(detail.tu_ngay)} - ${formatDateToDDMMYYYY(
                              detail.den_ngay
                            )}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <StatusBadge giaiDoan={detail.giai_doan} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {detail.kiem_tra ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                            {detail.kiem_tra}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {detail.ghi_chu || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
