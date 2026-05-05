import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, ScrollText, Settings } from "lucide-react";
import { PageHeader } from "../components/layout";
import { LichSuSoDuFormModal } from "../components/settings/LichSuSoDuFormModal";
import { Button, Loading, Table } from "../components/ui";
import { Form, Input } from "../components/forms";
import { useLichSuSoDu, useSaveLichSuSoDu } from "../hooks";
import { cn } from "../lib/utils";
import { formatVndAmountDisplay } from "../utils/format";
import { showError, showSuccess } from "../utils";

const SECTION_LICH_SU_SO_DU = "lich-su-so-du";

const sidebarItems = [
  {
    id: SECTION_LICH_SU_SO_DU,
    label: "Lịch sử số dư",
    icon: ScrollText,
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(SECTION_LICH_SU_SO_DU);
  const defaultNam = new Date().getFullYear();
  const [appliedNam, setAppliedNam] = useState(defaultNam);

  const filterMethods = useForm({
    defaultValues: { nam: String(defaultNam) },
  });

  const saveMutation = useSaveLichSuSoDu();
  const [isLichSuModalOpen, setIsLichSuModalOpen] = useState(false);
  const [lichSuModalMode, setLichSuModalMode] = useState("create");

  const lichSuModalMethods = useForm({
    defaultValues: {
      nam: String(defaultNam),
      maTaiKhoan: "",
      tenTaiKhoan: "",
      no: "",
      co: "",
    },
  });

  const {
    data: rawRows = [],
    isLoading,
    isFetching,
    error,
  } = useLichSuSoDu(appliedNam);

  const tableData = useMemo(
    () =>
      (rawRows || []).map((row) => ({
        _rowNam: row.nam,
        _rowMa: row.ma_tai_khoan ?? "",
        nam: row.nam ?? "—",
        maTaiKhoan: row.ma_tai_khoan ?? "—",
        tenTaiKhoan: row.ten_tai_khoan ?? "—",
        no: Number(row.no ?? 0),
        co: Number(row.co ?? 0),
      })),
    [rawRows],
  );

  const handleOpenEdit = useCallback(
    (row) => {
      setLichSuModalMode("edit");
      const y = Number(row._rowNam);
      const year = Number.isFinite(y) ? y : appliedNam;
      lichSuModalMethods.reset({
        nam: String(year),
        maTaiKhoan: String(row._rowMa ?? "").trim(),
        tenTaiKhoan:
          row.tenTaiKhoan && row.tenTaiKhoan !== "—"
            ? String(row.tenTaiKhoan)
            : "",
        no: String(row.no ?? ""),
        co: String(row.co ?? ""),
      });
      setIsLichSuModalOpen(true);
    },
    [appliedNam, lichSuModalMethods],
  );

  const columns = useMemo(
    () => [
      {
        header: "STT",
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
      },
      { accessorKey: "nam", header: "Năm" },
      { accessorKey: "maTaiKhoan", header: "Mã tài khoản" },
      {
        accessorKey: "tenTaiKhoan",
        header: "Tên tài khoản",
        enableSorting: false,
      },
      {
        accessorKey: "no",
        header: "Nợ",
        cell: ({ row }) => (
          <span className="block text-left tabular-nums">
            {formatVndAmountDisplay(row.original.no)}
          </span>
        ),
      },
      {
        accessorKey: "co",
        header: "Có",
        cell: ({ row }) => (
          <span className="block text-left tabular-nums">
            {formatVndAmountDisplay(row.original.co)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => handleOpenEdit(row.original)}
              aria-label="Sửa dòng"
            >
              <Pencil className="w-4 h-4 mr-1.5" />
              Sửa
            </Button>
          </div>
        ),
      },
    ],
    [handleOpenEdit],
  );

  const handleNamFilter = (form) => {
    const n = Number(form.nam);
    if (Number.isFinite(n) && n >= 2000 && n <= 2100) {
      setAppliedNam(n);
    }
  };

  const handleSaveLichSuSoDu = async (data) => {
    const payload = {
      nam: Number(data.nam),
      ma_tai_khoan: String(data.maTaiKhoan ?? "").trim(),
      ten_tai_khoan: String(data.tenTaiKhoan ?? "").trim(),
      no: Number(data.no) || 0,
      co: Number(data.co) || 0,
    };
    if (
      !Number.isFinite(payload.nam) ||
      payload.nam < 2000 ||
      payload.nam > 2100
    ) {
      showError("Năm không hợp lệ.");
      return;
    }
    if (!payload.ma_tai_khoan || !payload.ten_tai_khoan) {
      showError("Vui lòng nhập mã và tên tài khoản.");
      return;
    }
    try {
      await saveMutation.mutateAsync(payload);
      showSuccess(
        lichSuModalMode === "create"
          ? "Tạo lịch sử số dư thành công."
          : "Cập nhật lịch sử số dư thành công.",
      );
      setIsLichSuModalOpen(false);
      lichSuModalMethods.reset({
        nam: String(appliedNam),
        maTaiKhoan: "",
        tenTaiKhoan: "",
        no: "",
        co: "",
      });
    } catch (e) {
      showError(e?.message || "Không lưu được bản ghi.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <PageHeader
        title="Cài đặt"
        sectionTitle="Tùy chọn hệ thống"
        sectionDescription="Quản lý các tiện ích và báo cáo bổ sung"
        icon={Settings}
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

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <aside className="w-full shrink-0 lg:w-56">
            <nav
              className="rounded-xl border border-gray-200 bg-white p-2"
              aria-label="Menu cài đặt"
            >
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-80" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            {activeSection === SECTION_LICH_SU_SO_DU && (
              <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <Form
                    methods={filterMethods}
                    onSubmit={handleNamFilter}
                    className="flex flex-wrap items-end gap-4 min-w-0"
                  >
                    <div className="w-full sm:w-40">
                      <Input
                        name="nam"
                        label="Năm tra cứu"
                        type="number"
                        min={2000}
                        max={2100}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto">
                      Tra cứu
                    </Button>
                  </Form>
                  <Button
                    type="button"
                    className="shrink-0"
                    onClick={() => {
                      setLichSuModalMode("create");
                      lichSuModalMethods.reset({
                        nam: String(appliedNam),
                        maTaiKhoan: "",
                        tenTaiKhoan: "",
                        no: "",
                        co: "",
                      });
                      setIsLichSuModalOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-4 text-right">
                    Số dòng:{" "}
                    {isLoading || isFetching
                      ? "…"
                      : error
                        ? "—"
                        : tableData.length}
                  </p>

                  {isLoading || isFetching ? (
                    <Loading />
                  ) : error ? (
                    <p className="text-sm text-red-600">
                      {error.message || "Không tải được dữ liệu."}
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
                <LichSuSoDuFormModal
                  isOpen={isLichSuModalOpen}
                  onClose={() => {
                    if (!saveMutation.isPending) setIsLichSuModalOpen(false);
                  }}
                  mode={lichSuModalMode}
                  methods={lichSuModalMethods}
                  onSubmit={handleSaveLichSuSoDu}
                  isPending={saveMutation.isPending}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
