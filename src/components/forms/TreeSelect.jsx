import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useFormContext } from "react-hook-form";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

function flattenTree(nodes = [], depth = 0) {
  return nodes.flatMap((node) => {
    const current = [{ ...node, depth }];
    const children = flattenTree(node.children || [], depth + 1);
    return [...current, ...children];
  });
}

export const TreeSelect = forwardRef(function TreeSelect(
  {
    name,
    label,
    options = [],
    placeholder = "Chọn mục",
    className,
    disabled,
    required,
    minSelectableDepth = 0,
    allowSelectParentIfNoChildren = false,
    onChange,
    ...props
  },
  ref,
) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const error = errors[name];

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedInDropdown = dropdownRef.current?.contains(event.target);
      const clickedInButton = buttonRef.current?.contains(event.target);
      if (!clickedInDropdown && !clickedInButton) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    if (!isOpen) return;
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => document.removeEventListener("mousedown", handleClickOutside, true);
  }, [isOpen]);

  const flatOptions = useMemo(() => flattenTree(options), [options]);
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return flatOptions;
    const keyword = searchTerm.toLowerCase();
    return flatOptions.filter(
      (option) =>
        option.ma_tai_khoan?.toLowerCase().includes(keyword) ||
        option.ten_tai_khoan?.toLowerCase().includes(keyword),
    );
  }, [flatOptions, searchTerm]);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
      )}
      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const selectedValue = field.value || "";
            const selectedOption =
              flatOptions.find((item) => String(item.ma_tai_khoan) === String(selectedValue)) || null;
            const selectedLabel = selectedOption ? `${selectedOption.ten_tai_khoan}` : "";

            const handleSelect = (value, option) => {
              const normalizedValue = String(value);
              field.onChange(normalizedValue);
              if (typeof onChange === "function") {
                onChange(normalizedValue, option);
              }
              setIsOpen(false);
              setSearchTerm("");
            };

            return (
              <>
                <button
                  ref={(el) => {
                    buttonRef.current = el;
                    field.ref(el);
                    if (typeof ref === "function") {
                      ref(el);
                    } else if (ref) {
                      ref.current = el;
                    }
                  }}
                  type="button"
                  onClick={() => !disabled && setIsOpen((prev) => !prev)}
                  onBlur={field.onBlur}
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
                    className,
                  )}
                  {...props}
                >
                  <span className={cn("block truncate", !selectedLabel && "text-gray-400")}>
                    {selectedLabel || placeholder}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown
                      className={cn("h-5 w-5 text-gray-400 transition-transform duration-200", isOpen && "rotate-180")}
                    />
                  </span>
                </button>

                {isOpen &&
                  !disabled &&
                  typeof document !== "undefined" &&
                  createPortal(
                    <div
                      ref={dropdownRef}
                      className="fixed z-[9999] bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
                      style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                        maxHeight: "320px",
                      }}
                    >
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(event) => setSearchTerm(event.target.value)}
                          placeholder="Tìm tài khoản..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        />
                      </div>
                      <div className="max-h-64 overflow-auto">
                        {filteredOptions.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">Không tìm thấy kết quả</div>
                        ) : (
                          filteredOptions.map((option) => {
                            const value = option.ma_tai_khoan;
                            const isSelected = String(selectedValue) === String(value);
                            const hasChildren = (option.children || []).length > 0;
                            const isSelectable =
                              option.depth >= minSelectableDepth ||
                              (allowSelectParentIfNoChildren && option.depth === 0 && !hasChildren);
                            const prefix = option.depth > 0 ? `${" ".repeat(option.depth * 2)}└ ` : "";

                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => isSelectable && handleSelect(value, option)}
                                disabled={!isSelectable}
                                className={cn(
                                  "w-full px-4 py-2.5 text-left text-sm transition-colors duration-150",
                                  isSelectable && "hover:bg-blue-50 hover:text-blue-900",
                                  isSelectable && "focus:outline-none focus:bg-blue-50 focus:text-blue-900",
                                  !isSelectable && "bg-gray-50 text-gray-400 cursor-not-allowed",
                                  isSelected && "bg-blue-100 text-blue-900 font-medium",
                                )}
                              >
                                <span className={cn("font-medium", option.depth > 0 && "font-normal text-gray-700")}>
                                  {prefix}
                                  {option.ten_tai_khoan}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>,
                    document.body,
                  )}
              </>
            );
          }}
        />
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
