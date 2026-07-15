import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  Zap,
  Bot,
  Play,
  Pause,
  Settings,
  Gauge,
  Terminal,
  Sparkles,
  BrainCircuit,
  SlidersHorizontal,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

const INITIAL_LOGS: LogEntry[] = [
  { id: "l1", timestamp: "14:23:01", message: "Engine initialized — idle mode", type: "info" },
  { id: "l2", timestamp: "14:23:05", message: "Connected to data source (simulated)", type: "success" },
  { id: "l3", timestamp: "14:23:12", message: "8 rows loaded — awaiting categorization", type: "info" },
];

export default function EngineControls() {
  const [engineRunning, setEngineRunning] = useState(false);
  const [aiBoost, setAiBoost] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState([75]);
  const [autoApprove, setAutoApprove] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string, type: LogEntry["type"] = "info") => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    setLogs((prev) => [
      ...prev,
      { id: `log_${Date.now()}`, timestamp, message, type },
    ]);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleToggleEngine = useCallback(() => {
    if (engineRunning) {
      setEngineRunning(false);
      addLog("Engine paused — state preserved", "warning");
      toast("Engine paused");
    } else {
      setEngineRunning(true);
      addLog("Engine started — processing requests", "success");
      toast.success("Engine started");
      simulateProcessing();
    }
  }, [engineRunning]);

  const simulateProcessing = useCallback(() => {
    setProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5 + Math.floor(Math.random() * 10);
        if (next >= 100) {
          clearInterval(interval);
          setProcessing(false);
          addLog("Batch complete — 8/8 rows categorized", "success");
          setEngineRunning(false);
          return 100;
        }
        return next;
      });
    }, 300);
  }, []);

  const handleRunOnce = useCallback(() => {
    addLog("Running single categorization pass...", "info");
    setProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10 + Math.floor(Math.random() * 15);
        if (next >= 100) {
          clearInterval(interval);
          setProcessing(false);
          addLog("Single pass complete — 8 rows categorized", "success");
          toast.success("Categorization complete");
          return 100;
        }
        return next;
      });
    }, 200);
  }, []);

  const handleClearLogs = useCallback(() => {
    setLogs([]);
    addLog("Console cleared", "info");
  }, []);

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-emerald-500/5">
      <CardHeader className="border-b border-border/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Radar className="size-5 text-emerald-400" />
              </div>
              {engineRunning && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-400"
                >
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
                </motion.span>
              )}
            </div>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">
                Matchmaking Engine
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                AI-powered trade categorization
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-[10px] px-2 py-0.5 h-5 ${
                engineRunning
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {engineRunning ? "● Running" : "○ Idle"}
            </Badge>
            <Button
              size="icon-sm"
              variant="ghost"
              className="size-7 text-muted-foreground"
            >
              <Settings className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Engine Controls Row */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className={`h-9 text-xs gap-1.5 px-4 ${
              engineRunning
                ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30"
                : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
            }`}
            onClick={handleToggleEngine}
            disabled={processing}
          >
            {engineRunning ? (
              <>
                <Pause className="size-3.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="size-3.5" />
                Start Engine
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-9 text-xs gap-1.5 border-border/50"
            onClick={handleRunOnce}
            disabled={processing}
          >
            <Zap className="size-3.5" />
            Run Once
          </Button>

          <div className="flex-1" />

          {/* Progress bar */}
          {processing && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 160, opacity: 1 }}
              className="h-2 rounded-full bg-muted overflow-hidden"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
        </div>

        <Separator className="bg-border/20" />

        {/* Settings Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-3 p-3 rounded-lg bg-background/40 border border-border/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="size-3.5 text-indigo-400" />
                <span className="text-xs font-medium">AI Boost</span>
              </div>
              <Switch
                checked={aiBoost}
                onCheckedChange={(val) => {
                  setAiBoost(val);
                  addLog(val ? "AI Boost enabled — GPT-4o fallback active" : "AI Boost disabled — local matching only", "info");
                  toast(val ? "AI Boost enabled" : "AI Boost disabled");
                }}
                className="data-[state=checked]:bg-indigo-500"
              />
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Uses GPT-4o for ambiguous descriptions that scored below threshold.
            </p>
          </div>

          <div className="space-y-3 p-3 rounded-lg bg-background/40 border border-border/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="size-3.5 text-emerald-400" />
                <span className="text-xs font-medium">Confidence Threshold</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">{confidenceThreshold[0]}%</span>
            </div>
            <Slider
              value={confidenceThreshold}
              onValueChange={setConfidenceThreshold}
              min={50}
              max={100}
              step={5}
              className="[&_[data-slot=slider-range]]:bg-emerald-500"
            />
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Auto-categorize only when confidence ≥ {confidenceThreshold[0]}%. Below threshold → AI Boost.
            </p>
          </div>
        </div>

        {/* Auto-approve toggle */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-background/40 border border-border/20">
          <div className="flex items-center gap-2 flex-1">
            <Sparkles className="size-3.5 text-emerald-400" />
            <span className="text-xs font-medium">Auto-Approve Verified</span>
          </div>
          <Switch
            checked={autoApprove}
            onCheckedChange={(val) => {
              setAutoApprove(val);
              addLog(val ? "Auto-approve enabled" : "Auto-approve disabled", "info");
            }}
            className="data-[state=checked]:bg-emerald-500"
          />
          <span className="text-[10px] text-muted-foreground">
            Automatically approve high-confidence matches
          </span>
        </div>

        <Separator className="bg-border/20" />

        {/* Activity Log */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Terminal className="size-3.5 text-muted-foreground" />
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Engine Log
              </span>
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              className="size-6 text-muted-foreground hover:text-foreground"
              onClick={handleClearLogs}
            >
              <Activity className="size-3" />
            </Button>
          </div>
          <ScrollArea className="h-[140px]">
            <div className="space-y-0.5 font-mono">
              <AnimatePresence initial={false}>
                {logs.slice(-30).map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2 text-[11px] py-0.5 px-1 rounded ${
                      log.type === "success"
                        ? "text-emerald-400"
                        : log.type === "warning"
                          ? "text-amber-400"
                          : log.type === "error"
                            ? "text-red-400"
                            : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-[10px] text-muted-foreground/50 w-14 shrink-0">
                      {log.timestamp}
                    </span>
                    <span className="truncate">{log.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={logEndRef} />
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}