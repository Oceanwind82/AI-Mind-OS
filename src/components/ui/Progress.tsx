import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

// Inline utility function to avoid import issues
function cn(...inputs: unknown[]) {
  return clsx(inputs);
}

const progressVariants = cva(
  "relative overflow-hidden rounded-full bg-[var(--bg-tertiary)]",
  {
    variants: {
      size: {
        sm: "h-2",
        default: "h-3",
        lg: "h-4",
        xl: "h-6",
      },
      variant: {
        default: "bg-[var(--bg-tertiary)]",
        glass: "bg-[var(--bg-glass)] backdrop-blur-sm",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-out",
  {
    variants: {
      color: {
        primary: "bg-[var(--accent-primary)]",
        secondary: "bg-[var(--accent-secondary)]",
        success: "bg-[var(--accent-success)]",
        warning: "bg-[var(--accent-warning)]",
        danger: "bg-[var(--accent-danger)]",
        gradient: "bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]",
      },
      animated: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      color: "primary",
      animated: false,
    },
  }
);

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
  color?: VariantProps<typeof progressIndicatorVariants>["color"];
  animated?: boolean;
  showValue?: boolean;
  label?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    size, 
    variant, 
    color = "primary",
    animated = false,
    showValue = false,
    label,
    ...props 
  }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    return (
      <div className="w-full space-y-2">
        {(label || showValue) && (
          <div className="flex justify-between items-center text-sm">
            {label && <span className="text-[var(--text-secondary)]">{label}</span>}
            {showValue && (
              <span className="text-[var(--text-primary)] font-medium">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div
          ref={ref}
          className={cn(progressVariants({ size, variant }), className)}
          role="progressbar"
          aria-valuenow={Number.isFinite(value) ? Math.round(value) : 0}
          aria-valuemax={Number.isFinite(max) ? Math.round(max) : 100}
          aria-valuemin={0}
          aria-label={label || undefined}
          {...props}
        >
          <div
            className={cn(
              progressIndicatorVariants({ color, animated }),
              "h-full transition-all duration-500 ease-out"
            )}
            data-progress-width={`${Math.min(100, Math.max(0, percentage))}%`}
            {...({
              style: { width: `${Math.min(100, Math.max(0, percentage))}%` }
            } as React.HTMLAttributes<HTMLDivElement>)}
          />
          {size === "xl" && showValue && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-[var(--text-primary)] mix-blend-difference">
                {Math.round(percentage)}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";

// Circular progress variant
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  showValue?: boolean;
  label?: string;
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({
    value = 0,
    max = 100,
    size = 120,
    strokeWidth = 8,
    color = "var(--accent-primary)",
    className,
    showValue = true,
    label,
  }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div ref={ref} className={cn("relative inline-flex items-center justify-center", className)}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          role="progressbar"
          aria-valuenow={Number.isFinite(value) ? Math.round(value) : 0}
          aria-valuemax={Number.isFinite(max) ? Math.round(max) : 100}
          aria-valuemin={0}
          aria-label={label || undefined}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--bg-tertiary)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {Math.round(percentage)}%
            </span>
            {label && (
              <span className="text-xs text-[var(--text-secondary)] mt-1">
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = "CircularProgress";

export { Progress, CircularProgress, progressVariants };
