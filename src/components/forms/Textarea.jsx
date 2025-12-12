import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Textarea field component với validation từ React Hook Form
 */
export const Textarea = forwardRef(function Textarea(
  {
    name,
    label,
    placeholder,
    rows = 4,
    className,
    disabled,
    required,
    ...props
  },
  ref
) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  // Tách ref của RHF ra để xử lý riêng
  const { ref: registerRef, ...restRegister } = register(name);

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
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-2.5 border rounded-lg transition-all duration-200 resize-y",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
          "disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500",
          "placeholder:text-gray-400 text-gray-900",
          "hover:border-gray-400",
          error
            ? "border-red-400 focus:ring-red-500/20 focus:border-red-500 bg-red-50/50"
            : "border-gray-300 bg-white",
          className
        )}
        {...restRegister}
        {...props}
        ref={(e) => {
          // Gán element cho RHF để nó track dữ liệu
          registerRef(e);

          // Gán element cho ref từ bên ngoài (nếu có)
          if (typeof ref === "function") {
            ref(e);
          } else if (ref) {
            ref.current = e;
          }
        }}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </p>
      )}
    </div>
  );
});
