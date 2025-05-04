
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Check if the variant is success to apply custom structure
        const isSuccessVariant = variant === 'success';

        return (
          <Toast key={id} variant={variant} {...props}>
            {isSuccessVariant ? (
              // Custom structure for success variant
              <div className="flex flex-col w-full">
                {/* Orange Header */}
                <div className="bg-accent text-accent-foreground p-3 rounded-t-md relative"> {/* Adjust padding */}
                  {title && <ToastTitle>{title}</ToastTitle>}
                   {/* Place Close button inside header for success variant */}
                   <ToastClose className="absolute right-1 top-1 group-[.success]:text-accent-foreground/70 group-[.success]:hover:text-accent-foreground" />
                </div>
                {/* White Body */}
                <div className="p-4 pt-3 grid gap-1"> {/* Adjust padding */}
                  {description && <ToastDescription>{description}</ToastDescription>}
                   {/* Action button remains in the body */}
                   {action}
                </div>
              </div>
            ) : (
              // Default structure for other variants
              <>
                <div className="grid gap-1 p-6 pr-8"> {/* Apply default padding here */}
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && <ToastDescription>{description}</ToastDescription>}
                </div>
                 {/* Action and Close remain outside the grid for default */}
                {action}
                <ToastClose />
              </>
            )}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
