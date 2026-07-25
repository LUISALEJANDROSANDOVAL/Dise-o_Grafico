import { useRef, useState, MouseEvent } from "react"

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const onMouseDown = (e: MouseEvent<T>) => {
    if (!ref.current) return
    setIsDragging(true)
    setStartX(e.pageX - ref.current.offsetLeft)
    setScrollLeft(ref.current.scrollLeft)
    // Optional: disable snap while dragging for smoother feeling
    ref.current.style.scrollSnapType = "none"
  }

  const onMouseLeave = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (ref.current) ref.current.style.scrollSnapType = ""
  }

  const onMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (ref.current) ref.current.style.scrollSnapType = ""
  }

  const onMouseMove = (e: MouseEvent<T>) => {
    if (!isDragging || !ref.current) return
    e.preventDefault()
    const x = e.pageX - ref.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll-fast
    ref.current.scrollLeft = scrollLeft - walk
  }

  return {
    ref,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
    className: isDragging ? "cursor-grabbing" : "cursor-grab",
  }
}
