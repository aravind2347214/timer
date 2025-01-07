import React from "react";
import { Trash2, RotateCcw, Pencil, Play } from "lucide-react";

interface ButtonProps {
  variant?: "edit" | "restart" | "delete" | "start"; // Using variants instead of 'type'
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  type?: "submit" | "reset" | "button";
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  onClick,
  disabled = false,
  className = "",
  children,
  type,
}) => {
  // Edit Button
  if (variant === "edit") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 text-blue-500 transition-colors rounded-full hover:bg-blue-50 ${className}`}
        title="Edit Timer"
        type={type}
      >
        <Pencil className="w-5 h-5" />
        {children}
      </button>
    );
  }

  // Restart Button
  else if (variant === "restart") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 text-blue-500 transition-colors rounded-full hover:bg-blue-50 ${className}`}
        title="Restart Timer"
        type={type}
      >
        <RotateCcw className="w-5 h-5" />
        {children}
      </button>
    );
  }

  // Delete Button
  else if (variant === "delete") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 text-red-500 transition-colors rounded-full hover:bg-red-50 ${className}`}
        title="Delete Timer"
        type={type}
      >
        <Trash2 className="w-5 h-5" />
        {children}
      </button>
    );
  }

  // Start Button
  else if (variant === "start") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 text-green-500 transition-colors rounded-full hover:bg-green-50 ${className}`}
        title="Start Timer"
        type={type}
      >
        <Play className="w-5 h-5" />
        {children}
      </button>
    );
  }

  // Default button case (fallback)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${className}`}
    >
      {children}
    </button>
  );
};
