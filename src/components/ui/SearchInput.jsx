import { forwardRef } from "react";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Search Input component - không cần FormProvider
 */
export const SearchInput = forwardRef(function SearchInput(
  {
    value,
    onChange,
    placeholder = "Tìm kiếm...",
    className,
    disabled,
    ...props
  },
  ref
) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
          "disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500",
          "placeholder:text-gray-400 text-gray-900 bg-white",
          "hover:border-gray-400 transition-colors",
          "text-sm"
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

