"use client";

import React, { useState } from "react";

export default function Home() {
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [aiPlannerV2, setAiPlannerV2] = useState<boolean>(true);
  const [userCount, setUserCount] = useState<number>(1280);
  const [logsSearch, setLogsSearch] = useState<string>("");

  // Subscriptions Mock Editing
  const [plans, setPlans] = useState([
    { id: "free", name: "Free Tier", price: 0.0 },
    { id: "student", name: "Student Discount", price: 2.99 },
    { id: "premium", name: "Premium Pro", price: 4.99 },
  ]);

  const [systemLogs] = useState([
    { time: "16:45:12", user: "john.doe@student.com", action: "auth:login", status: "SUCCESS" },
    { time: "16:44:54", user: "jane.smith@student.com", action: "timetable:optimize", status: "SUCCESS" },
    { time: "16:40:02", user: "john.doe@student.com", action: "preferences:update", status: "SUCCESS" },
    { time: "16:35:10", user: "system:daemon", action: "calendar:sync", status: "WARNING" },
  ]);

  const simulateSignUp = () => {
    setUserCount((c) => c + 1);
  };

  const handlePriceChange = (id: string, newPrice: string) => {
    const val = parseFloat(newPrice) || 0.0;
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, price: val } : p)));
  };

  const filteredLogs = systemLogs.filter((log) => {
    const term = logsSearch.toLowerCase();
    return (
      log.action.toLowerCase().includes(term) ||
      log.user.toLowerCase().includes(term) ||
      log.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-red-500 flex items-center justify-center font-bold text-lg text-white font-display shadow-lg shadow-red-500/20">
            A
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">
            Planova Admin
          </span>
          <span className="px-2 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700 rounded">
            v2.0.1
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="text-xs font-mono text-zinc-400">System Status: Online</span>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Maintenance Banner */}
        {maintenanceMode && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-200 text-sm flex items-center gap-3">
            <svg className="h-5 w-5 text-red-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span className="font-bold">Maintenance Mode Active:</span> All user-facing APIs are currently rejecting non-admin requests with 503 Service Unavailable.
            </div>
          </div>
        )}

        {/* 1. Stat cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-900 flex flex-col justify-between">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Active Students</span>
            <div className="flex items-baseline justify-between mt-4">
              <span className="text-3xl font-display font-bold">{userCount}</span>
              <button
                onClick={simulateSignUp}
                className="text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20 font-mono transition-colors"
              >
                + Simulate Join
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-900 flex flex-col justify-between">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Monthly Revenue</span>
            <div className="mt-4">
              <span className="text-3xl font-display font-bold">
                ${(plans[1].price * 400 + plans[2].price * 520).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-900 flex flex-col justify-between">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Feature Flags Active</span>
            <div className="mt-4">
              <span className="text-3xl font-display font-bold">{aiPlannerV2 ? "1 / 1" : "0 / 1"}</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-900 flex flex-col justify-between">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Optimal Resolutions</span>
            <div className="mt-4">
              <span className="text-3xl font-display font-bold">420 today</span>
            </div>
          </div>
        </section>

        {/* 2. System Controls & Plans Configuration */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Control Settings */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-900">
            <h2 className="font-display font-bold text-lg mb-6">Interactive Control Center</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Maintenance Mode Toggle</div>
                  <div className="text-xs text-zinc-500 mt-1">Block incoming student endpoint activities</div>
                </div>
                <button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${
                    maintenanceMode ? "bg-red-500" : "bg-zinc-800"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-all transform ${
                      maintenanceMode ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
                <div>
                  <div className="text-sm font-semibold">Enable AI Planner v2 Flag</div>
                  <div className="text-xs text-zinc-500 mt-1">Activate enhanced backtracking solver heuristics</div>
                </div>
                <button
                  onClick={() => setAiPlannerV2(!aiPlannerV2)}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${
                    aiPlannerV2 ? "bg-indigo-500" : "bg-zinc-800"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-all transform ${
                      aiPlannerV2 ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Configurator */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-900">
            <h2 className="font-display font-bold text-lg mb-6">Subscriptions Packages Manager</h2>
            <div className="space-y-4">
              {plans.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="text-sm font-semibold">{plan.name}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">ID: {plan.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-400 font-mono">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={plan.price}
                      onChange={(e) => handlePriceChange(plan.id, e.target.value)}
                      className="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-right font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-xs text-zinc-500">/ mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. System Logs Stream */}
        <section className="p-6 rounded-2xl bg-zinc-900 border border-zinc-900">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="font-display font-bold text-lg">System Logs Audit Stream</h2>
            <input
              type="text"
              placeholder="Search logs (e.g. auth, system)..."
              value={logsSearch}
              onChange={(e) => setLogsSearch(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-full px-4 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 w-full sm:max-w-xs"
            />
          </div>

          <div className="rounded-xl border border-zinc-850 bg-zinc-950 p-4 font-mono text-xs space-y-3 max-h-60 overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-zinc-600 text-center py-4">No audit logs match filters.</div>
            ) : (
              filteredLogs.map((log, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-600">[{log.time}]</span>
                    <span className="text-indigo-400">{log.action}</span>
                    <span className="text-zinc-400">({log.user})</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 sm:mt-0 ${
                    log.status === "SUCCESS" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                    "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 px-6 text-center text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} Planova Administrative Console. Verified production ready settings.
      </footer>
    </div>
  );
}
