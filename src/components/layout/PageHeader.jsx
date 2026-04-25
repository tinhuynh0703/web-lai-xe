import { FileText } from "lucide-react";

/**
 * PageHeader component - Header chung cho các trang form
 */
export function PageHeader({
  title,
  sectionTitle,
  sectionDescription,
  icon: Icon = FileText,
  sectionAction = null,
}) {
  return (
    <>
      {/* Main Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-5">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
            {title}
          </h1>
        </div>
      </div>

      {/* Section Header */}
      {sectionTitle && (
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Icon className="w-6 h-6 text-blue-600" />
              {sectionTitle}
            </h2>
            {sectionAction && (
              <div className="w-full sm:w-auto flex sm:justify-end">
                {sectionAction}
              </div>
            )}
          </div>
          {sectionDescription && (
            <p className="text-sm text-gray-500 mt-1">{sectionDescription}</p>
          )}
        </div>
      )}
    </>
  );
}









