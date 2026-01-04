const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-800 pb-5">
        <h1 className="text-3xl font-bold dm-sans-bold">Dashboard</h1>
        <p className="mt-2 text-neutral-400">
          Overview of your team's operational state.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
          <h3 className="font-semibold text-lg mb-2">Team Pulse</h3>
          <p className="text-neutral-400 text-sm">
            Real-time metrics will appear here.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
          <h3 className="font-semibold text-lg mb-2">Reliability Score</h3>
          <p className="text-neutral-400 text-sm">
            System stability indicators.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
          <h3 className="font-semibold text-lg mb-2">Recent Alerts</h3>
          <p className="text-neutral-400 text-sm">
            No new alerts in the last 24h.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
