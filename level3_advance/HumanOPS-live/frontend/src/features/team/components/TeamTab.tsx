import { useEffect, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import {
  getTeams,
  getTeamDetails,
  getTeamTensions,
  type Team,
  type TensionSnapshot,
  type TeamMemberWithState,
  type Manager,
} from "../services/teamService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const TeamTab = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [manager, setManager] = useState<Manager | null>(null);
  const [members, setMembers] = useState<TeamMemberWithState[]>([]);
  const [tensions, setTensions] = useState<TensionSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamData = async () => {
    try {
      setError(null);

      // Fetch all teams (accessible to all authenticated users)
      const teams = await getTeams();

      // Find user's team
      let userTeamId = user?.teamId;

      // Fallback: use first team if no teamId (legacy/dev behavior)
      if (!userTeamId && teams.length > 0) {
        userTeamId = teams[0].id;
      }

      if (!userTeamId) {
        setLoading(false);
        return;
      }

      // Fetch full team details
      const details = await getTeamDetails(userTeamId);

      setTeam(details.team);
      setManager(details.manager);
      setMembers(details.members);

      // Fetch tensions only for managers/admin
      if (["MANAGER", "ADMIN_RH"].includes(user?.role || "")) {
        const tensionHistory = await getTeamTensions(userTeamId);
        setTensions(tensionHistory);
      } else {
        setTensions([]);
      }

    } catch (err: any) {
      console.error("Failed to fetch team data", err);
      // Only show error if we don't have data
      if (!team) setError("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTeamData();

    const handleUpdate = () => {
      fetchTeamData();
    };

    window.addEventListener("tensionAlertUpdate", handleUpdate);
    return () => {
      window.removeEventListener("tensionAlertUpdate", handleUpdate);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-48" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!team) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 mx-auto text-muted-foreground mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
            <p className="text-neutral-500 font-medium">
              You are not assigned to any team
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = tensions
    .map((t) => ({
      time: new Date(t.calculatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      tension: getTensionValue(t.level),
    }))
    .reverse();

  const currentTension = tensions[0];

  // Helper functions
  function getTensionValue(level: string): number {
    const map: Record<string, number> = {
      LOW: 25,
      MODERATE: 50,
      HIGH: 75,
      CRITICAL: 95,
    };
    return map[level] || 0;
  }


  function getTensionLabel(level: string): string {
    const map: Record<string, string> = {
      LOW: "Low",
      MODERATE: "Moderate",
      HIGH: "High",
      CRITICAL: "Critical",
    };
    return map[level] || "Unknown";
  }

  // Calculate statistics
  const totalMembers = members.length;
  const availableMembers = members.filter(
    (m) => m.humanState?.availability === "AVAILABLE"
  ).length;
  const overloadedMembers = members.filter(
    (m) => m.humanState?.workload === "HIGH"
  ).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative z-10 w-full flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 dm-sans-bold">
              {team.name}
            </h1>
            <p className="text-neutral-300 flex items-center gap-2">
              <span className="opacity-70">Manager:</span>
              <span className="font-medium bg-white/10 px-2 py-0.5 rounded text-white">
                {manager
                  ? `${manager.firstName || ""} ${manager.lastName || ""}`.trim() || manager.email
                  : "Loading..."}
              </span>
            </p>
          </div>
          {currentTension && (
            <div className={cn("px-4 py-2 rounded-xl font-bold shadow-sm backdrop-blur-md border border-white/10",
              currentTension.level === "CRITICAL" ? "bg-red-500/20 text-red-100" :
                currentTension.level === "HIGH" ? "bg-orange-500/20 text-orange-100" :
                  "bg-green-500/20 text-green-100"
            )}>
              Tension: {getTensionLabel(currentTension.level)}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Members */}
        <div className="border border-border rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all bg-card">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-neutral-900/10 group-hover:bg-neutral-900/15 transition-colors blur-xl z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                  Members
                </p>
                <div className="text-4xl font-bold dm-sans-bold text-foreground mt-1">
                  {totalMembers}
                </div>
              </div>
              <div className="h-10 w-10 bg-card rounded-full flex items-center justify-center border border-border shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-neutral-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Available Members */}
        <div className="border border-border rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all bg-card">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-green-500/10 group-hover:bg-green-500/20 transition-colors blur-xl z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                  Available
                </p>
                <div className="text-4xl font-bold dm-sans-bold text-foreground mt-1">
                  {availableMembers}
                </div>
              </div>
              <div className="h-10 w-10 bg-card rounded-full flex items-center justify-center border border-border shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Overloaded Members (Manager Only) */}
        {["MANAGER", "ADMIN_RH"].includes(user?.role || "") ? (
          <div className="border border-border rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all bg-card">
            <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors blur-xl z-0"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                    Overloaded
                  </p>
                  <div className="text-4xl font-bold dm-sans-bold text-foreground mt-1">
                    {overloadedMembers}
                  </div>
                </div>
                <div className="h-10 w-10 bg-card rounded-full flex items-center justify-center border border-border shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 text-orange-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-neutral-200 rounded-2xl p-6 relative overflow-hidden bg-neutral-50 opacity-60">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
                  Overloaded
                </p>
                <div className="text-4xl font-bold dm-sans-bold text-neutral-300 mt-1">
                  -
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tension Chart */}
      {tensions.length > 0 && (
        <Card className="border-border shadow-sm overflow-hidden bg-card">
          <CardHeader className="bg-muted/50 border-b border-border pb-4">
            <CardTitle className="text-lg font-bold dm-sans-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-neutral-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
              Tension Evolution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="#737373"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#737373"
                    fontSize={12}
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      padding: "12px",
                    }}
                    cursor={{ stroke: "#e5e5e5", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tension"
                    stroke="#f97316"
                    strokeWidth={4}
                    dot={{ fill: "#f97316", r: 4, stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#ea580c" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card className="border-border shadow-sm overflow-hidden bg-card">
        <CardHeader className="bg-muted/50 border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold dm-sans-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-neutral-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              Team Members
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {members.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 mx-auto mb-3 text-muted-foreground"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              <p className="font-medium mb-1">Restricted Information</p>
              <p className="text-sm">
                Member details and team statistics are only accessible to managers and RH administrators.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[80px] pl-6">ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">Availability</TableHead>
                  {["MANAGER", "ADMIN_RH"].includes(user?.role || "") && (
                    <TableHead className="text-center">Workload</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, i) => {
                  const initials =
                    `${member.firstName?.[0] || ""}${member.lastName?.[0] || ""
                      }`.toUpperCase() || member.email[0].toUpperCase();

                  return (
                    <TableRow key={member.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="pl-6 text-muted-foreground font-mono text-xs">#{i + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border">
                            <AvatarFallback className="text-xs bg-muted text-foreground font-medium">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium text-foreground">
                            {member.lastName ? member.lastName : "---"} {member.firstName ? member.firstName : "---"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-500 text-sm">
                        {member.email}
                      </TableCell>
                      <TableCell className="text-neutral-500 text-sm">
                        <span className="capitalize bg-neutral-100 px-2 py-1 rounded text-neutral-700 text-xs font-medium">
                          {member.role.toLowerCase().replace('_', ' ')}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        {member.humanState ? (
                          <Badge
                            variant="outline"
                            className={cn("font-medium border-0",
                              member.humanState.availability === "AVAILABLE" ? "bg-green-100 text-green-700" :
                                member.humanState.availability === "MOBILISABLE" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                            )}
                          >
                            {member.humanState.availability === "AVAILABLE" ? "Available" :
                              member.humanState.availability === "MOBILISABLE" ? "On Standby" : "Unavailable"}
                          </Badge>
                        ) : "-"}
                      </TableCell>
                      {["MANAGER", "ADMIN_RH"].includes(user?.role || "") && (
                        <TableCell className="text-center">
                          {member.humanState ? (
                            <Badge
                              variant="outline"
                              className={cn("font-medium border-0",
                                member.humanState.workload === "LOW" ? "bg-green-100 text-green-800" :
                                  member.humanState.workload === "NORMAL" ? "bg-blue-100 text-blue-800" :
                                    "bg-red-100 text-red-800"
                              )}
                            >
                              {member.humanState.workload}
                            </Badge>
                          ) : "-"}
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div >
  );
};

export default TeamTab;
