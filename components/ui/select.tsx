"use client"

import * as React from "react"
import * as ReactDOM from "react-dom"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectContextType {
  value: string
  onChange: (v: string) => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedLabel: string
  setSelectedLabel: React.Dispatch<React.SetStateAction<string>>
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const SelectContext = React.createContext<SelectContextType>({
  value: "",
  onChange: () => {},
  open: false,
  setOpen: () => {},
  selectedLabel: "",
  setSelectedLabel: () => {},
  triggerRef: { current: null },
})

const Select = ({
  children,
  onValueChange,
  defaultValue,
  value,
}: {
  children: React.ReactNode
  onValueChange?: (value: string) => void
  defaultValue?: string
  value?: string
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || value || "")
  const [open, setOpen] = React.useState(false)
  const [selectedLabel, setSelectedLabel] = React.useState("")
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const currentValue = value !== undefined ? value : internalValue

  const handleChange = (newValue: string) => {
    if (value === undefined) setInternalValue(newValue)
    onValueChange?.(newValue)
    setOpen(false)
  }

  return (
    <SelectContext.Provider value={{ value: currentValue, onChange: handleChange, open, setOpen, selectedLabel, setSelectedLabel, triggerRef }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen, triggerRef } = React.useContext(SelectContext)
    return (
      <button
        ref={(node) => {
          if (typeof ref === "function") ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
          ;(triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        }}
        type="button"
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => {
  const { selectedLabel } = React.useContext(SelectContext)
  return (
    <span ref={ref} className={cn("text-sm truncate", !selectedLabel && "text-muted-foreground", className)} {...props}>
      {selectedLabel || placeholder}
    </span>
  )
})
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen, triggerRef } = React.useContext(SelectContext)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 0 })
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => { setMounted(true) }, [])

    React.useEffect(() => {
      if (!open || !triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }, [open, triggerRef])

    React.useEffect(() => {
      if (!open) return
      const handleClickOutside = (e: MouseEvent) => {
        if (
          contentRef.current && !contentRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)
        ) {
          setOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [open, setOpen, triggerRef])

    if (!open || !mounted) return null

    return ReactDOM.createPortal(
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
          ;(contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        style={{
          position: "absolute",
          top: coords.top,
          left: coords.left,
          width: coords.width,
          zIndex: 9999,
        }}
        className={cn(
          "max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>,
      document.body
    )
  }
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const { value: currentValue, onChange, setSelectedLabel } = React.useContext(SelectContext)
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-3 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        currentValue === value && "bg-accent font-medium",
        className
      )}
      onClick={() => {
        const label = typeof children === "string" ? children : value
        setSelectedLabel(label)
        onChange(value)
      }}
      {...props}
    >
      {children}
    </div>
  )
})
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
