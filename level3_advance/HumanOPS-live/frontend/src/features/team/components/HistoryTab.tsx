import { useEffect, useState } from "react";
import { getStateHistory } from "../../team/services/teamService";
import type { HumanStateHistory } from "../../team/services/teamService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const HistoryTab = () => {
  const [history, setHistory] = useState<HumanStateHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getStateHistory(20);
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch state history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "AVAILABLE":
        return "bg-green-500";
      case "MOBILISABLE":
        return "bg-orange-500";
      case "UNAVAILABLE":
        return "bg-red-500";
      default:
        return "bg-neutral-500";
    }
  };

  const getAvailabilityLabel = (availability: string) => {
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

  const getWorkloadLabel = (workload: string) => {
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
      date: new Date(h.updatedAt).toLocaleDateString("fr-FR", {
        month: "short",
        day: "numeric",
      }),
      workload: workloadToNumber(h.workload),
    }))
    .reverse()
    .slice(0, 10);

  // Stats
  const availableCount = history.filter(
    (h) => h.availability === "AVAILABLE"
  ).length;
  const highWorkloadCount = history.filter((h) => h.workload === "HIGH").length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm text-center">
          <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
            {history.length}
          </div>
          <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
            Changements
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm text-center">
          <div className="text-3xl font-bold dm-sans-bold text-green-600">
            {availableCount}
          </div>
          <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
            Disponible
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm text-center">
          <div className="text-3xl font-bold dm-sans-bold text-red-600">
            {highWorkloadCount}
          </div>
          <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
            Charge haute
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
          <h4 className="text-lg font-bold dm-sans-bold text-neutral-900 mb-4">
            Évolution de la charge de travail
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="date" stroke="#737373" fontSize={12} />
              <YAxis
                stroke="#737373"
                fontSize={12}
                domain={[0, 4]}
                ticks={[1, 2, 3]}
                tickFormatter={(value) => {
                  if (value === 1) return "Faible";
                  if (value === 2) return "Normal";
                  if (value === 3) return "Élevé";
                  return "";
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
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
                stroke="#171717"
                strokeWidth={2}
                dot={{ fill: "#171717", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
        <h4 className="text-lg font-bold dm-sans-bold text-neutral-900 mb-6">
          Historique d'état
        </h4>
        {history.length === 0 ? (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 mx-auto text-neutral-300 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <p className="text-neutral-500 font-medium">
              Aucun historique disponible
            </p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
            {history.slice(0, 10).map((item, index) => (
              <div
                key={item.id}
                className="relative flex items-center justify-between group"
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow shrink-0 ${
                    index === 0 ? "bg-neutral-900" : "bg-neutral-100"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${getAvailabilityColor(
                      item.availability
                    )}`}
                  ></div>
                </div>
                <div className="w-[calc(100%-4rem)] p-4 rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between space-x-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900">
                        {getAvailabilityLabel(item.availability)}
                      </span>
                      <span className="text-neutral-400">•</span>
                      <span className="text-neutral-600 text-sm">
                        Charge: {getWorkloadLabel(item.workload)}
                      </span>
                    </div>
                    <time className="text-neutral-500 text-sm">
                      {new Date(item.updatedAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  {index === 0 && (
                    <div className="text-xs text-neutral-500 mt-1">
                      État actuel
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTab;
