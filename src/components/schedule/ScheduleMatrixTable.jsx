import { useMemo, useState, useEffect, useRef } from "react";
import {
  normalizeGiaiDoan,
  getGiaiDoanBadgeInfo,
  formatDateToDDMMYYYY,
} from "../../utils/scheduleHelpers";
import { cn } from "../../lib/utils";
import { Select } from "../ui/Select";
import { SearchInput } from "../ui/SearchInput";
import { rowMatchesGlobalSearch } from "../../lib/utils";
import { useTrainingPlans, useUpdateManySchedules } from "../../hooks";
import { showSuccess, showError } from "../../utils";

/**
 * Component bảng ma trận hiển thị lịch học dạng Excel Grid
 * - Cột cố định: Mã khóa học, Số lượng học viên
 * - Cột ngang: Timeline theo Tháng/Tuần
 * - Map dữ liệu vào đúng ô với màu sắc tương ứng
 */
export function ScheduleMatrixTable({
  data = [],
  total = 0,
  pageIndex = 1,
  pageSize = 10,
  totalPages = 0,
  onPageChange,
  onPageSizeChange,
}) {
  // State để track ô đang được edit: { courseKey, weekKey }
  const [editingCell, setEditingCell] = useState(null);
  const [matrixSearch, setMatrixSearch] = useState("");
  const tableRef = useRef(null);

  const filteredScheduleData = useMemo(() => {
    const list = data || [];
    const q = matrixSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter((course) => {
      const ma = course.ma_kh || course.maKh || "";
      const soLuong =
        course.so_luong_hoc_vien ?? course.soLuongHocVien ?? "";
      const flat = { ma_kh: ma, so_luong_hoc_vien: soLuong };
      if (rowMatchesGlobalSearch(flat, q)) return true;
      try {
        return JSON.stringify(course.thong_tin_chi_tiets || [])
          .toLowerCase()
          .includes(q);
      } catch {
        return false;
      }
    });
  }, [data, matrixSearch]);

  // Fetch training plans để lấy danh sách giai đoạn
  const { data: trainingPlans = [], isLoading: isLoadingPlans } =
    useTrainingPlans();

  // Mutation để update schedules
  const updateManySchedules = useUpdateManySchedules();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editingCell &&
        tableRef.current &&
        !tableRef.current.contains(event.target)
      ) {
        setEditingCell(null);
      }
    };

    if (editingCell) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [editingCell]);

  // Helper function để map từ tên đầy đủ sang chữ viết tắt
  const getAbbreviation = (tenDaoTao) => {
    if (!tenDaoTao) return "";

    const ten = tenDaoTao.toLowerCase().trim();

    // Map các tên đầy đủ sang viết tắt (theo thứ tự ưu tiên từ dài đến ngắn)
    const mapping = [
      { key: "lý thuyết hình", abbrev: "LT" },
      { key: "lý thuyết", abbrev: "LT" },
      { key: "thực hành đường", abbrev: "TD" },
      { key: "thực hành hình", abbrev: "TH" },
      { key: "thực hành", abbrev: "TH" },
      { key: "thi kiểm tra", abbrev: "KT" },
      { key: "kiểm tra", abbrev: "KT" },
      { key: "sát hạch", abbrev: "SH" },
      { key: "dự phòng", abbrev: "DU" },
      { key: "nghỉ", abbrev: "NG" },
    ];

    // Tìm mapping chính xác (tìm từ dài nhất trước)
    for (const { key, abbrev } of mapping) {
      if (ten.includes(key)) {
        return abbrev;
      }
    }

    // Nếu không tìm thấy, trả về chữ cái đầu của mỗi từ (tối đa 2 ký tự)
    const words = ten.split(/\s+/).filter(Boolean);
    if (words.length > 0) {
      return words
        .map((word) => word.charAt(0).toUpperCase())
        .join("")
        .substring(0, 2);
    }

    return ten.substring(0, 2).toUpperCase();
  };

  // Convert training plans to options với label là tên đầy đủ
  const trainingPlanOptions = useMemo(() => {
    return trainingPlans.map((plan) => ({
      value: plan.ma_dao_tao,
      label: plan.ten_dao_tao, // Hiển thị tên đầy đủ
    }));
  }, [trainingPlans]);
  // Helper function để parse date và lấy năm, tháng
  const parseDateInfo = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 1-12
      };
    } catch (error) {
      return null;
    }
  };

  // Xử lý dữ liệu để tạo timeline và map vào grid
  const { timeline, gridData, courses } = useMemo(() => {
    if (!filteredScheduleData || filteredScheduleData.length === 0) {
      return { timeline: [], gridData: new Map(), courses: [] };
    }

    // Thu thập tất cả các tuần từ tất cả khóa học
    const weekSet = new Set();
    const courseMap = new Map();
    const weekInfoMap = new Map(); // Lưu thông tin chi tiết của từng tuần

    filteredScheduleData.forEach((course) => {
      const courseKey = course.ma_kh || course.maKh;
      const scheduleDetails = course.thong_tin_chi_tiets || [];
      const studentCount =
        course.so_luong_hoc_vien || course.soLuongHocVien || 0;

      // Tạo map cho khóa học này
      const courseWeekMap = new Map();

      scheduleDetails.forEach((detail) => {
        // Parse date để lấy năm và tháng chính xác
        const dateInfo = parseDateInfo(detail.tu_ngay || detail.den_ngay);
        if (!dateInfo) return; // Bỏ qua nếu không parse được date

        const year = dateInfo.year;
        const month = dateInfo.month;
        const tuan = detail.tuan || 0;

        // Tạo key với format: YYYY-MM_Tuan (ví dụ: "2025-11_1", "2026-01_8")
        const weekKey = `${year}-${String(month).padStart(2, "0")}_${tuan}`;

        // Thêm vào set timeline
        weekSet.add(weekKey);

        // Lưu thông tin tuần vào weekInfoMap nếu chưa có
        if (!weekInfoMap.has(weekKey)) {
          weekInfoMap.set(weekKey, {
            year,
            month,
            tuan: detail.tuan || tuan,
            thang: detail.thang || month, // Lưu thang từ detail (quan trọng cho API)
            monthYearKey: `${year}-${String(month).padStart(2, "0")}`, // Key để group theo tháng/năm
            tu_ngay: detail.tu_ngay || "",
            den_ngay: detail.den_ngay || "",
          });
        }

        // Lưu thông tin tháng để format
        if (!courseWeekMap.has(weekKey)) {
          courseWeekMap.set(weekKey, {
            year,
            month,
            tuan,
            items: [],
            hasKiemTra: !!detail.kiem_tra,
          });
        }

        const weekData = courseWeekMap.get(weekKey);
        weekData.items.push({
          giai_doan: detail.giai_doan || "",
          kiem_tra: detail.kiem_tra || "",
          ma_lich_hoc: detail.ma_lich_hoc || "",
          tu_ngay: detail.tu_ngay || "",
          den_ngay: detail.den_ngay || "",
          thang: detail.thang || 0,
          tuan: detail.tuan || 0,
          ma_kh: courseKey,
        });
      });

      courseMap.set(courseKey, {
        ma_kh: courseKey,
        so_luong: studentCount,
        weekMap: courseWeekMap,
      });
    });

    // Sắp xếp timeline theo thời gian thực tế (năm, tháng, tuần)
    const timelineArray = Array.from(weekSet)
      .map((key) => {
        const info = weekInfoMap.get(key);
        if (!info) return null;
        return {
          key,
          year: info.year,
          month: info.month,
          tuan: info.tuan,
          monthYearKey: info.monthYearKey,
          tu_ngay: info.tu_ngay,
          den_ngay: info.den_ngay,
          thang: info.thang || info.month, // Lưu thang từ detail hoặc month
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        // Sắp xếp theo năm trước
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        // Sau đó theo tháng
        if (a.month !== b.month) {
          return a.month - b.month;
        }
        // Cuối cùng theo tuần
        return a.tuan - b.tuan;
      });

    // Group timeline theo tháng/năm để hiển thị header
    const timelineGrouped = [];
    let currentMonthYear = null;
    let currentGroup = null;

    timelineArray.forEach((week) => {
      if (week.monthYearKey !== currentMonthYear) {
        if (currentGroup) {
          timelineGrouped.push(currentGroup);
        }
        currentGroup = {
          monthYearKey: week.monthYearKey,
          year: week.year,
          month: week.month,
          weeks: [week],
        };
        currentMonthYear = week.monthYearKey;
      } else {
        currentGroup.weeks.push(week);
      }
    });
    if (currentGroup) {
      timelineGrouped.push(currentGroup);
    }

    return {
      timeline: timelineGrouped,
      gridData: courseMap,
      courses: Array.from(courseMap.values()),
    };
  }, [filteredScheduleData]);

  // Format tháng để hiển thị (ví dụ: "01/2025")
  const formatMonth = (monthYearKey) => {
    if (!monthYearKey) return "";
    // monthYearKey có format: "YYYY-MM"
    const [year, month] = monthYearKey.split("-");
    return `${month}/${year}`;
  };

  // Handler để xử lý thay đổi giai_doan (có thể là update hoặc create mới)
  const handleGiaiDoanChange = async (
    scheduleItem,
    newGiaiDoan,
    weekInfo,
    courseKey
  ) => {
    console.log(
      "Updating/Creating giai_doan for item:",
      scheduleItem,
      "to new value:",
      newGiaiDoan,
      "weekInfo:",
      weekInfo,
      "courseKey:",
      courseKey
    );

    if (!newGiaiDoan) {
      showError("Vui lòng chọn giai đoạn");
      return;
    }

    // Nếu không có scheduleItem hoặc ma_lich_hoc, tạo mới từ thông tin week và course
    const isNewItem = !scheduleItem || !scheduleItem.ma_lich_hoc;

    if (isNewItem && (!weekInfo || !courseKey)) {
      showError("Không tìm thấy thông tin để tạo lịch học mới");
      return;
    }

    try {
      // newGiaiDoan là ma_dao_tao từ training plans
      // Cần map từ ma_dao_tao sang format mà API yêu cầu
      // API yêu cầu format như "L    ", "H    ", "D    " (4 ký tự với padding)
      let giaiDoan = (newGiaiDoan || "").trim();

      // Map từ ma_dao_tao sang format API (nếu cần)
      // Nếu ma_dao_tao đã là format đúng thì giữ nguyên, nếu không thì normalize
      // API có thể yêu cầu format "L    " (4 ký tự), nên pad thêm khoảng trắng
      if (giaiDoan.length > 0 && giaiDoan.length < 4) {
        giaiDoan = giaiDoan.padEnd(4, " ");
      }

      // Chuẩn bị payload theo đúng format API spec
      // Chỉ gửi các trường có giá trị, không gửi string rỗng
      const payloadItem = {
        ma_kh: scheduleItem?.ma_kh || courseKey || "",
        thang: scheduleItem?.thang || weekInfo?.thang || 0,
        tuan: scheduleItem?.tuan || weekInfo?.tuan || 0,
        tu_ngay: scheduleItem?.tu_ngay || weekInfo?.tu_ngay || "",
        den_ngay: scheduleItem?.den_ngay || weekInfo?.den_ngay || "",
        giai_doan: giaiDoan,
      };

      // Chỉ thêm các trường có giá trị
      if (scheduleItem?.kiem_tra && scheduleItem.kiem_tra.trim()) {
        payloadItem.kiem_tra = scheduleItem.kiem_tra.trim();
      }

      if (scheduleItem?.ghi_chu && scheduleItem.ghi_chu.trim()) {
        payloadItem.ghi_chu = scheduleItem.ghi_chu.trim();
      }

      const payload = [payloadItem];

      // Gọi API PUT /api/LichHocs/update-many (có thể tạo mới nếu chưa có)
      await updateManySchedules.mutateAsync(payload);
      showSuccess(
        isNewItem
          ? "Tạo giai đoạn thành công!"
          : "Cập nhật giai đoạn thành công!"
      );
      setEditingCell(null); // Đóng dropdown sau khi update
    } catch (error) {
      showError(
        error.message || "Không thể cập nhật giai đoạn. Vui lòng thử lại."
      );
    }
  };

  // Xử lý hiển thị cell với nhiều nội dung
  const renderCell = (weekData, courseKey, weekKey) => {
    const isEditing =
      editingCell?.courseKey === courseKey && editingCell?.weekKey === weekKey;

    // Lấy thông tin tuần từ timeline để sử dụng khi tạo mới
    let weekInfo = null;
    for (const monthGroup of timeline) {
      const week = monthGroup.weeks.find((w) => w.key === weekKey);
      if (week) {
        weekInfo = week;
        break;
      }
    }

    // Nếu không tìm thấy trong timeline, parse từ weekKey (format: "YYYY-MM_Tuan")
    if (!weekInfo && weekKey) {
      const [monthYear, tuanStr] = weekKey.split("_");
      if (monthYear && tuanStr) {
        const [year, month] = monthYear.split("-");
        weekInfo = {
          key: weekKey,
          year: parseInt(year),
          month: parseInt(month),
          tuan: parseInt(tuanStr),
          thang: parseInt(month), // Fallback: sử dụng month làm thang
          monthYearKey: monthYear,
          tu_ngay: "",
          den_ngay: "",
        };
      }
    }

    // Nếu không có dữ liệu, vẫn cho phép edit để tạo mới
    if (!weekData || !weekData.items || weekData.items.length === 0) {
      // Nếu đang edit, hiển thị Select
      if (isEditing && !isLoadingPlans) {
        return (
          <div className="w-full h-full min-h-[40px] p-0.5">
            <Select
              value=""
              onChange={(newValue) => {
                console.log("Select onChange called with:", newValue);
                if (newValue) {
                  // Tạo schedule item mới từ weekInfo và courseKey
                  const newScheduleItem = {
                    ma_kh: courseKey,
                    thang: weekInfo?.thang || 0,
                    tuan: weekInfo?.tuan || 0,
                    tu_ngay: weekInfo?.tu_ngay || "",
                    den_ngay: weekInfo?.den_ngay || "",
                    giai_doan: "",
                    kiem_tra: "",
                    ghi_chu: "",
                  };
                  handleGiaiDoanChange(
                    newScheduleItem,
                    newValue,
                    weekInfo,
                    courseKey
                  );
                }
              }}
              options={trainingPlanOptions}
              placeholder="Chọn GĐ"
              className="w-full text-xs"
              onBlur={() => {
                setTimeout(() => {
                  setEditingCell(null);
                }, 200);
              }}
            />
          </div>
        );
      }

      return (
        <div
          className="w-full h-full min-h-[40px] cursor-pointer hover:bg-gray-50 flex items-center justify-center border border-dashed border-gray-300 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setEditingCell({ courseKey, weekKey });
          }}
          title="Click để thêm giai đoạn"
        ></div>
      );
    }

    // Lấy schedule item đầu tiên để edit (nếu có nhiều items, sẽ edit item đầu tiên)
    const firstItem = weekData.items[0];

    // Xử lý trường hợp một tuần có nhiều nội dung
    // Có thể có format như "H+T" hoặc "T+Đ" trong giai_doan
    const giaiDoanList = [];

    weekData.items.forEach((item) => {
      const giaiDoan = item.giai_doan || "";
      // Kiểm tra nếu có dấu + trong giai_doan (ví dụ: "H+T", "T+Đ")
      if (giaiDoan.includes("+")) {
        const parts = giaiDoan
          .split("+")
          .map((p) => normalizeGiaiDoan(p.trim()));
        giaiDoanList.push(...parts);
      } else {
        const normalized = normalizeGiaiDoan(giaiDoan);
        if (normalized) {
          giaiDoanList.push(normalized);
        }
      }
    });

    // Loại bỏ duplicate và sắp xếp theo thứ tự ưu tiên
    const priorityOrder = ["LT", "TH", "TD", "KT", "SH", "NG", "DU"];
    const uniqueGiaiDoan = [...new Set(giaiDoanList)]
      .filter(Boolean)
      .sort((a, b) => {
        const indexA = priorityOrder.indexOf(a);
        const indexB = priorityOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });

    if (uniqueGiaiDoan.length === 0) {
      return <div className="w-full h-full min-h-[40px]"></div>;
    }

    // Nếu có nhiều giai đoạn, hiển thị dạng "LT+TH"
    const displayText = uniqueGiaiDoan.join("+");

    // Nếu có nhiều màu, sử dụng gradient hoặc màu của giai đoạn đầu tiên
    const firstGiaiDoan = uniqueGiaiDoan[0];
    const badgeInfo = getGiaiDoanBadgeInfo(firstGiaiDoan);

    // Kiểm tra có kiểm tra không
    const hasKiemTra = weekData.hasKiemTra;

    // Tạo tooltip với đầy đủ thông tin
    const tooltipText = uniqueGiaiDoan
      .map((g) => {
        const info = getGiaiDoanBadgeInfo(g);
        return info.label;
      })
      .join(" + ");

    // Nếu đang edit, hiển thị Select
    if (isEditing && !isLoadingPlans) {
      // Map từ giai_doan hiện tại (có thể là "L    ", "H    ") sang ma_dao_tao
      // để match với options trong Select
      const currentGiaiDoan = firstItem.giai_doan?.trim() || "";
      let currentValue = "";

      // Tìm option tương ứng với giai_doan hiện tại
      // Có thể cần normalize từ "L" sang "LT", "H" sang "TH", v.v.
      if (currentGiaiDoan) {
        const normalized = normalizeGiaiDoan(currentGiaiDoan);
        // Tìm option có ma_dao_tao tương ứng
        const matchedOption = trainingPlanOptions.find((opt) => {
          // So sánh ma_dao_tao với normalized value
          const optValue = (opt.value || "").trim().toUpperCase();
          return (
            optValue === normalized ||
            optValue === currentGiaiDoan.toUpperCase()
          );
        });
        currentValue = matchedOption?.value || currentGiaiDoan;
      }

      return (
        <div className="w-full h-full min-h-[40px] p-0.5">
          <Select
            value={currentValue}
            onChange={(newValue) => {
              console.log("Select onChange called with:", newValue);
              // newValue là ma_dao_tao từ training plans
              if (newValue) {
                handleGiaiDoanChange(firstItem, newValue, weekInfo, courseKey);
              }
            }}
            options={trainingPlanOptions}
            placeholder="Chọn giai đoạn"
            className="w-full text-xs"
            onBlur={() => {
              // Delay để đảm bảo onChange được gọi trước
              setTimeout(() => {
                setEditingCell(null);
              }, 200);
            }}
          />
        </div>
      );
    }

    return (
      <div
        className={cn(
          "w-full h-full min-h-[40px] flex items-center justify-center text-xs font-semibold",
          "border border-gray-200 rounded px-1 py-1",
          badgeInfo.bgColor,
          badgeInfo.color,
          "relative cursor-pointer hover:opacity-80 transition-opacity",
          isEditing && "ring-2 ring-blue-500"
        )}
        title={tooltipText}
        onClick={(e) => {
          e.stopPropagation();
          setEditingCell({ courseKey, weekKey });
        }}
      >
        <span className="text-center leading-tight">{displayText}</span>
        {hasKiemTra && (
          <span
            className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"
            title="Có kiểm tra"
          ></span>
        )}
      </div>
    );
  };

  // Render pagination
  const renderPagination = () => {
    const pageCount = totalPages || Math.ceil(total / pageSize);
    const currentPage = pageIndex;

    if (pageCount <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Trang {currentPage} / {pageCount} ({total} kết quả)
          </span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="ml-4 px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
            <option value={100}>100 / trang</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= pageCount}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      </div>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500">
        Không có dữ liệu lịch học
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <SearchInput
            value={matrixSearch}
            onChange={(e) => setMatrixSearch(e.target.value)}
            placeholder="Tìm kiếm mã khóa học, số HV..."
          />
        </div>
        <div className="p-12 text-center text-sm text-gray-500">
          Không có khóa học khớp tìm kiếm
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-visible"
      ref={tableRef}
    >
      <div className="px-4 pt-4 pb-2 border-b border-gray-200 bg-white">
        <SearchInput
          value={matrixSearch}
          onChange={(e) => setMatrixSearch(e.target.value)}
          placeholder="Tìm kiếm mã khóa học, số HV..."
        />
      </div>
      {/* Table với sticky columns */}
      <div className="overflow-x-auto overflow-y-visible">
        <div className="inline-block min-w-full">
          <table className="min-w-full border-collapse">
            <thead>
              {/* Header row 1: Tháng */}
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="sticky left-0 z-20 bg-gray-50 border-r-2 border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] shadow-sm">
                  Mã Khóa Học
                </th>
                <th className="sticky left-[120px] z-20 bg-gray-50 border-r-2 border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] shadow-sm">
                  Số Lượng HV
                </th>
                {timeline.map((monthGroup) => (
                  <th
                    key={monthGroup.monthYearKey}
                    colSpan={monthGroup.weeks.length}
                    className="px-2 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 bg-gray-100"
                  >
                    Tháng {formatMonth(monthGroup.monthYearKey)}
                  </th>
                ))}
              </tr>
              {/* Header row 2: Tuần */}
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="sticky left-0 z-20 bg-gray-50 border-r-2 border-gray-300 shadow-sm"></th>
                <th className="sticky left-[120px] z-20 bg-gray-50 border-r-2 border-gray-300 shadow-sm"></th>
                {timeline.map((monthGroup) =>
                  monthGroup.weeks.map((week) => (
                    <th
                      key={week.key}
                      className="px-2 py-2 text-center text-xs font-medium text-gray-600 border-r border-gray-200 min-w-[80px]"
                    >
                      Tuần {week.tuan}
                    </th>
                  ))
                )}
              </tr>
              {/* Header row 3: Ngày tháng */}
              <tr className="bg-gray-50 border-b-2 border-gray-300">
                <th className="sticky left-0 z-20 bg-gray-50 border-r-2 border-gray-300 shadow-sm"></th>
                <th className="sticky left-[120px] z-20 bg-gray-50 border-r-2 border-gray-300 shadow-sm"></th>
                {timeline.map((monthGroup) =>
                  monthGroup.weeks.map((week) => {
                    const tuNgay = week.tu_ngay
                      ? formatDateToDDMMYYYY(week.tu_ngay)
                      : "";
                    const denNgay = week.den_ngay
                      ? formatDateToDDMMYYYY(week.den_ngay)
                      : "";
                    return (
                      <th
                        key={week.key}
                        className="px-1 py-1.5 text-center text-[10px] font-normal text-gray-600 border-r border-gray-200 min-w-[80px] leading-tight bg-gray-50"
                        title={
                          tuNgay && denNgay ? `${tuNgay} - ${denNgay}` : ""
                        }
                      >
                        {tuNgay && denNgay ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="whitespace-nowrap">{tuNgay}</span>
                            <span className="text-gray-400 text-[9px]">-</span>
                            <span className="whitespace-nowrap">{denNgay}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </th>
                    );
                  })
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.ma_kh} className="hover:bg-gray-50">
                  {/* Sticky column: Mã khóa học */}
                  <td className="sticky left-0 z-10 bg-white border-r-2 border-gray-300 px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap shadow-sm">
                    {course.ma_kh}
                  </td>
                  {/* Sticky column: Số lượng học viên */}
                  <td className="sticky left-[120px] z-10 bg-white border-r-2 border-gray-300 px-4 py-3 text-sm text-gray-900 text-center whitespace-nowrap shadow-sm">
                    {course.so_luong}
                  </td>
                  {/* Timeline cells */}
                  {timeline.map((monthGroup) =>
                    monthGroup.weeks.map((week) => {
                      const weekData = course.weekMap.get(week.key);
                      return (
                        <td
                          key={week.key}
                          className="px-1 py-1 border-r border-gray-200 text-center align-middle"
                          style={{ minWidth: "80px", width: "80px" }}
                        >
                          {renderCell(weekData, course.ma_kh, week.key)}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}
