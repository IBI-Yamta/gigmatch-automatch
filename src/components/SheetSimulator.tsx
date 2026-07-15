import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  Table2,
  Plus,
  Trash2,
  Search,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import {
  Table as UITable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  categorizeDescription,
  type Trade,
  TRADES,
  getTradeBadgeColor,
} from "@/lib/categorizer";

interface SheetRow {
  id: string;
  description: string;
  category: Trade | "Uncategorized";
  confidence: number;
  status: "pending" | "categorized" | "verified";
}

const INITIAL_ROWS: SheetRow[] = [
  { id: "1", description: "Fix leaking pipe under kitchen sink", category: "Uncategorized", confidence: 0, status: "pending" },
  { id: "2", description: "Install new light fixture in bedroom", category: "Uncategorized", confidence: 0, status: "pending" },
  { id: "3", description: "Sew a tear in my wool coat jacket", category: "Uncategorized", confidence: 0, status: "pending" },
  { id: "4", description: "Build custom bookshelf for living room", category: "Uncategorized", confidence: 0, status: "pending" },
  { id: "5", description: "Paint the entire living room ceiling white", category: "Uncategorized", confidence: 0, status: "pending" },
  { id: "6", description: "Car engine making strange knocking noise", category: "Uncategorized", confidence: 0, status: "pending" },
  { id: "7", description: "Replace broken toilet flapper valve", category: "Uncategorized", confidence: 0, status: "pending" },
  { id: "8", description: "Install new electrical outlet in garage", category: "Uncategorized", confidence: 0, status: "pending" },
];

function getConfidenceEmoji(confidence: number): string {
  if (confidence >= 90) return "text-emerald-400";
  if (confidence >= 70) return "text-amber-400";
  return "text-muted-foreground";
}

export default function SheetSimulator() {
  const [rows, setRows] = useState<SheetRow[]>(INITIAL_ROWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const filteredRows = useMemo(
    () =>
      rows.filter((r) =>
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [rows, searchQuery]
  );

  const handleCategorize = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const category = categorizeDescription(row.description);
        const confidence = category === "Uncategorized" ? 0 : Math.min(95, 60 + Math.floor(Math.random() * 35));
        return {
          ...row,
          category,
          confidence,
          status: category === "Uncategorized" ? "pending" : "categorized",
        };
      })
    );
    toast.success("Row categorized");
  }, []);

  const handleCategorizeAll = useCallback(() => {
    setRows((prev) =>
      prev.map((row) => {
        const category = categorizeDescription(row.description);
        const confidence = category === "Uncategorized" ? 0 : Math.min(95, 60 + Math.floor(Math.random() * 35));
        return {
          ...row,
          category,
          confidence,
          status: category === "Uncategorized" ? "pending" : "categorized",
        };
      })
    );
    toast.success(`All ${rows.length} rows categorized`);
  }, [rows.length]);

  const handleVerify = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, status: "verified" as const } : row
      )
    );
    toast.success("Row verified");
  }, []);

  const handleAddRow = useCallback(() => {
    const newId = String(Date.now());
    setRows((prev) => [
      ...prev,
      {
        id: newId,
        description: "",
        category: "Uncategorized",
        confidence: 0,
        status: "pending",
      },
    ]);
    setEditingId(newId);
    setEditValue("");
  }, []);

  const handleDeleteRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Row removed");
  }, []);

  const handleStartEdit = useCallback((id: string, currentDesc: string) => {
    setEditingId(id);
    setEditValue(currentDesc);
  }, []);

  const handleSaveEdit = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, description: editValue, category: "Uncategorized", confidence: 0, status: "pending" }
          : row
      )
    );
    setEditingId(null);
    setEditValue("");
    toast.success("Description updated");
  }, [editValue]);

  const categorizedCount = rows.filter((r) => r.status !== "pending").length;
  const verifiedCount = rows.filter((r) => r.status === "verified").length;

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-2xl shadow-emerald-500/5">
      <CardHeader className="border-b border-border/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Table2 className="size-5 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">
                Spreadsheet Data
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {rows.length} rows · {categorizedCount} categorized · {verifiedCount} verified
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search rows..."
                className="h-8 w-44 pl-8 text-xs bg-background/50 border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              onClick={handleCategorizeAll}
            >
              <Sparkles className="size-3.5" />
              Auto-Categorize All
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-border/50"
              onClick={handleAddRow}
            >
              <Plus className="size-3.5" />
              Add Row
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <UITable>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="h-9 text-[11px] font-medium text-muted-foreground w-12 px-3">#</TableHead>
                <TableHead className="h-9 text-[11px] font-medium text-muted-foreground">Description</TableHead>
                <TableHead className="h-9 text-[11px] font-medium text-muted-foreground w-36">Category</TableHead>
                <TableHead className="h-9 text-[11px] font-medium text-muted-foreground w-20">Confidence</TableHead>
                <TableHead className="h-9 text-[11px] font-medium text-muted-foreground w-24">Status</TableHead>
                <TableHead className="h-9 text-[11px] font-medium text-muted-foreground w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false}>
                {filteredRows.map((row, idx) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="group border-border/20 hover:bg-white/[0.02] transition-colors"
                  >
                    <TableCell className="px-3 py-2.5 text-[11px] text-muted-foreground font-mono">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="py-2.5">
                      {editingId === row.id ? (
                        <div className="flex items-center gap-1.5">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-7 text-xs bg-background/50 border-border/50 flex-1"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(row.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                          />
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="size-7 text-emerald-400"
                            onClick={() => handleSaveEdit(row.id)}
                          >
                            <Check className="size-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <span
                          className="text-xs cursor-pointer hover:text-emerald-400 transition-colors"
                          onClick={() => handleStartEdit(row.id, row.description)}
                        >
                          {row.description || (
                            <span className="text-muted-foreground italic">Empty description</span>
                          )}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${getTradeBadgeColor(row.category)}`}
                      >
                        {row.category === "Uncategorized" ? (
                          <Search className="size-3" />
                        ) : (
                          <ArrowRight className="size-3" />
                        )}
                        {row.category}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className={`text-xs font-mono ${getConfidenceEmoji(row.confidence)}`}>
                        {row.confidence > 0 ? `${row.confidence}%` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Badge
                        variant={
                          row.status === "verified"
                            ? "default"
                            : row.status === "categorized"
                              ? "secondary"
                              : "outline"
                        }
                        className={`text-[10px] px-1.5 py-0 h-5 ${
                          row.status === "verified"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : row.status === "categorized"
                              ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                              : ""
                        }`}
                      >
                        {row.status === "verified"
                          ? "✓ Verified"
                          : row.status === "categorized"
                            ? "● Categorized"
                            : "○ Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {row.status === "pending" && (
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="size-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                            onClick={() => handleCategorize(row.id)}
                          >
                            <Sparkles className="size-3" />
                          </Button>
                        )}
                        {row.status === "categorized" && (
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="size-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                            onClick={() => handleVerify(row.id)}
                          >
                            <Check className="size-3" />
                          </Button>
                        )}
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteRow(row.id)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </UITable>
          {filteredRows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Table className="size-8 mb-2 opacity-30" />
              <p className="text-xs">No rows match your search</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}