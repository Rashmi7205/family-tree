import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  variant?: "default" | "overlay" | "inline";
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  className,
  text,
  variant = "default",
}) => {
  const loaderElement = (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn("animate-spin", sizeClasses[size])}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          overflow="visible"
          fill="currentColor"
          stroke="none"
          className="single-loader"
        >
          <defs>
            <rect
              id="spinner"
              x="46.5"
              y="45"
              width="6"
              height="14"
              rx="2"
              ry="2"
              transform="translate(0 -30)"
            />
          </defs>
          <use
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xlinkHref="#spinner"
            transform="rotate(0 50 50)"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              begin="0s"
              repeatCount="indefinite"
            />
          </use>
          <use
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xlinkHref="#spinner"
            transform="rotate(40 50 50)"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              begin="0.1111111111111111s"
              repeatCount="indefinite"
            />
          </use>
          <use
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xlinkHref="#spinner"
            transform="rotate(80 50 50)"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              begin="0.2222222222222222s"
              repeatCount="indefinite"
            />
          </use>
          <use
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xlinkHref="#spinner"
            transform="rotate(120 50 50)"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              begin="0.3333333333333333s"
              repeatCount="indefinite"
            />
          </use>
          <use
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xlinkHref="#spinner"
            transform="rotate(160 50 50)"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              begin="0.4444444444444444s"
              repeatCount="indefinite"
            />
          </use>
          <use
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xlinkHref="#spinner"
            transform="rotate(200 50 50)"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              begin="0.5555555555555556s"
              repeatCount="indefinite"
            />
          </use>
          <use
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xlinkHref="#spinner"
            transform="rotate(240 50 50)"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              begin="0.6666666666666666s"
              repeatCount="indefinite"
            />
          </use>
          <use
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xlinkHref="#spinner"
            transform="rotate(280 50 50)"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              begin="0.7777777777777778s"
              repeatCount="indefinite"
            />
          </use>
          <use
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xlinkHref="#spinner"
            transform="rotate(320 50 50)"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="1s"
              begin="0.8888888888888888s"
              repeatCount="indefinite"
            />
          </use>
        </svg>
      </div>
      {text && (
        <p className="mt-2 text-sm text-muted-foreground text-center">{text}</p>
      )}
    </div>
  );

  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {loaderElement}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center p-4">
        {loaderElement}
      </div>
    );
  }

  return loaderElement;
};

// Page loader component
export const PageLoader: React.FC<{ text?: string }> = ({ text }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader size="xl" text={text || "Loading..."} />
  </div>
);

// Button loader component
export const ButtonLoader: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "sm",
}) => (
  <div className="flex items-center gap-2">
    <Loader size={size} className="text-current" />
    <span>Loading...</span>
  </div>
);

// Card loader component
export const CardLoader: React.FC = () => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
      </div>
    </div>
  </div>
);

// Table loader component
export const TableLoader: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="flex items-center space-x-4 p-4 border rounded-lg"
      >
        <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);
