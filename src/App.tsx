import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, Zap, Bot, Gauge, Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";

import SheetSimulator from "@/components/SheetSimulator";
import SheetsConnector from "@/components/SheetsConnector";
import EngineControls from "@/components/EngineControls";

const NAV_ITEMS = [
  { id: "spreadsheet", label: "Data", icon: "Table2" },
  { id: "connector", label: "Sheets", icon: "FileSpreadsheet" },
  { id: "engine", label: "Engine", icon: "Zap" },
];

function App() {
  const [activeTab, setActiveTab] = useState("engine");

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.16 0.015 260)",
            border: "1px solid oklch(0.27 0.01 260)",
            color: "oklch(0.93 0.01 260)",
          },
        }}
      />

      {/* Scan line overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.03]">
        <div className="absolute inset-x-0 h-px bg-white animate-scan-sweep" />
      </div>

      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 size-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 size-64 rounded-full bg-cyan-500/3 blur-3xl" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center">
                  <Radar className="size-4 text-emerald-400" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 animate-radar-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold tracking-tight">
                  GigMatch
                </h1>
                <p className="text-[10px] text-muted-foreground leading-none -mt-0.5">
                  Matchmaker Automation
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTab === item.id
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                  }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-md border border-emerald-500/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Status */}
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] px-2 py-0.5 h-6 gap-1.5"
              >
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                System Online
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "spreadsheet" && (
            <motion.div
              key="spreadsheet"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <SheetSimulator />
            </motion.div>
          )}

          {activeTab === "connector" && (
            <motion.div
              key="connector"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="max-w-2xl mx-auto"
            >
              <SheetsConnector />
            </motion.div>
          )}

          {activeTab === "engine" && (
            <motion.div
              key="engine"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* 2-column grid for engine view */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <EngineControls />
                </div>
                <div className="space-y-6">
                  <SheetSimulator />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <Radar className="size-3" />
              <span>GigMatch Matchmaker Automation · v1.0.0</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Powered by AI categorization engine</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">Simulated environment</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;