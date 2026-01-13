import StateDeclarationWidget from "./StateDeclarationWidget";
import ReinforcementRequestsList from "./ReinforcementRequestsList";
import AdminDashboard from "./AdminDashboard";
import { useAuth } from "../../auth/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  // Admin RH gets a different dashboard
  if (user?.role === "ADMIN_RH") {
    return <AdminDashboard />;
  }

  // Collaborators and Managers get the standard dashboard
  return (
    <div className="space-y-12 mx-auto">
      {/* Top Section: State Declaration */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <StateDeclarationWidget />
        </div>
        <div className="lg:col-span-2 bg-neutral-900 rounded-2xl p-8 flex items-center justify-between text-white shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl font-bold mb-4 dm-sans-bold">
              Prêt à aider vos collègues ?
            </h2>
            <p className="text-neutral-300 text-lg">
              Maintenez votre état à jour pour recevoir des demandes de renfort
              pertinentes. La solidarité est la clé de notre succès.
            </p>
          </div>
          <div className="relative z-10 hidden sm:block">
            <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Requests & History (History to be added later) */}
      <section>
        <ReinforcementRequestsList />
      </section>
    </div>
  );
};

export default Dashboard;
