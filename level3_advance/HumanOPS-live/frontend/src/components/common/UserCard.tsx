import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { type UserWithHumanState } from "@/features/rh/services/rhService";
import { type ReactNode } from "react";

interface UserCardProps {
  user: UserWithHumanState;
  actions?: ReactNode;
  showStatus?: boolean;
  onClick?: () => void;
  className?: string;
}

export const UserCard = ({
  user,
  actions,
  showStatus = true,
  onClick,
  className,
}: UserCardProps) => {
  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
    user.email[0].toUpperCase();

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;

  const getRoleLabel = (role: string): string => {
    const map: Record<string, string> = {
      ADMIN_RH: "Admin RH",
      MANAGER: "Manager",
      COLLABORATOR: "Collaborateur",
    };
    return map[role] || role;
  };

  const getWorkloadColor = (workload: string): string => {
    const map: Record<string, string> = {
      LOW: "bg-green-100 text-green-800",
      NORMAL: "bg-blue-100 text-blue-800",
      HIGH: "bg-red-100 text-red-800",
    };
    return map[workload] || "bg-neutral-100 text-neutral-800";
  };

  const getAvailabilityColor = (availability: string): string => {
    const map: Record<string, string> = {
      AVAILABLE: "bg-green-100 text-green-800",
      MOBILISABLE: "bg-yellow-100 text-yellow-800",
      UNAVAILABLE: "bg-red-100 text-red-800",
    };
    return map[availability] || "bg-neutral-100 text-neutral-800";
  };

  const getWorkloadLabel = (workload: string): string => {
    const map: Record<string, string> = {
      LOW: "Faible",
      NORMAL: "Normal",
      HIGH: "Élevé",
    };
    return map[workload] || workload;
  };

  const getAvailabilityLabel = (availability: string): string => {
    const map: Record<string, string> = {
      AVAILABLE: "Disponible",
      MOBILISABLE: "Mobilisable",
      UNAVAILABLE: "Indisponible",
    };
    return map[availability] || availability;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-neutral-900 text-white font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-semibold text-neutral-900 truncate">
                {fullName}
              </h4>
              <p className="text-sm text-neutral-500 truncate">{user.email}</p>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 text-xs text-neutral-800"
            >
              {getRoleLabel(user.role)}
            </Badge>
          </div>

          {showStatus && user.humanState ? (
            <div className="flex items-center gap-2 mt-3">
              <Badge
                className={cn(
                  "text-xs hover:bg-opacity-80 transition-opacity",
                  getWorkloadColor(user.humanState.workload)
                )}
              >
                {getWorkloadLabel(user.humanState.workload)}
              </Badge>
              <Badge
                className={cn(
                  "text-xs hover:bg-opacity-80 transition-opacity",
                  getAvailabilityColor(user.humanState.availability)
                )}
              >
                {getAvailabilityLabel(user.humanState.availability)}
              </Badge>
            </div>
          ) : showStatus ? (
            <Badge variant="outline" className="text-xs text-neutral-500 mt-3">
              Aucun état déclaré
            </Badge>
          ) : null}

          {actions && <div className="mt-4">{actions}</div>}
        </div>
      </div>
    </div>
  );
};
