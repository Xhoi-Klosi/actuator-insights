import { AnomalyEvent } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { AlertTriangle, Activity, Thermometer, ArrowUpDown } from "lucide-react";

const iconMap = {
  torque_spike: AlertTriangle,
  oscillation: Activity,
  temp_warning: Thermometer,
  position_drift: ArrowUpDown,
};

const severityStyles = {
  high: "border-l-destructive bg-destructive/5",
  medium: "border-l-warning bg-warning/5",
  low: "border-l-primary bg-primary/5",
};

interface AnomalyLogProps {
  anomalies: AnomalyEvent[];
}

export function AnomalyLog({ anomalies }: AnomalyLogProps) {
  return (
    <div className="space-y-2">
      {anomalies.map((a) => {
        const Icon = iconMap[a.type];
        return (
          <div
            key={a.id}
            className={cn(
              "flex items-start gap-3 rounded-md border-l-4 p-3",
              severityStyles[a.severity]
            )}
          >
            <Icon className={cn(
              "mt-0.5 h-4 w-4 shrink-0",
              a.severity === "high" && "text-destructive",
              a.severity === "medium" && "text-warning",
              a.severity === "low" && "text-primary",
            )} />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">{a.message}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {new Date(a.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <span className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold uppercase",
              a.severity === "high" && "bg-destructive/20 text-destructive",
              a.severity === "medium" && "bg-warning/20 text-warning",
              a.severity === "low" && "bg-primary/20 text-primary",
            )}>
              {a.severity}
            </span>
          </div>
        );
      })}
    </div>
  );
}
