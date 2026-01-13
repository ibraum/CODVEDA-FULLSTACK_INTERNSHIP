import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  color?: "blue" | "green" | "red" | "orange" | "neutral";
  variant?: "default" | "border-left"; // default = text colored, border-left = as in AdminDashboard
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  subtext,
  icon,
  color = "neutral",
  variant = "border-left",
  className,
}: StatsCardProps) => {
  const colorStyles = {
    blue: {
      border: "border-l-blue-500",
      text: "text-blue-600",
      bg: "bg-blue-50",
    },
    green: {
      border: "border-l-green-500",
      text: "text-green-600",
      bg: "bg-green-50",
    },
    red: { border: "border-l-red-500", text: "text-red-600", bg: "bg-red-50" },
    orange: {
      border: "border-l-orange-500",
      text: "text-orange-600",
      bg: "bg-orange-50",
    },
    neutral: {
      border: "border-l-neutral-500",
      text: "text-neutral-900",
      bg: "bg-neutral-50",
    },
  };

  const styles = colorStyles[color];

  if (variant === "border-left") {
    return (
      <Card className={cn("border-l-4", styles.border, className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-600 flex items-center justify-between">
            {title}
            {icon && (
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center opacity-80",
                  styles.bg,
                  styles.text
                )}
              >
                {icon}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
            {value}
          </div>
          {subtext && (
            <p className="text-xs text-neutral-500 mt-1">{subtext}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Variant "default" (used in TeamsTab, ManageUsersTab overview)
  return (
    <div className={cn("bg-neutral-50 rounded-xl p-4 text-center", className)}>
      <div className={cn("text-3xl font-bold dm-sans-bold", styles.text)}>
        {value}
      </div>
      <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
        {title}
      </div>
      {subtext && (
        <div className="text-xs text-neutral-400 mt-1">{subtext}</div>
      )}
    </div>
  );
};
