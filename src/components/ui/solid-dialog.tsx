// src/components/ui/solid-dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";

export function SolidDialogContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      {/* Dim background overlay */}
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

      {/* SOLID WHITE DIALOG (NO TRANSPARENCY, NO BLUE TEXT) */}
      <DialogPrimitive.Content
        className={`
          fixed left-1/2 top-1/2 z-50 
          -translate-x-1/2 -translate-y-1/2 
          w-full max-w-2xl max-h-[90vh] overflow-y-auto
          bg-white text-slate-900
          border border-neutral-200
          shadow-2xl rounded-2xl p-6
          ${className}
        `}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
