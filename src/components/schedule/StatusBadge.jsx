import { getGiaiDoanBadgeInfo } from "../../utils/scheduleHelpers";
import { cn } from "../../lib/utils";

/**
 * Component hiển thị badge màu sắc cho giai đoạn học tập
 */
export function StatusBadge({ giaiDoan, className }) {
  const badgeInfo = getGiaiDoanBadgeInfo(giaiDoan);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        badgeInfo.bgColor,
        badgeInfo.color,
        badgeInfo.borderColor,
        className
      )}
    >
      {badgeInfo.label}
    </span>
  );
}

