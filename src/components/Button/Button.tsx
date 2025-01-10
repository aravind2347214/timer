import React from "react";
interface ButtonProps {
  variant: "primary" | "text" | "outline" | "icon" | "link";
  children?: React.ReactNode;
  label?: string;
  icon?: string; // Only used for icon variant
  className?: string;
  title?:string
  onClick?: (event: React.SyntheticEvent) => void;
}
export function Button({
  variant,
  children,
  label,
  icon,
  title,
  className,
  onClick,
}: ButtonProps) {
  console.assert(
    label !== undefined || children !== undefined,
    "Either label or children must be passed"
  );
  // Conditionally disable the button
  if (variant === "icon") {
    return (
      <button
        onClick={onClick}
        className={`flex items-center ${className}`}
        title={title}
        aria-label={label}
      >
        {children ?? <img src={icon} alt={label} className="w-4 h-4" />}
      </button>
    );
  }
  if (variant === "primary") {
    return (
      <button
        onClick={onClick}
        title={title}

        className={`p-2 bg-primary-50 hover:bg-primary-300 active:bg-primary-400 text-white disabled:bg-primary-500 disabled:text-disabled disabled:cursor-not-allowed rounded-md flex justify-center ${className}`}
      >
        <div className="flex items-center">
          {children ?? <span className={`flex-grow text-center`}>{label}</span>}
        </div>
      </button>
    );
  }
  if (variant === "text") {
    return (
      <button
        onClick={onClick}
        title={title}
        className={`text-primary-50 text-xs hover:text-primary-300 active:text-primary-400 w-72 disabled:text-disabled disabled:cursor-not-allowed ${className}`}
      >
        {children ?? label}
      </button>
    );
  }
  if (variant === "outline") {
    return (
      <button
        title={title}
        className={`p-2 border border-primary-50 text-primary-50 rounded-md hover:border-primary-200 hover:bg-gray-200 hover:text-primary-200 active:bg-gray-300 active:text-primary-300 active:border-primary-300 disabled:border-disabled disabled:text-disabled disabled:cursor-not-allowed ${className}`}
      >
        <div className="flex items-center">
          {children ?? <span className={`flex-grow text-center`}>{label}</span>}
        </div>
      </button>
    );
  }
  return null; // Return nothing if no valid variant is provided
}