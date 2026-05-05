import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, History, Search } from "lucide-react";
import { PageHeader } from "../components/layout";
import { Button, Loading, Table } from "../components/ui";
import { DatePicker, Form, Input } from "../components/forms";
import { useSearchLichSuNopHocPhi } from "../hooks";
import { formatDate, formatVndAmountDisplay } from "../utils/format";
import { showError } from "../utils";

function trimOrNull(v) {
  if (v == null || v === "") return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function dateToISOStartOrNull(v) {
  if (v == null || String(v).trim() === "") return null;
  const d = new Date(`${v}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function dateToISOEndOrNull(v) {
  if (v == null || String(v).trim() === "") return null;
  const d = new Date(`${v}T23:59:59.999Z`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function buildSearchPayload(form) {
  return {
    ma_dk: trimOrNull(form.maDk),
    from_ngay_nop: dateToISOStartOrNull(form.fromNgayNop),
    to_ngay_nop: dateToISOEndOrNull(form.toNgayNop),
    hinh_thuc_thanh_toan: trimOrNull(form.hinhThucThanhToan),
    ho_va_ten: trimOrNull(form.hoVaTen),
    ngay_sinh: trimOrNull(form.ngaySinh),
    so_cmt: trimOrNull(form.soCmt),
  };
}

function formatNgayNopDisplay(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const filterDefaults = {
  maDk: "",
  fromNgayNop: "",
  toNgayNop: "",
  hinhThucThanhToan: "",
  hoVaTen: "",
  ngaySinh: "",
  soCmt: "",
};

export default function LichSuNopHocPhiPage() {
  const navigate = useNavigate();
  const searchMutation = useSearchLichSuNopHocPhi();
  const filterMethods = useForm({ defaultValues: filterDefaults });
  const [resultRows, setResultRows] = useState(null);

  const hasSearched = resultRows !== null;

  const tableData = useMemo(() => {
    const list = Array.isArray(resultRows) ? resultRows : [];
    return list.map((item) => ({
      idNopTien: item.id_nop_tien,
      maDk: item.ma_dk ?? "—",
      soTienNop: Number(item.so_tien_nop ?? 0),
      ngayNop: formatNgayNopDisplay(item.ngay_nop),
      hinhThucThanhToan: item.hinh_thuc_thanh_toan || "—",
      soBienLai: item.so_bien_lai || "—",
      ghiChu: item.ghi_chu || "—",
      hoVaTen: item.ho_va_ten || "—",
      ngaySinh: item.ngay_sinh ? formatDate(item.ngay_sinh) : "—",
      soCmt: item.so_cmt || "—",
    }));
  }, [resultRows]);

  const columns = useMemo(
    () => [
      { header: "STT", cell: ({ row }) => row.index + 1, enableSorting: false },
      {
        accessorKey: "idNopTien",
        header: "ID nộp tiền",
        enableSorting: false,
      },
      { accessorKey: "maDk", header: "Mã ĐK" },
      {
        accessorKey: "soTienNop",
        header: "Số tiền nộp",
        cell: ({ row }) => (
          <span className="block text-right tabular-nums">
            {formatVndAmountDisplay(row.original.soTienNop)}
          </span>
        ),
      },
      { accessorKey: "ngayNop", header: "Ngày nộp", enableSorting: false },
      {
        accessorKey: "hinhThucThanhToan",
        header: "Hình thức thanh toán",
        enableSorting: false,
      },
      { accessorKey: "soBienLai", header: "Số biên lai" },
      {
        accessorKey: "ghiChu",
        header: "Ghi chú",
        enableSorting: false,
      },
      { accessorKey: "hoVaTen", header: "Họ và tên" },
      { accessorKey: "ngaySinh", header: "Ngày sinh", enableSorting: false },
      { accessorKey: "soCmt", header: "Số CMT/CCCD" },
    ],
    [],
  );

  const handleSearch = async (data) => {
    try {
      const list = await searchMutation.mutateAsync(buildSearchPayload(data));
      setResultRows(Array.isArray(list) ? list : []);
    } catch (e) {
      setResultRows([]);
      showError(e?.message || "Không tra cứu được dữ liệu.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <PageHeader
        title="Lịch sử nộp học phí"
        sectionTitle="Tra cứu lịch sử nộp học phí"
        sectionDescription="Lọc theo mã đăng ký, khoảng thời gian nộp, hình thức thanh toán và thông tin học viên"
        icon={History}
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Bộ lọc tra cứu
          </h2>
          <Form
            methods={filterMethods}
            onSubmit={handleSearch}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <Input name="maDk" label="Mã đăng ký" />
              <DatePicker name="fromNgayNop" label="Từ ngày" type="date" />
              <DatePicker name="toNgayNop" label="Đến ngày" type="date" />
              <Input name="hinhThucThanhToan" label="Hình thức thanh toán" />
              <Input name="hoVaTen" label="Họ và tên" />
              <DatePicker name="ngaySinh" label="Ngày sinh" type="date" />
              <Input name="soCmt" label="Số CMT/CCCD" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={searchMutation.isPending}
                className="w-full sm:w-auto"
              >
                <Search className="w-4 h-4 mr-2" />
                Tra cứu
              </Button>
            </div>
          </Form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Kết quả tra cứu
            </h2>
            {hasSearched && (
              <span className="text-sm text-gray-600">
                Số dòng: {tableData.length}
              </span>
            )}
          </div>

          {searchMutation.isPending ? (
            <Loading />
          ) : !hasSearched ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              Chọn điều kiện (có thể để trống tất cả) và nhấn Tra cứu.
            </p>
          ) : (
            <Table
              data={tableData}
              columns={columns}
              enablePagination
              enableSorting
              initialState={{ pagination: { pageSize: 10 } }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
