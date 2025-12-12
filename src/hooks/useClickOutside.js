import { useEffect, useRef } from 'react'

/**
 * Hook để detect click bên ngoài element
 * @param {function} handler - Callback khi click outside
 * @returns {React.RefObject} - Ref để attach vào element
 */
export function useClickOutside(handler) {
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handler])

  return ref
}






