import { forwardRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AlertCircle, Calendar } from "lucide-react";
import ReactDatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import { cn } from "../../lib/utils";
import "react-datepicker/dist/react-datepicker.css";

function parseDateValue(value) {
  if (!value) return null;
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;

  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function formatDateToYmd(date) {
  if (!date || Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * DatePicker component với validation từ React Hook Form
 */
export const DatePicker = forwardRef(function DatePicker(
  {
    name,
    label,
    placeholder,
    className,
    disabled,
    required,
    type = "datetime-local",
    ...props
  },
  ref,
) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

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
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const { ref: fieldRef, value, ...restField } = field;

            if (type === "date") {
              return (
                <div className="w-full [&_.react-datepicker-wrapper]:w-full [&_.react-datepicker__input-container]:w-full">
                  <ReactDatePicker
                    selected={parseDateValue(value)}
                    onChange={(selectedDate) => {
                      restField.onChange(formatDateToYmd(selectedDate));
                    }}
                    onBlur={restField.onBlur}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={placeholder || "dd/MM/yyyy"}
                    locale={vi}
                    disabled={disabled}
                    className={cn(
                      "w-full px-4 py-2.5 pl-10 border rounded-lg transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                      "disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500",
                      "placeholder:text-gray-400 text-gray-900",
                      "hover:border-gray-400",
                      error
                        ? "border-red-400 focus:ring-red-500/20 focus:border-red-500 bg-red-50/50"
                        : "border-gray-300 bg-white",
                      className,
                    )}
                    {...props}
                    ref={(e) => {
                      fieldRef(e);
                      if (typeof ref === "function") {
                        ref(e);
                      } else if (ref) {
                        ref.current = e;
                      }
                    }}
                  />
                </div>
              );
            }

            return (
              <input
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "w-full px-4 py-2.5 pl-10 border rounded-lg transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  "disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500",
                  "placeholder:text-gray-400 text-gray-900",
                  "hover:border-gray-400",
                  error
                    ? "border-red-400 focus:ring-red-500/20 focus:border-red-500 bg-red-50/50"
                    : "border-gray-300 bg-white",
                  className,
                )}
                {...restField}
                {...props}
                value={value ?? ""}
                ref={(e) => {
                  fieldRef(e);
                  if (typeof ref === "function") {
                    ref(e);
                  } else if (ref) {
                    ref.current = e;
                  }
                }}
              />
            );
          }}
        />
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
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
