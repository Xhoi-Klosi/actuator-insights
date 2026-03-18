import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  status?: "normal" | "warning" | "critical";
}

export function MetricCard({ title, value, unit, icon: Icon, trend, status = "normal" }: MetricCardProps) {
  return (
    <Card className={cn(
      "border transition-colors",
      status === "warning" && "border-warning/40",
      status === "critical" && "border-destructive/40",
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl font-bold text-foreground">{value}</span>
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
          </div>
          <div className={cn(
            "rounded-lg p-2",
            status === "normal" && "bg-primary/10 text-primary",
            status === "warning" && "bg-warning/10 text-warning",
            status === "critical" && "bg-destructive/10 text-destructive",
          )}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            <span className={cn(
              "text-xs font-medium",
              trend === "up" && "text-destructive",
              trend === "down" && "text-success",
              trend === "stable" && "text-muted-foreground",
            )}>
              {trend === "up" ? "↑ Rising" : trend === "down" ? "↓ Falling" : "→ Stable"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
