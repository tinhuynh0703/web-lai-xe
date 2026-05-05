import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, BarChart3, Search } from "lucide-react";
import { PageHeader } from "../components/layout";
import { Button, Loading, SearchInput } from "../components/ui";
import { Form, DatePicker } from "../components/forms";
import { useTongHopTheoThang } from "../hooks";
import { formatVndAmountDisplay } from "../utils/format";

function normalizeTongHopPayload(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (Array.isArray(raw.so_du_dau_ky)) return raw;
  if (raw.data && Array.isArray(raw.data.so_du_dau_ky)) return raw.data;
  return raw;
}

/**
 * Gộp 3 mảng theo mã tài khoản, thứ tự: ưu tiên thứ tự trong số dư đầu kỳ.
 */
function mergeTongHopRows(apiData) {
  const body = normalizeTongHopPayload(apiData);
  if (!body) return [];
  const dau = Array.isArray(body.so_du_dau_ky) ? body.so_du_dau_ky : [];
  const ps = Array.isArray(body.so_phat_sinh_trong_ky)
    ? body.so_phat_sinh_trong_ky
    : [];
  const cuoi = Array.isArray(body.so_du_cuoi_ky) ? body.so_du_cuoi_ky : [];

  const byMa = new Map();
  const ensure = (ma) => {
    const key = String(ma ?? "");
    if (!key) return null;
    if (!byMa.has(key)) {
      byMa.set(key, {
        ma_tai_khoan: key,
        ten_tai_khoan: "",
        dau: null,
        ps: null,
        cuoi: null,
      });
    }
    return byMa.get(key);
  };

  const apply = (arr, field) => {
    for (const row of arr) {
      const e = ensure(row.ma_tai_khoan);
      if (!e) continue;
      e[field] = row;
      if (row.ten_tai_khoan) e.ten_tai_khoan = row.ten_tai_khoan;
    }
  };
  apply(dau, "dau");
  apply(ps, "ps");
  apply(cuoi, "cuoi");

  const order = [];
  const seen = new Set();
  for (const row of dau) {
    const ma = String(row.ma_tai_khoan ?? "");
    if (ma && !seen.has(ma)) {
      order.push(ma);
      seen.add(ma);
    }
  }
  for (const row of ps) {
    const ma = String(row.ma_tai_khoan ?? "");
    if (ma && !seen.has(ma)) {
      order.push(ma);
      seen.add(ma);
    }
  }
  for (const row of cuoi) {
    const ma = String(row.ma_tai_khoan ?? "");
    if (ma && !seen.has(ma)) {
      order.push(ma);
      seen.add(ma);
    }
  }
  return order.map((ma) => byMa.get(ma)).filter(Boolean);
}

