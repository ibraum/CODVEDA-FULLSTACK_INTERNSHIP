import { useEffect, useState } from "react";
import { getReinforcementRequests } from "../../team/services/teamService";
import type { ReinforcementRequest } from "../../team/services/teamService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RequestsTab = () => {
  const [requests, setRequests] = useState<ReinforcementRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getReinforcementRequests();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch reinforcement requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  const getUrgencyColor = (level: number) => {
    if (level <= 3) return "bg-blue-100 text-blue-700";
    if (level <= 7) return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  const getUrgencyLabel = (level: number) => {
    if (level <= 3) return "Faible";
    if (level <= 7) return "Moyenne";
    return "Urgente";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-700";
      case "CLOSED":
        return "bg-neutral-100 text-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const chartData = [
    {
      name: "Ouvertes",
      count: requests.filter((r) => r.status === "OPEN").length,
    },
    {
      name: "Fermées",
      count: requests.filter((r) => r.status === "CLOSED").length,
    },
    {
      name: "Urgentes",
      count: requests.filter((r) => r.urgencyLevel > 7).length,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm text-center">
          <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
            {requests.length}
          </div>
          <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
            Total
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm text-center">
          <div className="text-3xl font-bold dm-sans-bold text-green-600">
            {requests.filter((r) => r.status === "OPEN").length}
          </div>
          <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
            Ouvertes
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm text-center">
          <div className="text-3xl font-bold dm-sans-bold text-red-600">
            {requests.filter((r) => r.urgencyLevel > 7).length}
          </div>
          <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
            Urgentes
          </div>
        </div>
      </div>

      {/* Chart */}
      {requests.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
          <h4 className="text-lg font-bold dm-sans-bold text-neutral-900 mb-4">
            Statistiques des demandes
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="name" stroke="#737373" fontSize={12} />
              <YAxis stroke="#737373" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#171717" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Requests List */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
        <h4 className="text-lg font-bold dm-sans-bold text-neutral-900 mb-4">
          Demandes de renfort
        </h4>
        {requests.length === 0 ? (
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
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
            <p className="text-neutral-500 font-medium">
              Aucune demande en cours
            </p>
            <p className="text-neutral-400 text-sm mt-1">
              Les demandes de renfort apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(
                          request.urgencyLevel
                        )}`}
                      >
                        {getUrgencyLabel(request.urgencyLevel)}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Niveau d'urgence:{" "}
                      <span className="font-bold">
                        {request.urgencyLevel}/10
                      </span>
                    </p>
                  </div>
                  <div className="text-right text-xs text-neutral-500">
                    <div>
                      Créée le{" "}
                      {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                    <div className="mt-1">
                      Expire le{" "}
                      {new Date(request.expiresAt).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>
                {Object.keys(request.requiredSkills).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-neutral-100">
                    <span className="text-xs text-neutral-500 font-semibold">
                      Compétences:
                    </span>
                    {Object.keys(request.requiredSkills).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsTab;
