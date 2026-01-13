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

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800 border-green-200";
      case "MOBILISABLE":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "UNAVAILABLE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  const getAvailabilityLabel = (availability: string | undefined | null) => {
    if (!availability) return "Inconnu";
    switch (availability) {
      case "AVAILABLE":
        return "Disponible";
      case "MOBILISABLE":
        return "Mobilisable";
      case "UNAVAILABLE":
        return "Indisponible";
      default:
        return availability;
    }
  };

  const getWorkloadLabel = (workload: string | undefined | null) => {
    if (!workload) return "Inconnue";
    switch (workload) {
      case "LOW":
        return "Faible";
      case "NORMAL":
        return "Normale";
      case "HIGH":
        return "Élevée";
      default:
        return workload;
    }
  };

  const getWorkloadColor = (workload: string | undefined | null) => {
    switch (workload) {
      case "LOW":
        return "text-green-600 bg-green-50 border border-green-400 rounded-full px-1";
      case "NORMAL":
        return "text-blue-600  bg-blue-50 border border-blue-400 rounded-full px-1";
      case "HIGH":
        return "text-red-600  bg-red-50 border border-red-400 rounded-full px-1";
      default:
        return "text-neutral-600  bg-neutral-50 border border-neutral-400 rounded-full px-1";
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
      date: new Date(h.changedAt).toLocaleDateString("fr-FR", {
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header & Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mon Historique</CardTitle>
          <p className="text-neutral-500 text-sm mt-1">
            Suivi de vos changements d'état et de charge de travail
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-100 rounded-2xl p-4 text-center relative overflow-hidden group hover:shadow-inner transition-all">
              <div className="absolute top-0 right-0 h-16 w-16 rounded-[0_0_0_100%] bg-orange-500 blur-xl z-0"></div>
              <div className="absolute top-2 right-2 h-15 w-15 border border-neutral-100 bg-white rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
                  {history.length}
                </div>
                <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-medium">
                  Changements
                </div>
              </div>
            </div>

            <div className="bg-neutral-100 rounded-2xl p-4 text-center relative overflow-hidden group hover:shadow-inner transition-all">
              <div className="absolute top-0 right-0 h-16 w-16 rounded-[0_0_0_100%] bg-green-500 blur-xl z-0"></div>
              <div className="absolute top-2 right-2 h-15 w-15 border border-neutral-100 bg-white rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="text-3xl font-bold dm-sans-bold text-green-700">
                  {availableCount}
                </div>
                <div className="text-xs text-green-600/80 mt-1 uppercase tracking-wider font-medium">
                  Fois Disponible
                </div>
              </div>
            </div>

            <div className="bg-neutral-100 rounded-2xl p-4 text-center relative overflow-hidden group hover:shadow-inner transition-all">
              <div className="absolute top-0 right-0 h-16 w-16 rounded-[0_0_0_100%] bg-red-500 blur-xl z-0"></div>
              <div className="absolute top-2 right-2 h-15 w-15 border border-neutral-100 bg-white rounded-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div className="relative z-10">
                <div className="text-3xl font-bold dm-sans-bold text-red-700">
                  {highWorkloadCount}
                </div>
                <div className="text-xs text-red-600/80 mt-1 uppercase tracking-wider font-medium">
                  Alertes Surcharge
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Évolution de la charge de travail</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#737373"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#737373"
                  fontSize={12}
                  domain={[0, 4]}
                  ticks={[1, 2, 3]}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    if (value === 1) return "Faible";
                    if (value === 2) return "Normal";
                    if (value === 3) return "Élevé";
                    return "";
                  }}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                  }}
                  formatter={(value: number | undefined) => {
                    if (value === 1) return ["Faible", "Charge"];
                    if (value === 2) return ["Normale", "Charge"];
                    if (value === 3) return ["Élevée", "Charge"];
                    return [value ?? 0, "Charge"];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="workload"
                  stroke="#ff6600ff"
                  strokeWidth={5}
                  dot={{ fill: "#171717", r: 6, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Timeline List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historique détaillé</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
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
              <p className="text-neutral-900 font-medium mb-1">
                Aucun historique
              </p>
              <p className="text-neutral-500 text-sm">
                Vos changements d'état apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center border-2 shrink-0 font-bold text-sm",
                      item.availability === "AVAILABLE" ? "bg-green-50 border-green-100 text-green-700" :
                        item.availability === "MOBILISABLE" ? "bg-orange-50 border-orange-100 text-orange-700" :
                          "bg-red-50 border-red-100 text-red-700"
                    )}>
                      {getAvailabilityLabel(item.availability).substring(0, 1) || "?"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900">{getAvailabilityLabel(item.availability)}</span>
                        <span className="text-neutral-300 text-xs">•</span>
                        <span className={cn("text-[.6rem] font-medium", getWorkloadColor(item.workload))}>
                          Charge {getWorkloadLabel(item.workload).toLowerCase()}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {new Date(item.changedAt).toLocaleDateString("fr-FR", {
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
                    <Badge variant="outline" className="bg-neutral-50 text-neutral-600 border-neutral-200">
                      Actuel
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
