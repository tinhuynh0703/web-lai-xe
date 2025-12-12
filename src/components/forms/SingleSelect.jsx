import { forwardRef, useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * SingleSelect component với custom dropdown và validation từ React Hook Form
 */
export const SingleSelect = forwardRef(function SingleSelect(
  {
    name,
    label,
    options = [],
    placeholder = "Chọn một tùy chọn",
    className,
    disabled,
    required,
    ...props
  },
  ref
) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const selectedValue = watch(name) || "";

  const error = errors[name];

  // Đăng ký field với React Hook Form
  useEffect(() => {
    register(name);
  }, [register, name]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleSelect = (value) => {
    setValue(name, value, { shouldValidate: true });
    setIsOpen(false);
    setSearchTerm("");
  };

  const filteredOptions = options.filter((option) => {
    const label = typeof option === "object" ? option.label : option;
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getOptionLabel = (option) => {
    return typeof option === "object" ? option.label : option;
  };

  const getOptionValue = (option) => {
    return typeof option === "object" ? option.value : option;
  };

  const selectedLabel = selectedValue
    ? (() => {
        const option = options.find(
          (opt) => getOptionValue(opt) === selectedValue
        );
        return option ? getOptionLabel(option) : selectedValue;
      })()
    : "";

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-2.5 border rounded-lg transition-all duration-200 bg-white",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500",
            "text-gray-900 cursor-pointer text-left",
            "hover:border-gray-400",
            error
              ? "border-red-400 focus:ring-red-500/20 focus:border-red-500 bg-red-50/50"
              : "border-gray-300",
            className
          )}
        >
          <span
            className={cn("block truncate", !selectedLabel && "text-gray-400")}
          >
            {selectedLabel || placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown
              className={cn(
                "h-5 w-5 text-gray-400 transition-transform duration-200",
                isOpen && "transform rotate-180"
              )}
            />
          </span>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-70 overflow-hidden">
            {/* Search input */}
            {options.length > 5 && (
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                />
              </div>
            )}
            {/* Options list */}
            <div className="max-h-48 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  Không tìm thấy kết quả
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const value = getOptionValue(option);
                  const label = getOptionLabel(option);
                  const isSelected = selectedValue === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleSelect(value)}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm transition-colors duration-150",
                        "hover:bg-blue-50 hover:text-blue-900",
                        "focus:outline-none focus:bg-blue-50 focus:text-blue-900",
                        isSelected && "bg-blue-100 text-blue-900 font-medium"
                      )}
                    >
                      {label}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </p>
      )}
    </div>
  );
});
