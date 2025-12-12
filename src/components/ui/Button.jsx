import { cn } from "../../lib/utils";

/**
 * Button component với các variants và sizes
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  loading,
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg active:scale-[0.98] cursor-pointer";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-500 border border-gray-300",
    outline:
      "border-1 border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-500 text-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    ghost: "hover:bg-gray-100 focus-visible:ring-gray-500 text-gray-700",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
    warning:
      "bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-base",
    lg: "h-12 px-6 text-xl",
    icon: "h-11 w-11",
  };

  return (
    <button
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Đang tải...
        </>
      ) : (
        children
      )}
    </button>
  );
}
