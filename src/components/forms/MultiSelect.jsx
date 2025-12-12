import { forwardRef, useState, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { ChevronDown, AlertCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * MultiSelect component với custom dropdown và validation từ React Hook Form
 */
export const MultiSelect = forwardRef(function MultiSelect(
  {
    name,
    label,
    options = [],
    placeholder = 'Chọn nhiều tùy chọn',
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
  } = useFormContext()

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)
  const selectedValues = watch(name) || []

  const error = errors[name]

  // Đăng ký field với React Hook Form
  useEffect(() => {
    register(name)
  }, [register, name])

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const toggleOption = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]
    setValue(name, newValues, { shouldValidate: true })
  }

  const filteredOptions = options.filter((option) => {
    const label = typeof option === 'object' ? option.label : option
    return label.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getOptionLabel = (option) => {
    return typeof option === 'object' ? option.label : option
  }

  const getOptionValue = (option) => {
    return typeof option === 'object' ? option.value : option
  }

  const selectedLabels = selectedValues
    .map((val) => {
      const option = options.find((opt) => getOptionValue(opt) === val)
      return option ? getOptionLabel(option) : val
    })
    .join(', ')

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
            'w-full px-4 py-2.5 border rounded-lg transition-all duration-200 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
            'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500',
            'text-gray-900 cursor-pointer text-left',
            'hover:border-gray-400',
            error
              ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500 bg-red-50/50'
              : 'border-gray-300',
            className
          )}
        >
          <span className={cn('block truncate', !selectedLabels && 'text-gray-400')}>
            {selectedLabels || placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown
              className={cn(
                'h-5 w-5 text-gray-400 transition-transform duration-200',
                isOpen && 'transform rotate-180'
              )}
            />
          </span>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
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
                  const value = getOptionValue(option)
                  const label = getOptionLabel(option)
                  const isSelected = selectedValues.includes(value)

                  return (
                    <label
                      key={value}
                      className={cn(
                        'flex items-center px-4 py-2.5 cursor-pointer transition-colors duration-150',
                        'hover:bg-blue-50',
                        isSelected && 'bg-blue-100'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOption(value)}
                        onClick={(e) => e.stopPropagation()}
                        className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                      />
                      <span className="text-sm text-gray-900 flex-1">{label}</span>
                    </label>
                  )
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
  )
})


