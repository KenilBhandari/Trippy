import { ArrowUpDown } from "lucide-react";

type ReturnTripBadgeVariant = "responsive" | "compact" | "full";

type ReturnTripBadgeProps = {
  variant?: ReturnTripBadgeVariant;
  className?: string;
  label?: string;
};

const ReturnTripBadge = ({
  variant = "responsive",
  className = "",
  label = "Return",
}: ReturnTripBadgeProps) => {
  if (variant === "compact") {
    return (
      <div
        className={`inline-flex h-4 w-4 items-center justify-center border border-blue-600 bg-blue-600 text-white ${className}`}
        title="Return Trip"
      >
        <ArrowUpDown size={8} strokeWidth={3} />
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 border border-blue-200 bg-blue-50 px-2 py-[3px] text-blue-700 ${className}`}
        title="Return Trip"
      >
        <ArrowUpDown
          size={10}
          strokeWidth={2.6}
          className="text-blue-600"
        />
        <span className="text-[10px] font-semibold uppercase tracking-wide leading-[4px]">
          {label}
        </span>
      </div>
    );
  }

  return (
    <>
      {/* mobile */}
      <div
        className={`inline-flex h-4 w-4 items-center justify-center border border-blue-600 bg-blue-600 text-white sm:hidden ${className}`}
        title="Return Trip"
      >
        <ArrowUpDown size={8} strokeWidth={3} />
      </div>

      {/* desktop */}
      <div
        className={`hidden sm:inline-flex items-center gap-1.5 border border-blue-200 bg-blue-50 px-2 py-[3px] text-blue-700 ${className}`}
        title="Return Trip"
      >
        <ArrowUpDown
          size={10}
          strokeWidth={2.6}
          className="text-blue-600"
        />
        <span className="text-[10px] leading-[4px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
    </>
  );
};

export default ReturnTripBadge;