function cellMoney(v) {
  if (v == null || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return "—";
  if (n === 0) return "0";
  return formatVndAmountDisplay(n);
}

function sumBlock(rows, block, field) {
  return rows.reduce((s, r) => s + Number(r[block]?.[field] ?? 0), 0);
}

export default function CanDoiTaiKhoanPage() {
  const navigate = useNavigate();
  const defaultFilters = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const mo = d.getMonth() + 1;
    const kyThang = `${y}-${String(mo).padStart(2, "0")}`;
    return { kyThang, nam: String(y), thang: String(mo) };
  }, []);

  const [applied, setApplied] = useState(() => ({
    nam: defaultFilters.nam,
    thang: defaultFilters.thang,
  }));
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const filterMethods = useForm({
    defaultValues: { kyThang: defaultFilters.kyThang },
  });

  const namNum = Number(applied.nam);
  const thangNum = Number(applied.thang);
  const namArg = Number.isFinite(namNum) && namNum >= 2000 ? namNum : null;
  const thangArg =
    Number.isFinite(thangNum) && thangNum >= 1 && thangNum <= 12
      ? thangNum
      : null;

  const {
    data: rawData,
    isLoading,
    isFetching,
    error,
  } = useTongHopTheoThang(namArg, thangArg);

  const mergedRows = useMemo(() => mergeTongHopRows(rawData), [rawData]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mergedRows;
    return mergedRows.filter((r) => {
      const hay = `${r.ma_tai_khoan} ${r.ten_tai_khoan}`.toLowerCase();
      return hay.includes(q);
    });
  }, [mergedRows, search]);

  const pageCount = Math.ceil(filteredRows.length / pageSize) || 0;

  useEffect(() => {
    setPageIndex(0);
  }, [search, namArg, thangArg]);

  useEffect(() => {
    if (pageCount <= 0) return;
    setPageIndex((p) => Math.min(p, pageCount - 1));
  }, [pageCount, pageSize]);

  const paginatedRows = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, pageIndex, pageSize]);

  const totals = useMemo(
    () => ({
      dauNo: sumBlock(filteredRows, "dau", "tong_no"),
      dauCo: sumBlock(filteredRows, "dau", "tong_co"),
      psNo: sumBlock(filteredRows, "ps", "tong_no"),
      psCo: sumBlock(filteredRows, "ps", "tong_co"),
      cuoiNo: sumBlock(filteredRows, "cuoi", "tong_no"),
      cuoiCo: sumBlock(filteredRows, "cuoi", "tong_co"),
    }),
    [filteredRows],
  );

  const handleFilter = (data) => {
    const raw = String(data.kyThang ?? "").trim();
    const m = /^(\d{4})-(\d{2})$/.exec(raw);
    if (!m) return;
    const nam = m[1];
    const thangNum = Number(m[2]);
    if (thangNum < 1 || thangNum > 12) return;
    setApplied({ nam, thang: String(thangNum) });
  };

  const canPrev = pageIndex > 0;
  const canNext = pageCount > 0 && pageIndex < pageCount - 1;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <PageHeader
        title="Bảng cân đối tài khoản"
        sectionTitle="Bảng cân đối tài khoản theo tháng"
        sectionDescription="Tổng hợp số dư đầu kỳ, phát sinh và số dư cuối kỳ theo năm / tháng"
        icon={BarChart3}
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
            onSubmit={handleFilter}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end max-w-2xl"
          >
            <DatePicker
              name="kyThang"
              label="Tháng và năm"
              type="month"
              required
              min="2000-01"
              max="2100-12"
            />
            <div>
              <Button type="submit" className="w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Tra cứu
              </Button>
            </div>
          </Form>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Bảng cân đối tài khoản — Tháng {thangArg ?? "?"}/{namArg ?? "?"}
            </h2>
            <span className="text-sm text-gray-600">
              Số dòng: {filteredRows.length}
            </span>
          </div>

          <div className="mb-4">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo số hiệu, tên tài khoản..."
            />
          </div>

          {isLoading || isFetching ? (
            <Loading />
          ) : error ? (
            <p className="text-sm text-red-600">
              {error.message || "Không tải được dữ liệu."}
            </p>
          ) : (
            <div className="rounded-md border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full text-sm border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="border-b border-gray-200">
                      <th
                        rowSpan={2}
                        className="px-6 py-3 align-middle text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-14 border-b border-gray-200"
                      >
                        STT
                      </th>
                      <th
                        rowSpan={2}
                        className="px-6 py-3 align-middle text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-b border-gray-200"
                      >
                        Số hiệu
                      </th>
                      <th
                        rowSpan={2}
                        className="px-6 py-3 align-middle text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px] border-b border-gray-200"
                      >
                        Tên tài khoản
                      </th>
                      <th
                        colSpan={2}
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300 border-b border-gray-200"
                      >
                        Số dư đầu kỳ
                      </th>
                      <th
                        colSpan={2}
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300 border-b border-gray-200"
                      >
                        Số phát sinh trong kỳ
                      </th>
                      <th
                        colSpan={2}
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-300 border-b border-gray-200"
                      >
                        Số dư cuối kỳ
                      </th>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-l border-gray-300">
                        Nợ
                      </th>
                      <th className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-l border-gray-300">
                        Có
                      </th>
                      <th className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-l border-gray-300">
                        Nợ
                      </th>
                      <th className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-l border-gray-300">
                        Có
                      </th>
                      <th className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-l border-gray-300">
                        Nợ
                      </th>
                      <th className="px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-l border-gray-300">
                        Có
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedRows.map((row, idx) => (
                      <tr
                        key={row.ma_tai_khoan}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {pageIndex * pageSize + idx + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {row.ma_tai_khoan}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {row.ten_tai_khoan || "—"}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap text-gray-900 border-l border-gray-300">
                          {cellMoney(row.dau?.tong_no)}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap text-gray-900 border-l border-gray-300">
                          {cellMoney(row.dau?.tong_co)}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap text-gray-900 border-l border-gray-300">
                          {cellMoney(row.ps?.tong_no)}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap text-gray-900 border-l border-gray-300">
                          {cellMoney(row.ps?.tong_co)}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap text-gray-900 border-l border-gray-300">
                          {cellMoney(row.cuoi?.tong_no)}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap text-gray-900 border-l border-gray-300">
                          {cellMoney(row.cuoi?.tong_co)}
                        </td>
                      </tr>
                    ))}
                    {filteredRows.length > 0 && (
                      <tr className="bg-gray-100 font-semibold border-t-2 border-gray-200">
                        <td
                          colSpan={3}
                          className="px-6 py-4 text-center text-sm text-gray-900"
                        >
                          TỔNG CỘNG
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap text-sm text-gray-900 border-l border-gray-300">
                          {formatVndAmountDisplay(totals.dauNo)}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap text-sm text-gray-900 border-l border-gray-300">
                          {formatVndAmountDisplay(totals.dauCo)}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap text-sm text-gray-900 border-l border-gray-300">
                          {formatVndAmountDisplay(totals.psNo)}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap text-sm text-gray-900 border-l border-gray-300">
                          {formatVndAmountDisplay(totals.psCo)}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap text-sm text-gray-900 border-l border-gray-300">
                          {formatVndAmountDisplay(totals.cuoiNo)}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums whitespace-nowrap text-sm text-gray-900 border-l border-gray-300">
                          {formatVndAmountDisplay(totals.cuoiCo)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredRows.length > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-gray-200 bg-white">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPageIndex(0)}
                      disabled={!canPrev}
                      className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
                    >
                      Đầu
                    </button>
                    <button
                      type="button"
                      onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                      disabled={!canPrev}
                      className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
                    >
                      Trước
                    </button>
                    <span className="px-3 py-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg">
                      Trang {pageIndex + 1} / {pageCount || 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPageIndex((p) => Math.min(pageCount - 1, p + 1))
                      }
                      disabled={!canNext}
                      className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
                    >
                      Sau
                    </button>
                    <button
                      type="button"
                      onClick={() => setPageIndex(Math.max(0, pageCount - 1))}
                      disabled={!canNext}
                      className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
                    >
                      Cuối
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="can-doi-tai-khoan-page-size"
                      className="text-sm text-gray-700"
                    >
                      Hiển thị:
                    </label>
                    <select
                      id="can-doi-tai-khoan-page-size"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageIndex(0);
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
              )}
              {filteredRows.length === 0 && !isLoading && (
                <p className="p-8 text-center text-sm text-gray-500">
                  Không có dữ liệu cho kỳ đã chọn hoặc không khớp bộ lọc.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
