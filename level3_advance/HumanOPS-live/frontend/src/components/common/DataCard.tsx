import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface DataCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export const DataCard = ({
  title,
  children,
  action,
  className,
  contentClassName,
}: DataCardProps) => {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-neutral-900">
          {title}
        </CardTitle>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className={cn("pt-0", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};
