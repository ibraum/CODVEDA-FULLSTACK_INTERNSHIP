import { useEffect, useState } from "react";
import { getTeams, getTeamTensions } from "../../team/services/teamService";
import type { Team, TensionSnapshot } from "../../team/services/teamService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TeamTab = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [tensions, setTensions] = useState<TensionSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const teams = await getTeams();
        // Find user's team (assuming user is in one team)
        const userTeam = teams[0]; // Simplified - in reality, filter by user membership
        setTeam(userTeam);

        if (userTeam) {
          const tensionData = await getTeamTensions(userTeam.id, 10);
          setTensions(tensionData);
        }
      } catch (error) {
        console.error("Failed to fetch team data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (!team) {
    return (
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
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
        <p className="text-neutral-500 font-medium">
          Vous n'êtes assigné à aucune équipe
        </p>
      </div>
    );
  }

  const chartData = tensions
    .map((t) => ({
      time: new Date(t.timestamp).toLocaleDateString("fr-FR", {
        month: "short",
        day: "numeric",
      }),
      tension: t.level,
    }))
    .reverse();

  const currentTension = tensions[0]?.level || 0;
  const getTensionColor = (level: number) => {
    if (level < 30) return "text-green-600 bg-green-50";
    if (level < 70) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getTensionLabel = (level: number) => {
    if (level < 30) return "Faible";
    if (level < 70) return "Modérée";
    return "Élevée";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Team Header */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold dm-sans-bold text-neutral-900">
              {team.name}
            </h3>
            <p className="text-neutral-500 text-sm mt-1">
              Équipe collaborative
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-full ${getTensionColor(
              currentTension
            )}`}
          >
            <span className="text-sm font-bold">
              Tension: {getTensionLabel(currentTension)}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-neutral-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
              5
            </div>
            <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
              Membres
            </div>
          </div>
          <div className="bg-neutral-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
              {currentTension}%
            </div>
            <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
              Tension
            </div>
          </div>
          <div className="bg-neutral-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold dm-sans-bold text-neutral-900">
              12
            </div>
            <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
              Projets
            </div>
          </div>
        </div>
      </div>

      {/* Tension Chart */}
      {tensions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
          <h4 className="text-lg font-bold dm-sans-bold text-neutral-900 mb-4">
            Évolution de la tension
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="time" stroke="#737373" fontSize={12} />
              <YAxis stroke="#737373" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="tension"
                stroke="#171717"
                strokeWidth={2}
                dot={{ fill: "#171717", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Team Members */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm">
        <h4 className="text-lg font-bold dm-sans-bold text-neutral-900 mb-4">
          Membres de l'équipe
        </h4>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-neutral-900 flex items-center justify-center text-white font-bold">
                {String.fromCharCode(65 + index)}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-neutral-900">
                  Membre {index + 1}
                </div>
                <div className="text-xs text-neutral-500">Collaborateur</div>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamTab;
