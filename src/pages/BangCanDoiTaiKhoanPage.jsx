import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Scale, Search } from "lucide-react";
import { PageHeader } from "../components/layout";
import { Table, Loading, Button } from "../components/ui";
import { DatePicker, Form } from "../components/forms";
import { useTongHopTaiKhoanChaTheoThoiGian } from "../hooks";
import { formatCurrency } from "../utils/format";

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFirstDayOfMonthString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

function normalizeTaiKhoanRow(item) {
  return {
    maTaiKhoan: item.ma_tai_khoan ?? item.MaTaiKhoan ?? "",
    tenTaiKhoan: item.ten_tai_khoan ?? item.TenTaiKhoan ?? "",
    tongNo: Number(item.tong_no ?? item.TongNo ?? 0),
    tongCo: Number(item.tong_co ?? item.TongCo ?? 0),
    chenhLech: Number(item.chenh_lech ?? item.ChenhLech ?? 0),
  };
}

export default function BangCanDoiTaiKhoanPage() {
  const navigate = useNavigate();
  const defaultFilters = useMemo(
    () => ({
      fromDate: getFirstDayOfMonthString(),
      toDate: getTodayString(),
    }),
    [],
  );

  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const filterMethods = useForm({ defaultValues: defaultFilters });

  const {
    data: rawRows = [],
    isLoading,
    isFetching,
  } = useTongHopTaiKhoanChaTheoThoiGian(
    appliedFilters.fromDate,
    appliedFilters.toDate,
  );

  const tableData = useMemo(
    () => (rawRows || []).map(normalizeTaiKhoanRow),
    [rawRows],
  );

  const totals = useMemo(() => {
    return tableData.reduce(
      (acc, row) => ({
        tongNo: acc.tongNo + row.tongNo,
        tongCo: acc.tongCo + row.tongCo,
        chenhLech: acc.chenhLech + row.chenhLech,
      }),
      { tongNo: 0, tongCo: 0, chenhLech: 0 },
    );
  }, [tableData]);

  const columns = useMemo(
    () => [
      {
        header: "STT",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
      },
      { accessorKey: "maTaiKhoan", header: "Số hiệu TK" },
      {
        accessorKey: "tenTaiKhoan",
        header: "Tên tài khoản",
        enableSorting: false,
      },
      {
        accessorKey: "tongNo",
        header: "Tổng Nợ",
        cell: ({ row }) => (
          <span className="block text-right tabular-nums">
            {formatCurrency(row.original.tongNo)}
          </span>
        ),
      },
      {
        accessorKey: "tongCo",
        header: "Tổng Có",
        cell: ({ row }) => (
          <span className="block text-right tabular-nums">
            {formatCurrency(row.original.tongCo)}
          </span>
        ),
      },
      {
        accessorKey: "chenhLech",
        header: "Chênh lệch",
        cell: ({ row }) => (
          <span className="block text-right tabular-nums">
            {formatCurrency(row.original.chenhLech)}
          </span>
        ),
      },
    ],
    [],
  );

  const handleSubmit = (data) => {
    setAppliedFilters({
      fromDate: data.fromDate,
      toDate: data.toDate,
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <PageHeader
        title="Bảng cân đối tài khoản"
        sectionTitle="Bảng cân đối tài khoản"
        sectionDescription="Tổng hợp phát sinh theo tài khoản cha trong khoảng thời gian"
        icon={Scale}
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Bộ lọc tra cứu
          </h2>
          <Form
            methods={filterMethods}
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
          >
            <DatePicker name="fromDate" label="Từ ngày" type="date" required />
            <DatePicker name="toDate" label="Đến ngày" type="date" required />
            <div>
              <Button type="submit" className="w-full md:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Tra cứu
              </Button>
            </div>
          </Form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Bảng cân đối tài khoản
            </h2>
            <div className="text-sm text-gray-600">
              <span>Số dòng: {tableData.length}</span>
            </div>
          </div>

          {isLoading || isFetching ? (
            <Loading />
          ) : (
            <>
              <Table
                data={tableData}
                columns={columns}
                enablePagination
                enableSorting
                initialState={{ pagination: { pageSize: 20 } }}
                renderTableFooter={() => (
                  <tr className="bg-gray-100 font-semibold border-t-2 border-gray-200">
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-sm text-gray-900"
                    >
                      TỔNG CỘNG
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-sm text-gray-900">
                      {formatCurrency(totals.tongNo)}
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-sm text-gray-900">
                      {formatCurrency(totals.tongCo)}
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums text-sm text-gray-900">
                      {formatCurrency(totals.chenhLech)}
                    </td>
                  </tr>
                )}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
