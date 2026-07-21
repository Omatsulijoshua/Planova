"use client";

import React, { useState } from "react";

export default function Home() {
  const [solvedState, setSolvedState] = useState<"CONFLICTED" | "SOLVING" | "RESOLVED">("CONFLICTED");
  const [selectedPlan, setSelectedPlan] = useState<"student" | "premium">("premium");

  const startSolver = () => {
    setSolvedState("SOLVING");
    setTimeout(() => {
      setSolvedState("RESOLVED");
    }, 1800);
  };

  const resetSolver = () => {
    setSolvedState("CONFLICTED");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-900 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-lg text-white font-display shadow-lg shadow-indigo-500/20">
            P
          </div>
          <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Planova
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-zinc-100 transition-colors">Features</a>
          <a href="#demo" className="hover:text-zinc-100 transition-colors">Interactive Demo</a>
          <a href="#pricing" className="hover:text-zinc-100 transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Sign In
          </button>
          <button className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full shadow-lg shadow-indigo-600/30 transition-all active:scale-95">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-20 left-1/3 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-indigo-400 mb-8 animate-fade-in shadow-inner">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Introducing AI scheduling engine v2.0
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white mb-6 max-w-4xl leading-tight">
          Harmonize Your Calendar with{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-teal-400">
            Backtracking AI
          </span>
        </h1>

        <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
          The ultimate smart timetable coordinator. Automatically resolve calendar overlaps, organize student routines, and schedule group sessions dynamically.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
          <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95 text-center">
            Download Mobile App
          </button>
          <a
            href="#demo"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold rounded-full transition-all text-center"
          >
            Launch Interactive Demo
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold mb-4">Engineered for Academic Success</h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Planova integrates backend CSP heuristics, local alarms protection, and coordination gateways to maximize productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/80 transition-all flex flex-col">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-lg mb-2">CSP Heuristics Engine</h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
              Resolves schedule overlaps across 96 slots daily using Minimum Remaining Values (MRV) and Forward Checking search algorithms.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/80 transition-all flex flex-col">
            <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-lg mb-2">Two-Way Calendar Sync</h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
              Connect Google Calendar and Microsoft Outlook directly. Fetches events, updates tasks status, and exports Optimized slots.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/80 transition-all flex flex-col">
            <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-lg mb-2">Math Captcha Alarms</h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
              Enforces a strict 15 daily alarms limit and a 10 minutes separator constraint. Solve random mathematics to dismiss alarms.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/80 transition-all flex flex-col">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-lg mb-2">Real-Time Coordination</h3>
            <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
              Join study group rooms, share location coordinates, propose slot changes, and tally approvals dynamically via WebSockets.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Solver Demo */}
      <section id="demo" className="py-20 px-6 bg-zinc-900/20 border-t border-b border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-indigo-400 font-semibold text-xs tracking-wider uppercase">Interactive Experience</span>
            <h2 className="text-3xl font-display font-bold mt-2 mb-4">See the CSP Solver in Action</h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Simulate schedule conflicts and watch Planova resolve them instantly using MRV backtracking algorithms.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${
                solvedState === "CONFLICTED" ? "bg-red-500 animate-pulse" :
                solvedState === "SOLVING" ? "bg-amber-500 animate-pulse" : "bg-green-500"
              }`} />
              <span className="text-xs font-mono text-zinc-400">
                {solvedState === "CONFLICTED" ? "Status: Conflict Detected" :
                 solvedState === "SOLVING" ? "Status: Solving (Backtracking...)" : "Status: Optimal (0 Conflicts)"}
              </span>
            </div>

            <h3 className="font-display font-bold text-lg mb-6">Demo Timetable Grid</h3>

            {/* Timetable Items */}
            <div className="space-y-4 font-mono text-xs">
              {/* Event 1 */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-200">Study Machine Learning (Routine)</div>
                  <div className="text-zinc-500 text-[10px] mt-1">Time Range: 14:00 - 15:30 (90 mins)</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Routine</span>
              </div>

              {/* Event 2 */}
              <div className={`p-4 rounded-xl border transition-all duration-500 ${
                solvedState === "CONFLICTED" ? "border-red-500/30 bg-red-500/5 text-red-200" :
                solvedState === "SOLVING" ? "border-amber-500/30 bg-amber-500/5 text-amber-200" :
                "border-green-500/30 bg-green-500/5 text-green-200"
              } flex items-center justify-between`}>
                <div>
                  <div className="font-semibold">Submit Algebra Assignment (Task)</div>
                  <div className="text-[10px] opacity-60 mt-1">
                    {solvedState === "RESOLVED" ? "Resolved Time: 16:00 - 18:00 (120 mins)" : "Conflicting Time: 14:30 - 16:30 (120 mins)"}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded border font-semibold ${
                  solvedState === "CONFLICTED" ? "bg-red-500/10 border-red-500/30 text-red-400" :
                  solvedState === "SOLVING" ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                  "bg-green-500/10 border-green-500/30 text-green-400"
                }`}>
                  {solvedState === "CONFLICTED" ? "Conflict" :
                   solvedState === "SOLVING" ? "Pruning Domains" : "Resolved"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end gap-3">
              {solvedState === "RESOLVED" ? (
                <button
                  onClick={resetSolver}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-full transition-all"
                >
                  Reset Conflict
                </button>
              ) : (
                <button
                  disabled={solvedState === "SOLVING"}
                  onClick={startSolver}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-full shadow-lg shadow-indigo-600/30 transition-all"
                >
                  {solvedState === "SOLVING" ? "Solving..." : "Run AI Optimizer"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold mb-4">Flexible Subscriptions Built for Students</h2>
          <p className="text-zinc-400 max-w-sm mx-auto">
            Choose a plan that fits your calendar. All paid memberships start with a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1 */}
          <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-900 flex flex-col">
            <h3 className="font-display font-bold text-xl mb-2">Free Tier</h3>
            <p className="text-zinc-400 text-sm mb-6">Simple, conflict-free calendars.</p>
            <div className="text-3xl font-display font-black mb-8">$0.00 <span className="text-sm font-medium text-zinc-500">/ mo</span></div>
            <ul className="space-y-4 text-sm text-zinc-400 mb-8 flex-grow">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Basic AI scheduling solver
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> 1 Sync External Calendar
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> 5 daily alarm maximum
              </li>
            </ul>
            <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 font-semibold rounded-full transition-all">
              Sign Up Free
            </button>
          </div>

          {/* Plan 2 */}
          <div className={`p-8 rounded-2xl border flex flex-col relative ${
            selectedPlan === "student" ? "bg-zinc-900 border-indigo-500" : "bg-zinc-900/30 border-zinc-900"
          }`} onClick={() => setSelectedPlan("student")}>
            <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Discounted</span>
            <h3 className="font-display font-bold text-xl mb-2">Student Discount</h3>
            <p className="text-zinc-400 text-sm mb-6">For college & university students.</p>
            <div className="text-3xl font-display font-black mb-8">$2.99 <span className="text-sm font-medium text-zinc-500">/ mo</span></div>
            <ul className="space-y-4 text-sm text-zinc-400 mb-8 flex-grow">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Advanced Backtracking solver
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Multi-calendar connection sync
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Unlimited alarms & Math Captchas
              </li>
              <li className="flex items-center gap-2 text-indigo-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> 7-day payment renewal grace
              </li>
            </ul>
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full shadow-lg shadow-indigo-600/20 transition-all">
              Start 14-Day Trial
            </button>
          </div>

          {/* Plan 3 */}
          <div className={`p-8 rounded-2xl border flex flex-col relative ${
            selectedPlan === "premium" ? "bg-zinc-900 border-indigo-500" : "bg-zinc-900/30 border-zinc-900"
          }`} onClick={() => setSelectedPlan("premium")}>
            <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider">Popular</span>
            <h3 className="font-display font-bold text-xl mb-2">Premium Pro</h3>
            <p className="text-zinc-400 text-sm mb-6">Full feature access & group syncs.</p>
            <div className="text-3xl font-display font-black mb-8">$4.99 <span className="text-sm font-medium text-zinc-500">/ mo</span></div>
            <ul className="space-y-4 text-sm text-zinc-400 mb-8 flex-grow">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Premium AI heuristics engines
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Unlimited multi-calendar exports
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Real-time study group rooms
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> Live coordinate locations sharing
              </li>
            </ul>
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full shadow-lg shadow-indigo-600/20 transition-all">
              Start 14-Day Trial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-900 bg-zinc-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-sm text-white">
              P
            </div>
            <span className="font-display font-bold text-zinc-300">Planova</span>
          </div>
          <span className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Planova Inc. All rights reserved. Made by Advanced Agentic Coding team.
          </span>
          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
