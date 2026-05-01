import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ReceiptText } from "lucide-react";
import { PageHeader } from "../components/layout";
import { Button, Loading, Table } from "../components/ui";
import { useTuitionPaymentHistory } from "../hooks";
import { formatCurrency, formatDate } from "../utils/format";

export default function TuitionPaymentHistoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { maDK = "" } = useParams();
  const selectedRow = location.state;

  const { data: paymentHistory = [], isLoading } = useTuitionPaymentHistory(maDK);

  const studentInfo = paymentHistory?.[0]?.ma_dk_navigation;

  const historyData = useMemo(
    () =>
      (paymentHistory || []).map((item) => ({
        idNopTien: item.id_nop_tien,
        soTienNop: item.so_tien_nop || 0,
        ngayNop: formatDate(item.ngay_nop),
        hinhThucThanhToan: item.hinh_thuc_thanh_toan || "-",
        soBienLai: item.so_bien_lai || "-",
        ghiChu: item.ghi_chu || "-",
      })),
    [paymentHistory],
  );

  const totalPaid = historyData.reduce((sum, item) => sum + item.soTienNop, 0);
  const hocPhi = studentInfo?.hoc_phi || selectedRow?.hocPhi || 0;
  const isCompleted = studentInfo?.da_hoan_thanh_hp ?? selectedRow?.daHoanThanhHp ?? false;

  const columns = useMemo(
    () => [
      { header: "STT", cell: ({ row }) => row.index + 1, enableSorting: false },
      { accessorKey: "idNopTien", header: "Mã phiếu", enableSorting: false },
      {
        accessorKey: "soTienNop",
        header: "Số tiền nộp",
        cell: ({ row }) => formatCurrency(row.original.soTienNop),
      },
      { accessorKey: "ngayNop", header: "Ngày nộp" },
      { accessorKey: "hinhThucThanhToan", header: "Hình thức thanh toán", enableSorting: false },
      { accessorKey: "soBienLai", header: "Số biên lai", enableSorting: false },
      { accessorKey: "ghiChu", header: "Ghi chú", enableSorting: false },
    ],
    [],
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <PageHeader
        title={`Kế toán - Lịch sử nộp học phí (${maDK})`}
        sectionTitle="Chi tiết thanh toán học phí"
        sectionDescription="Theo dõi toàn bộ giao dịch nộp học phí của học viên"
        icon={ReceiptText}
        sectionAction={
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        }
      />

      <div className="container mx-auto px-4 sm:px-6 py-4 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Mã đăng ký</p>
                <p className="text-sm font-semibold text-gray-900">{maDK}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Họ và tên</p>
                <p className="text-sm font-semibold text-gray-900">
                  {studentInfo?.ho_va_ten || selectedRow?.hoVaTen || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tổng học phí</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(hocPhi)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Đã nộp</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(totalPaid)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Còn lại</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(Math.max(hocPhi - totalPaid, 0))}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Trạng thái</p>
                {isCompleted ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                    Đã hoàn thành
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                    Chưa đủ học phí
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lịch sử thanh toán</h2>
          {isLoading ? (
            <Loading />
          ) : (
            <Table data={historyData} columns={columns} enablePagination enableSorting />
          )}
        </div>
      </div>
    </div>
  );
}
