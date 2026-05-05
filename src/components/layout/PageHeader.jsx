import { FileText } from "lucide-react";

/**
 * PageHeader — tiêu đề/trình bày section (không còn thanh full-width + vạch xanh phía trên).
 */
export function PageHeader({
  title,
  sectionTitle,
  sectionDescription,
  /** Alias cho sectionDescription (vd. ScheduleCenterPage) */
  description,
  icon: Icon = FileText,
  sectionAction = null,
}) {
  const heading = sectionTitle ?? title;
  const desc = sectionDescription ?? description;

  const showSection = Boolean(heading || desc || sectionAction);

  if (!showSection) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          {heading && (
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Icon className="w-6 h-6 text-blue-600 shrink-0" />
              <span>{heading}</span>
            </h2>
          )}
          {desc && (
            <p
              className={`text-sm text-gray-500 ${heading ? "mt-1" : ""}`}
            >
              {desc}
            </p>
          )}
        </div>
        {sectionAction && (
          <div className="w-full sm:w-auto flex sm:justify-end shrink-0">
            {sectionAction}
          </div>
        )}
      </div>
    </div>
  );
}
