import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSpreadsheet, ExternalLink, Copy, Check, Info, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface SheetsConnection {
  id: string;
  name: string;
  url: string;
  lastSync: string;
  rowCount: number;
}

export default function SheetsConnector() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const mockConnection: SheetsConnection = {
    id: "sheet_1",
    name: "GigMatch Requests - May 2025",
    url: "https://docs.google.com/spreadsheets/d/abc123",
    lastSync: "2 minutes ago",
    rowCount: 147,
  };

  const handleConnect = async () => {
    if (!sheetUrl.trim()) {
      toast.error("Please enter a Google Sheets URL");
      return;
    }
    setConnecting(true);
    // Simulate OAuth connection
    await new Promise((r) => setTimeout(r, 1500));
    setConnected(true);
    setConnecting(false);
    toast.success("Google Sheets connected successfully");
  };

  const handleDisconnect = () => {
    setConnected(false);
    setSheetUrl("");
    toast.success("Sheet disconnected");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mockConnection.url);
    setCopied(true);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-indigo-500/5">
      <CardHeader className="border-b border-border/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <FileSpreadsheet className="size-5 text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">
                Google Sheets Connector
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Link your spreadsheet for real-time data sync
              </CardDescription>
            </div>
          </div>
          {connected && (
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[11px] px-2 py-1">
              <span className="size-1.5 rounded-full bg-emerald-400 mr-1.5 inline-block animate-pulse" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <AnimatePresence mode="wait">
          {!connected ? (
            <motion.div
              key="disconnected"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="relative">
                <FileSpreadsheet className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Paste Google Sheets URL..."
                  className="h-9 pl-8 text-xs bg-background/50 border-border/50"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                />
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                <Info className="size-3.5 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Your sheet should have columns for <strong className="text-foreground">Description</strong>,{" "}
                  <strong className="text-foreground">Category</strong>, and{" "}
                  <strong className="text-foreground">Status</strong>. We use OAuth 2.0 — your data never leaves your control.
                </p>
              </div>
              <Button
                className="w-full h-9 text-xs gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30"
                onClick={handleConnect}
                disabled={connecting}
              >
                {connecting ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="size-3.5" />
                    Connect to Google Sheets
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <div className="size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <FileSpreadsheet className="size-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {mockConnection.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {mockConnection.rowCount} rows · Last sync {mockConnection.lastSync}
                  </p>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="size-8 text-muted-foreground hover:text-foreground"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-background/50 border border-border/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    Sync Interval
                  </p>
                  <p className="text-sm font-medium mt-0.5">Every 30s</p>
                </div>
                <div className="p-2 rounded-lg bg-background/50 border border-border/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    Auto-Process
                  </p>
                  <p className="text-sm font-medium mt-0.5 text-emerald-400">Active</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5 border-border/50 flex-1"
                >
                  <RefreshCw className="size-3" />
                  Sync Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 flex-1"
                  onClick={handleDisconnect}
                >
                  <LogOut className="size-3" />
                  Disconnect
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}