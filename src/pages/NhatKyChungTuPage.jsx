import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, BookText, Plus, Save, Search } from "lucide-react";
import { PageHeader } from "../components/layout";
import { Table, Loading, Button } from "../components/ui";
import {
  DatePicker,
  Form,
  Input,
  Textarea,
  TreeSelect,
} from "../components/forms";
import {
  useAccountingAccountTree,
  useCreateNhatKyChungTu,
  useNhatKyChungTu,
} from "../hooks";
import { nhatKyChungTuSchema } from "../lib/validations/schemas";
import { formatCurrency, formatDate } from "../utils/format";
import { showError, showSuccess } from "../utils";

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

function toISODateStart(dateString) {
  if (!dateString) return null;
  return new Date(`${dateString}T00:00:00.000Z`).toISOString();
}

export default function NhatKyChungTuPage() {
  const navigate = useNavigate();
  const defaultFilters = useMemo(
    () => ({
      fromDate: getFirstDayOfMonthString(),
      toDate: getTodayString(),
    }),
    [],
  );

  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const createDefaultValues = useMemo(
    () => ({
      soChungTu: "",
      ngayLap: getTodayString(),
      dienGiai: "",
      taiKhoanNo: "",
      taiKhoanCo: "",
      soTien: "",
      ghiChu: "",
    }),
    [],
  );
  const createMethods = useForm({
    resolver: yupResolver(nhatKyChungTuSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: createDefaultValues,
  });
  const filterMethods = useForm({
    defaultValues: defaultFilters,
  });

  const createEntry = useCreateNhatKyChungTu();
  const { data: accountTree = [], isLoading: isLoadingAccountTree } =
    useAccountingAccountTree();

  const {
    data: entries = [],
    isLoading,
    isFetching,
  } = useNhatKyChungTu(appliedFilters.fromDate, appliedFilters.toDate);

  const tableData = useMemo(
    () =>
      (entries || []).map((item) => ({
        soChungTu: item.so_chung_tu || "-",
        ngayLap: formatDate(item.ngay_lap),
        dienGiai: item.dien_giai || "-",
        taiKhoanNo: item.tai_khoan_no || "-",
        taiKhoanCo: item.tai_khoan_co || "-",
        soTien: item.so_tien || 0,
        ghiChu: item.ghi_chu || "-",
        idChungTu: item.id_chung_tu,
      })),
    [entries],
  );

  const totalAmount = useMemo(
    () => tableData.reduce((sum, item) => sum + (item.soTien || 0), 0),
    [tableData],
  );

  const columns = useMemo(
    () => [
      { header: "STT", cell: ({ row }) => row.index + 1, enableSorting: false },
      { accessorKey: "soChungTu", header: "Số CT" },
      { accessorKey: "ngayLap", header: "Ngày" },
      { accessorKey: "dienGiai", header: "Diễn giải", enableSorting: false },
      { accessorKey: "taiKhoanNo", header: "TK Nợ" },
      { accessorKey: "taiKhoanCo", header: "TK Có" },
      {
        accessorKey: "soTien",
        header: "Số tiền",
        cell: ({ row }) => formatCurrency(row.original.soTien),
      },
      { accessorKey: "ghiChu", header: "Ghi chú", enableSorting: false },
    ],
    [],
  );

  const handleSubmit = (data) => {
    setAppliedFilters({
      fromDate: data.fromDate,
      toDate: data.toDate,
    });
  };

  const handleCreateSubmit = (data) => {
    const payload = {
      so_chung_tu: data.soChungTu.trim(),
      ngay_lap: toISODateStart(data.ngayLap),
      dien_giai: data.dienGiai.trim(),
      tai_khoan_no: data.taiKhoanNo || "",
      tai_khoan_co: data.taiKhoanCo || "",
      so_tien: Number(data.soTien || 0),
      ghi_chu: data.ghiChu.trim(),
    };

    createEntry.mutate(payload, {
      onSuccess: () => {
        showSuccess("Tạo nhật ký chứng từ thành công.");
        createMethods.reset(createDefaultValues);
      },
      onError: (error) => {
        showError(
          "Không thể tạo nhật ký chứng từ: " +
            (error?.message || "Vui lòng thử lại."),
        );
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <PageHeader
        title="Nhật ký chứng từ"
        sectionTitle="Nhật ký chứng từ"
        sectionDescription="Theo dõi các bút toán chứng từ theo khoảng thời gian"
        icon={BookText}
        sectionAction={
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        }
      />

      <div className="container mx-auto px-4 sm:px-6 py-4 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Tạo nhật ký chứng từ
          </h2>
          <Form
            methods={createMethods}
            onSubmit={handleCreateSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input name="soChungTu" label="Số chứng từ" required />
              <DatePicker
                name="ngayLap"
                label="Ngày lập"
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
              <Input
                name="soTien"
                label="Số tiền"
                type="number"
                min="0"
                step="1"
                required
              />
              <div className="lg:col-span-2">
                <Textarea name="dienGiai" label="Diễn giải" rows={3} required />
              </div>

              <Textarea name="ghiChu" label="Ghi chú" rows={3} />
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={createEntry.isPending}>
                <Save className="w-4 h-4 mr-2" />
                Lưu chứng từ
              </Button>
            </div>
          </Form>
        </div>

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
              Danh sách nhật ký chứng từ
            </h2>
            <div className="text-sm text-gray-600">
              <span>Tổng bản ghi: {tableData.length}</span>
              <span className="mx-2">|</span>
              <span>Tổng tiền: {formatCurrency(totalAmount)}</span>
            </div>
          </div>

          {isLoading || isFetching ? (
            <Loading />
          ) : (
            <Table
              data={tableData}
              columns={columns}
              enablePagination
              enableSorting
              initialState={{ pagination: { pageSize: 20 } }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
