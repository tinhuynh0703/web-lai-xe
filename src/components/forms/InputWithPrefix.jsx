import { forwardRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Input field component với prefix hiển thị mã + tên, nhưng chỉ gửi mã khi submit
 */
export const InputWithPrefix = forwardRef(function InputWithPrefix(
  {
    name,
    label,
    prefixCode,
    prefixName,
    placeholder,
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
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  // Đảm bảo giá trị form luôn là mã
  useEffect(() => {
    setValue(name, prefixCode, { shouldValidate: false });
  }, [name, prefixCode, setValue]);

  // Tính toán padding-left dựa trên độ dài prefix
  const prefixText = `${prefixCode} ${prefixName}`;
  // Sử dụng một giá trị cố định lớn hơn để đảm bảo đủ chỗ cho prefix
  const prefixWidth = Math.max(prefixText.length * 9 + 24, 200);

  return (
    <div className="w-full">
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
        {/* Prefix hiển thị mã + tên */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <span className="text-gray-700 font-medium whitespace-nowrap">
            {prefixCode} {prefixName}
          </span>
        </div>
        <input
          id={name}
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          className={cn(
            "w-full pr-4 py-2.5 border rounded-lg transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500",
            "placeholder:text-gray-400 text-gray-900",
            "hover:border-gray-400",
            error
              ? "border-red-400 focus:ring-red-500/20 focus:border-red-500 bg-red-50/50"
              : "border-gray-300 bg-white",
            className
          )}
          style={{ paddingLeft: `${prefixWidth}px` }}
          {...register(name)}
          {...props}
          ref={ref}
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
