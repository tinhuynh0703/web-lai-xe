import * as XLSX from "xlsx";

/**
 * Xuất danh sách hồ sơ học phí ra file .xlsx (chạy trên trình duyệt).
 * @param {Array<{
 *   hoVaTen: string,
 *   ngaySinh: string,
 *   gioiTinh: string,
 *   soCmt: string,
 *   noiCuTru: string,
 *   hocPhi: number,
 *   daHoanThanhHp: boolean
 * }>} rows
 * @param {string} filenameWithoutExt Tên file không đuôi
 */
export function downloadTuitionProfilesXlsx(rows, filenameWithoutExt) {
  const sheetRows = rows.map((r, index) => ({
    STT: index + 1,
    "Họ và tên": r.hoVaTen,
    "Ngày sinh": r.ngaySinh,
    "Giới tính": r.gioiTinh,
    "CMT/CCCD": r.soCmt,
    "Nơi cư trú": r.noiCuTru,
    "Học phí (VNĐ)": Number(r.hocPhi) || 0,
    "Trạng thái": r.daHoanThanhHp ? "Đã hoàn thành" : "Chưa đủ học phí",
  }));

  const ws = XLSX.utils.json_to_sheet(sheetRows);
  ws["!cols"] = [
    { wch: 5 },
    { wch: 28 },
    { wch: 12 },
    { wch: 10 },
    { wch: 16 },
    { wch: 40 },
    { wch: 14 },
    { wch: 20 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Hồ sơ học phí");

  const safe =
    String(filenameWithoutExt || "ho-so-hoc-phi").replace(
      /[/\\?*[\]:]/g,
      "-",
    ) || "ho-so-hoc-phi";
  XLSX.writeFile(wb, `${safe}.xlsx`, { bookType: "xlsx" });
}
