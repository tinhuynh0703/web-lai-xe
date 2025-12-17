import { forwardRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Checkbox component với validation từ React Hook Form
 */
export const Checkbox = forwardRef(function Checkbox(
  { name, label, className, disabled, required, ...props },
  ref
) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="w-full">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <label
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              disabled && "cursor-not-allowed opacity-50",
              className
            )}
          >
            <input
              type="checkbox"
              {...field}
              checked={field.value || false}
              disabled={disabled}
              className={cn(
                "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500/20",
                "disabled:bg-gray-50 disabled:cursor-not-allowed",
                error
                  ? "border-red-400 focus:ring-red-500/20"
                  : "border-gray-300",
                className
              )}
              {...props}
              ref={(e) => {
                field.ref(e);
                if (typeof ref === "function") {
                  ref(e);
                } else if (ref) {
                  ref.current = e;
                }
              }}
            />
            <span className="text-sm font-medium text-gray-700">
              {label}
              {required && (
                <span className="text-red-500 ml-1 font-bold">*</span>
              )}
            </span>
          </label>
        )}
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






