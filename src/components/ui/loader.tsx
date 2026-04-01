import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Loader({ className, size = "md" }: LoaderProps) {
  return (
    <Loader2
      className={cn(
        "animate-spin text-muted-foreground",
        sizeClasses[size],
        className,
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader size="lg" />
    </div>
  );
}
