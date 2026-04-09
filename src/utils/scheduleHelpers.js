export function normalizeGiaiDoan(giaiDoan) {
  if (!giaiDoan) return "";

  // Trim và loại bỏ khoảng trắng thừa
  const trimmed = giaiDoan.trim();

  // Map các giá trị có thể có từ API
  // Lưu ý: API có thể trả về "L    ", "LH   ", "H    ", "HD   ", "D    ", v.v.
  const mapping = {
    L: "LT", // Lý thuyết
    H: "TH", // Thực hành hình
    D: "TD", // Thực hành đường
    KT: "KT", // Thi kiểm tra
    NG: "NG", // Nghỉ
    DU: "DU", // Dự phòng
    SH: "SH", // Sát hạch
  };

  return mapping[trimmed] || trimmed.toUpperCase();
}

export function getGiaiDoanBadgeInfo(giaiDoan) {
  const normalized = normalizeGiaiDoan(giaiDoan);

  const badgeMap = {
    LT: {
      label: "Lý thuyết",
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-300",
    },
    TH: {
      label: "Thực hành hình",
      color: "text-green-700",
      bgColor: "bg-green-100",
      borderColor: "border-green-300",
    },
    TD: {
      label: "Thực hành đường",
      color: "text-emerald-700",
      bgColor: "bg-emerald-100",
      borderColor: "border-emerald-300",
    },
    KT: {
      label: "Thi kiểm tra",
      color: "text-red-700",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
    },
    NG: {
      label: "Nghỉ",
      color: "text-gray-700",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
    },
    DU: {
      label: "Dự phòng",
      color: "text-amber-700",
      bgColor: "bg-amber-100",
      borderColor: "border-amber-300",
    },
    SH: {
      label: "Sát hạch",
      color: "text-purple-700",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-300",
    },
  };

  return (
    badgeMap[normalized] || {
      label: normalized || "Không xác định",
      color: "text-gray-700",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
    }
  );
}

export function formatDateToDDMMYYYY(dateString) {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return "";
  }
}

export function getAllBadgeTypes() {
  return [
    { code: "LT", ...getGiaiDoanBadgeInfo("LT") },
    { code: "TH", ...getGiaiDoanBadgeInfo("TH") },
    { code: "TD", ...getGiaiDoanBadgeInfo("TD") },
    { code: "KT", ...getGiaiDoanBadgeInfo("KT") },
    { code: "NG", ...getGiaiDoanBadgeInfo("NG") },
    { code: "DU", ...getGiaiDoanBadgeInfo("DU") },
    { code: "SH", ...getGiaiDoanBadgeInfo("SH") },
  ];
}
