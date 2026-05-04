import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertCircle, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "../components/layout";
import { Button, Loading, Modal, Table } from "../components/ui";
import {
  DatePicker,
  Form,
  Input,
  Textarea,
  TreeSelect,
} from "../components/forms";
import { cn } from "../lib/utils";
import {
  useAccountingAccountTree,
  useCreateTuitionPaymentHistory,
  useDeleteTuitionPaymentHistory,
  useTuitionPaymentHistory,
} from "../hooks";
import { ROUTES } from "../constants";
import {
  formatDate,
  formatVndAmountDisplay,
  formatVndGrouped,
} from "../utils/format";
import { showError, showSuccess } from "../utils";
import { tuitionPaymentSchema } from "../lib/validations/schemas";

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toISODateStart(dateString) {
  if (!dateString) return null;
  return new Date(`${dateString}T00:00:00.000Z`).toISOString();
}

export default function TuitionPaymentHistoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { maDK = "" } = useParams();
  const selectedRow = location.state;
  const fromCourseId = selectedRow?.fromCourseId || "";
  const createPayment = useCreateTuitionPaymentHistory();
  const deletePayment = useDeleteTuitionPaymentHistory();
  const { data: accountTree = [], isLoading: isLoadingAccountTree } =
    useAccountingAccountTree();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const formDefaults = useMemo(
    () => ({
      soTienNop: undefined,
      ngayNop: getTodayString(),
      taiKhoanNo: "",
      taiKhoanCo: "",
      soBienLai: "",
      ghiChu: "",
    }),
    [],
  );
  const methods = useForm({
    resolver: yupResolver(tuitionPaymentSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: formDefaults,
  });

  const { data: paymentHistory = [], isLoading } =
    useTuitionPaymentHistory(maDK);

  const parentNameByChildAccount = useMemo(() => {
    const map = new Map();
    (accountTree || []).forEach((parent) => {
      // Parent without children can be selected directly.
      if (!parent.children || parent.children.length === 0) {
        map.set(parent.ma_tai_khoan, parent.ten_tai_khoan || "");
      }
      (parent.children || []).forEach((child) => {
        map.set(child.ma_tai_khoan, parent.ten_tai_khoan || "");
      });
    });
    return map;
  }, [accountTree]);

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
  const isCompleted =
    studentInfo?.da_hoan_thanh_hp ?? selectedRow?.daHoanThanhHp ?? false;

  const columns = useMemo(
    () => [
      { header: "STT", cell: ({ row }) => row.index + 1, enableSorting: false },
      { accessorKey: "idNopTien", header: "Mã phiếu", enableSorting: false },
      {
        accessorKey: "soTienNop",
        header: "Số tiền nộp",
        cell: ({ row }) => formatVndAmountDisplay(row.original.soTienNop),
      },
      { accessorKey: "ngayNop", header: "Ngày nộp" },
      {
        accessorKey: "hinhThucThanhToan",
        header: "Hình thức thanh toán",
        enableSorting: false,
      },
      { accessorKey: "soBienLai", header: "Số biên lai", enableSorting: false },
      { accessorKey: "ghiChu", header: "Ghi chú", enableSorting: false },
      {
        header: "Thao tác",
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              setDeleteTarget({
                idNopTien: row.original.idNopTien,
                soBienLai: row.original.soBienLai,
              });
            }}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Xóa
          </Button>
        ),
      },
    ],
    [],
  );

  const handleBack = () => {
    if (!fromCourseId) {
      navigate(ROUTES.TUITION_PROFILES);
      return;
    }
    navigate(
      `${ROUTES.TUITION_PROFILES}?courseId=${encodeURIComponent(fromCourseId)}`,
    );
  };

  const handleCreatePayment = (data) => {
    const payload = {
      ma_dk: maDK,
      so_tien_nop: Number(data.soTienNop || 0),
      ngay_nop: toISODateStart(data.ngayNop),
      hinh_thuc_thanh_toan: parentNameByChildAccount.get(data.taiKhoanCo) || "",
      tai_khoan_no: data.taiKhoanNo || "",
      tai_khoan_co: data.taiKhoanCo || "",
      so_bien_lai: data.soBienLai?.trim() || "",
      ghi_chu: data.ghiChu?.trim() || "",
    };

    createPayment.mutate(payload, {
      onSuccess: () => {
        showSuccess("Thêm lịch sử nộp học phí thành công.");
        methods.reset(formDefaults);
      },
      onError: (error) => {
        showError(
          "Không thể thêm lịch sử nộp học phí: " +
            (error?.message || "Vui lòng thử lại."),
        );
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget?.idNopTien) return;
    deletePayment.mutate(
      {
        idNopTien: deleteTarget.idNopTien,
        maDk: maDK,
      },
      {
        onSuccess: () => {
          showSuccess("Xóa lịch sử nộp học phí thành công.");
          setDeleteTarget(null);
        },
        onError: (error) => {
          showError(
            "Không thể xóa lịch sử nộp học phí: " +
              (error?.message || "Vui lòng thử lại."),
          );
        },
      },
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <PageHeader
        title={`Lịch sử nộp học phí (${maDK})`}
        sectionTitle="Chi tiết thanh toán học phí"
        sectionDescription="Theo dõi toàn bộ giao dịch nộp học phí của học viên"
        icon={Plus}
        sectionAction={
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="w-full sm:w-auto"
          >
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
                <p className="text-sm font-semibold text-gray-900">
                  {formatVndAmountDisplay(hocPhi)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Đã nộp</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatVndAmountDisplay(totalPaid)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Còn lại</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatVndAmountDisplay(Math.max(hocPhi - totalPaid, 0))}
                </p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Thêm thông tin nộp học phí
          </h2>
          <Form methods={methods} onSubmit={handleCreatePayment}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Controller
                name="soTienNop"
                control={methods.control}
                render={({ field, fieldState }) => (
                  <div className="w-full">
                    <label
                      htmlFor="soTienNop"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Số tiền nộp
                      <span className="text-red-500 ml-1 font-bold">*</span>
                    </label>
                    <input
                      id="soTienNop"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="0"
                      className={cn(
                        "w-full px-4 py-2.5 border rounded-lg transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                        "placeholder:text-gray-400 text-gray-900 hover:border-gray-400",
                        fieldState.error
                          ? "border-red-400 focus:ring-red-500/20 focus:border-red-500 bg-red-50/50"
                          : "border-gray-300 bg-white",
                      )}
                      value={
                        field.value === undefined ||
                        field.value === null ||
                        field.value === ""
                          ? ""
                          : formatVndGrouped(field.value)
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        field.onChange(
                          raw === "" ? undefined : Number(raw),
                        );
                      }}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {fieldState.error && (
                      <p className="mt-1.5 text-sm text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <DatePicker
                name="ngayNop"
                label="Ngày nộp"
                type="date"
                required
              />
              <TreeSelect
                name="taiKhoanNo"
                label="Tài khoản nợ"
                options={accountTree}
                placeholder={
                  isLoadingAccountTree
                    ? "Đang tải danh mục tài khoản..."
                    : "Chọn tài khoản nợ"
                }
                disabled={isLoadingAccountTree}
                minSelectableDepth={1}
                allowSelectParentIfNoChildren
                required
              />
              <TreeSelect
                name="taiKhoanCo"
                label="Tài khoản có"
                options={accountTree}
                placeholder={
                  isLoadingAccountTree
                    ? "Đang tải danh mục tài khoản..."
                    : "Chọn tài khoản có"
                }
                disabled={isLoadingAccountTree}
                minSelectableDepth={1}
                allowSelectParentIfNoChildren
                required
              />
              <Input name="soBienLai" label="Số biên lai" />
              <Textarea name="ghiChu" label="Ghi chú" rows={1} />
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="submit" loading={createPayment.isPending}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm
              </Button>
            </div>
          </Form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Lịch sử thanh toán
          </h2>
          {isLoading ? (
            <Loading />
          ) : (
            <Table
              data={historyData}
              columns={columns}
              enablePagination
              enableSorting
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => {
          if (!deletePayment.isPending) {
            setDeleteTarget(null);
          }
        }}
        title="Xác nhận xóa lịch sử nộp học phí"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={deletePayment.isPending}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleConfirmDelete}
              loading={deletePayment.isPending}
            >
              Xóa
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-700">
          Bạn có chắc chắn muốn xóa giao dịch
          {deleteTarget?.idNopTien ? ` #${deleteTarget.idNopTien}` : ""}
          {deleteTarget?.soBienLai && deleteTarget.soBienLai !== "-"
            ? ` (biên lai: ${deleteTarget.soBienLai})`
            : ""}
          ?
        </p>
      </Modal>
    </div>
  );
}
