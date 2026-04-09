import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Select component đơn giản không cần React Hook Form
 */
export function Select({
  value,
  onChange,
  options = [],
  placeholder = "Chọn loại",
  className,
  disabled,
  label,
  required,
  onFocus,
  onBlur,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const isClickingRef = useRef(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // Tính toán vị trí dropdown đơn giản
  useEffect(() => {
    if (isOpen && buttonRef.current) {
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
      
      // Cập nhật khi scroll hoặc resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      // Kiểm tra xem click có phải vào dropdown hoặc button không
      const clickedInDropdown = dropdownRef.current?.contains(event.target);
      const clickedInButton = buttonRef.current?.contains(event.target);
      
      // Nếu click vào option button trong dropdown, không đóng
      if (clickedInDropdown && event.target.tagName === 'BUTTON') {
        return;
      }
      
      // Chỉ đóng nếu click hoàn toàn bên ngoài
      if (!clickedInDropdown && !clickedInButton) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    if (isOpen) {
      // Sử dụng capture phase để bắt event sớm hơn
      document.addEventListener("mousedown", handleClickOutside, true);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside, true);
      };
    }
  }, [isOpen]);

  const handleSelect = (selectedValue, event) => {
    // Prevent event propagation để tránh click outside handler can thiệp
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    // Gọi onChange trước khi đóng dropdown
    if (onChange) {
      onChange(selectedValue);
    }
    
    // Đóng dropdown ngay lập tức sau khi onChange được gọi
    setIsOpen(false);
    setSearchTerm("");
  };

  // Xử lý click để mở/đóng dropdown
  const handleButtonClick = (e) => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  // Xử lý mouseDown để prevent blur khi click
  const handleMouseDown = (e) => {
    if (disabled) return;
    // Đánh dấu đang trong quá trình click
    isClickingRef.current = true;
    // Prevent default để tránh blur event
    e.preventDefault();
    // Reset flag sau một chút
    setTimeout(() => {
      isClickingRef.current = false;
    }, 100);
  };

  // Xử lý blur, chỉ gọi onBlur khi không phải do click
  const handleBlur = (e) => {
    // Delay để kiểm tra xem có phải click vào dropdown không
    setTimeout(() => {
      if (
        !isClickingRef.current &&
        !isOpen &&
        document.activeElement !== buttonRef.current &&
        (!dropdownRef.current ||
          !dropdownRef.current.contains(document.activeElement))
      ) {
        onBlur?.(e);
      }
    }, 150);
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

  const selectedLabel = value
    ? (() => {
        const option = options.find((opt) => getOptionValue(opt) === value);
        return option ? getOptionLabel(option) : value;
      })()
    : "";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleButtonClick}
          onMouseDown={handleMouseDown}
          onFocus={onFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-2.5 border rounded-lg transition-all duration-200 bg-white",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500",
            "text-gray-900 cursor-pointer text-left",
            "hover:border-gray-400",
            "border-gray-300",
            className
          )}
        >
          <span
            className={cn(
              "block truncate pr-8",
              !selectedLabel && "text-gray-400"
            )}
          >
            {selectedLabel || placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown
              className={cn(
                "h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0",
                isOpen && "transform rotate-180"
              )}
            />
          </span>
        </button>

        {isOpen &&
          !disabled &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              ref={dropdownRef}
              className="fixed z-[9999] bg-white border border-gray-300 rounded-lg shadow-xl max-h-70 overflow-hidden"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                maxHeight: "280px",
              }}
            >
              {/* Search input */}
              {options.length > 10 && (
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
                    const optionValue = getOptionValue(option);
                    const optionLabel = getOptionLabel(option);
                    const isSelected = value === optionValue;

                    return (
                      <button
                        key={optionValue}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(optionValue, e);
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm transition-colors duration-150",
                          "hover:bg-blue-50 hover:text-blue-900",
                          "focus:outline-none focus:bg-blue-50 focus:text-blue-900",
                          isSelected && "bg-blue-100 text-blue-900 font-medium"
                        )}
                      >
                        {optionLabel}
                      </button>
                    );
                  })
                )}
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
}
