import React, { useEffect } from "react";

export type ToastVariant = "default" | "destructive" | "success";

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  onDismiss: (id: string) => void;
}

export const Toast = ({
  id,
  title,
  description,
  variant = "default",
  onDismiss,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const baseStyles =
    "pointer-events-auto relative w-full overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all animate-in slide-in-from-bottom-full";

  const variants = {
    default: "border-neutral-200 bg-white text-neutral-950",
    destructive: "border-red-500 bg-red-500 text-white", // Simplified destructive
    success: "border-green-500 bg-green-500 text-white",
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} mb-4 flex flex-col gap-1 items-start`}
    >
      {title && <div className="text-sm font-semibold">{title}</div>}
      {description && <div className="text-sm opacity-90">{description}</div>}
      <button
        onClick={() => onDismiss(id)}
        className="absolute right-2 top-2 rounded-md p-1 text-inherit opacity-50 hover:opacity-100 transition-opacity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};
