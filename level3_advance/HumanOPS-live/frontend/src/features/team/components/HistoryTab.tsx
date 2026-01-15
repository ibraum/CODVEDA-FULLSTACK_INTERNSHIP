import { useEffect, useState } from "react";
import { getStateHistory, type HumanStateHistory } from "../../team/services/teamService";
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const HistoryTab = () => {
  const [history, setHistory] = useState<HumanStateHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getStateHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getAvailabilityLabel = (availability: string | undefined | null) => {
    if (!availability) return "Unknown";
    switch (availability) {
      case "AVAILABLE":
        return "Available";
      case "MOBILISABLE":
        return "On Standby";
      case "UNAVAILABLE":
        return "Unavailable";
      default:
        return availability;
    }
  };

  const getWorkloadLabel = (workload: string | undefined | null) => {
    if (!workload) return "Unknown";
    switch (workload) {
      case "LOW":
        return "Low";
      case "NORMAL":
        return "Normal";
      case "HIGH":
        return "High";
      default:
        return workload;
    }
  };

  // Convert workload to numeric for chart
  const workloadToNumber = (workload: string) => {
    switch (workload) {
      case "LOW":
        return 1;
      case "NORMAL":
        return 2;
      case "HIGH":
        return 3;
      default:
        return 2;
    }
  };

  const chartData = history
    .map((h) => ({
      date: new Date(h.changedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      workload: workloadToNumber(h.workload),
    }))
    .reverse()
    .slice(0, 20); // Show more points

  // Stats
  const availableCount = history.filter(
    (h) => h.availability === "AVAILABLE"
  ).length;
  const highWorkloadCount = history.filter((h) => h.workload === "HIGH").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="relative z-10 w-full flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 dm-sans-bold">
              My History
            </h1>
            <p className="text-neutral-300">
              Track your state and workload changes
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors blur-xl z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Changes
                </p>
                <div className="text-4xl font-bold dm-sans-bold text-foreground mt-1">
                  {history.length}
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
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-green-500/10 group-hover:bg-green-500/20 transition-colors blur-xl z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Times Available
                </p>
                <div className="text-4xl font-bold dm-sans-bold text-foreground mt-1">
                  {availableCount}
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

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-[0_0_0_100%] bg-red-500/10 group-hover:bg-red-500/20 transition-colors blur-xl z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Overloads
                </p>
                <div className="text-4xl font-bold dm-sans-bold text-foreground mt-1">
                  {highWorkloadCount}
                </div>
              </div>
              <div className="h-10 w-10 bg-card rounded-full flex items-center justify-center border border-border shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-red-600"
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
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="border-border shadow-sm overflow-hidden bg-card">
          <CardHeader className="bg-muted/50 border-b border-border pb-4">
            <CardTitle className="text-lg font-bold dm-sans-bold text-foreground">
              Workload Evolution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    domain={[0, 4]}
                    ticks={[1, 2, 3]}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      if (value === 1) return "Low";
                      if (value === 2) return "Normal";
                      if (value === 3) return "High";
                      return "";
                    }}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      padding: "12px",
                      color: "var(--foreground)",
                    }}
                    cursor={{ stroke: "var(--muted)", strokeWidth: 2 }}
                    formatter={(value: number | undefined) => {
                      if (value === 1) return ["Low", "Workload"];
                      if (value === 2) return ["Normal", "Workload"];
                      if (value === 3) return ["High", "Workload"];
                      return [value ?? 0, "Workload"];
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="workload"
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

      {/* Timeline List */}
      <Card className="border-border shadow-sm overflow-hidden bg-card">
        <CardHeader className="bg-muted/50 border-b border-border pb-4">
          <CardTitle className="text-lg font-bold dm-sans-bold text-foreground">
            Detailed History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-neutral-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <p className="text-foreground font-medium mb-1">
                No history
              </p>
              <p className="text-muted-foreground text-sm">
                Your state changes will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center border-2 shrink-0 font-bold text-sm",
                      item.availability === "AVAILABLE" ? "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400" :
                        item.availability === "MOBILISABLE" ? "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30 text-orange-700 dark:text-orange-400" :
                          "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400"
                    )}>
                      {getAvailabilityLabel(item.availability).substring(0, 1) || "?"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{getAvailabilityLabel(item.availability)}</span>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className={cn("text-[.6rem] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full border",
                          item.workload === 'LOW' ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30" :
                            item.workload === 'NORMAL' ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/30" :
                              "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30"
                        )}>
                          Workload {getWorkloadLabel(item.workload).toLowerCase()}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        {new Date(item.changedAt).toLocaleDateString("en-US", {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  {index === 0 && (
                    <Badge variant="outline" className="bg-primary text-primary-foreground border-primary font-normal">
                      Current
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryTab;
