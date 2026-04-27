import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, Fragment } from "react";
import { cn } from "../../lib/utils";

/**
 * Table component sử dụng TanStack Table
 */
export function Table({
  data,
  columns,
  enablePagination = true,
  enableSorting = true,
  enableFiltering = false,
  enableExpanding = false,
  renderSubComponent,
  className,
  onRowClick,
  manualPagination = false,
  pageCount,
  onPaginationChange,
  initialState,
}) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [expanded, setExpanded] = useState({});
  const [pagination, setPagination] = useState(() => ({
    pageIndex: 0,
    pageSize: 10,
    ...(initialState?.pagination ?? {}),
  }));

  const tableInitialState = initialState
    ? Object.fromEntries(
        Object.entries(initialState).filter(([key]) => key !== "pagination"),
      )
    : undefined;
  const hasTableInitialState =
    tableInitialState && Object.keys(tableInitialState).length > 0;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel:
      enablePagination && !manualPagination
        ? getPaginationRowModel()
        : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getExpandedRowModel: enableExpanding ? getExpandedRowModel() : undefined,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: enableExpanding ? setExpanded : undefined,
    onPaginationChange: enablePagination
      ? (updater) => {
          if (manualPagination && onPaginationChange) {
            onPaginationChange(updater);
          }
          setPagination(updater);
        }
      : undefined,
    manualPagination,
    pageCount,
    initialState: hasTableInitialState ? tableInitialState : undefined,
    state: {
      sorting,
      globalFilter,
      expanded: enableExpanding ? expanded : undefined,
      ...(enablePagination ? { pagination } : {}),
    },
  });

  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap",
                        enableSorting &&
                          header.column.getCanSort() &&
                          "cursor-pointer select-none hover:bg-gray-100"
                      )}
                      onClick={
                        enableSorting
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {enableSorting && header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {{
                              asc: "↑",
                              desc: "↓",
                            }[header.column.getIsSorted()] ?? "⇅"}
                          </span>
                        )}
                      </div>
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
                  return (
                    <Fragment key={row.id}>
                      <tr
                        className={cn(
                          "hover:bg-gray-50 transition-colors",
                          (onRowClick || enableExpanding) && "cursor-pointer",
                          enableExpanding && row.getIsExpanded() && "bg-gray-50"
                        )}
                        onClick={() => {
                          if (enableExpanding) {
                            row.toggleExpanded();
                          }
                          if (onRowClick) {
                            onRowClick(row.original);
                          }
                        }}
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
                      {enableExpanding &&
                        row.getIsExpanded() &&
                        renderSubComponent && (
                          <tr key={`${row.id}-expanded`}>
                            <td
                              colSpan={columns.length}
                              className="p-0 border-t border-gray-200"
                            >
                              {renderSubComponent({ row })}
                            </td>
                          </tr>
                        )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {enablePagination && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
            >
              Đầu
            </button>
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
            >
              Trước
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg">
              Trang {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount() || 1}
            </span>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
            >
              Sau
            </button>
            <button
              type="button"
              onClick={() =>
                table.setPageIndex(Math.max(0, table.getPageCount() - 1))
              }
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
            >
              Cuối
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {manualPagination && (
              <span className="text-sm text-gray-700">
                Tổng cộng: <strong>{pageCount || 0}</strong> items
              </span>
            )}
            <div className="flex items-center gap-2">
              <label htmlFor="pageSize" className="text-sm text-gray-700">
                Hiển thị:
              </label>
              <select
                id="pageSize"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              >
                {[10, 20, 30, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
