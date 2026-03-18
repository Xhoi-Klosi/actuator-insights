import { cn } from "@/lib/utils";

interface HealthGaugeProps {
  score: number;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Healthy";
  if (score >= 60) return "Caution";
  return "Critical";
}

function getScoreBg(score: number) {
  if (score >= 80) return "from-success/20 to-success/5";
  if (score >= 60) return "from-warning/20 to-warning/5";
  return "from-destructive/20 to-destructive/5";
}

export function HealthGauge({ score }: HealthGaugeProps) {
  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn("relative rounded-full bg-gradient-to-b p-6", getScoreBg(score))}>
        <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
          <circle
            cx="70" cy="70" r="58"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="10"
          />
          <circle
            cx="70" cy="70" r="58"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn("transition-all duration-1000", getScoreColor(score))}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-mono text-4xl font-bold", getScoreColor(score))}>
            {score}
          </span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>
      <div className="text-center">
        <span className={cn("text-sm font-semibold uppercase tracking-wider", getScoreColor(score))}>
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}
