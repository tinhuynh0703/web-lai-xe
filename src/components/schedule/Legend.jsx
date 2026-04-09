import { getAllBadgeTypes } from "../../utils/scheduleHelpers";
import { StatusBadge } from "./StatusBadge";

/**
 * Component hiển thị bảng chú giải các màu sắc giai đoạn
 */
export function Legend() {
  const badgeTypes = getAllBadgeTypes();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Chú giải giai đoạn học tập:
      </h3>
      <div className="flex flex-wrap gap-4">
        {badgeTypes.map((badge) => (
          <div key={badge.code} className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              <span className="font-semibold">{badge.code}</span>
              <span className="mx-1">=</span>
              <StatusBadge giaiDoan={badge.code} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
