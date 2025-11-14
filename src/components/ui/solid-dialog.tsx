import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";

/**
 * SolidDialogContent
 * - Always renders a dark overlay and dark dialog panel (mixed-theme layout: dark header, light body)
 * - Adds className "radix-dialog-content" to style via index.css
 */
export function SolidDialogContent({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & Partial<React.ComponentProps<typeof DialogPrimitive.Content>>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="radix-dialog-overlay" />
      <DialogPrimitive.Content
        {...props}
        className={`radix-dialog-content ${className}`}
      >
        {/* wrapper for header-specific rules */}
        <div className="dialog-header">
          {/*
            consumer components should put DialogHeader/DialogTitle here,
            but we keep a wrapper so CSS can target headers separately.
          */}
        </div>

        {/* actual children (content) */}
        <div>
          {children}
        </div>

        <DialogPrimitive.Close className="sr-only">Close</DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export default SolidDialogContent;
