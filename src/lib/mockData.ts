// Generate realistic mock telemetry data for Belimo actuator

export interface TelemetryPoint {
  timestamp: string;
  time: number; // minutes
  setpoint: number;
  feedback: number;
  torque: number;
  power: number;
  temperature: number;
  direction: "CW" | "CCW" | "STOP";
}

export interface AnomalyEvent {
  id: string;
  timestamp: string;
  type: "torque_spike" | "temp_warning" | "oscillation" | "position_drift";
  severity: "low" | "medium" | "high";
  message: string;
  value: number;
}

function generateTelemetry(): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  const now = Date.now();

  for (let i = 0; i < 120; i++) {
    const t = i;
    const phase = Math.floor(i / 30);
    let setpoint: number, feedback: number, torque: number, power: number, temperature: number;
    let direction: "CW" | "CCW" | "STOP" = "STOP";

    if (phase === 0) {
      // Ramp up 0→100%
      setpoint = Math.min(100, (i / 30) * 100);
      feedback = setpoint - (Math.random() * 2);
      torque = 800 + Math.sin(i * 0.3) * 100 + Math.random() * 50;
      power = 3.5 + (setpoint / 100) * 2 + Math.random() * 0.3;
      direction = "CW";
    } else if (phase === 1) {
      // Hold at 100%
      setpoint = 100;
      feedback = 99.2 + Math.random() * 0.8;
      torque = 650 + Math.random() * 40;
      power = 5.2 + Math.random() * 0.2;
      direction = "STOP";
    } else if (phase === 2) {
      // Ramp down with a torque anomaly around i=75
      setpoint = Math.max(0, 100 - ((i - 60) / 30) * 100);
      feedback = setpoint + (Math.random() * 2);
      const anomalyBoost = (i > 72 && i < 78) ? 400 : 0;
      torque = 750 + anomalyBoost + Math.sin(i * 0.5) * 80 + Math.random() * 50;
      power = 5.0 - (setpoint / 100) * 1.5 + Math.random() * 0.3;
      direction = "CCW";
    } else {
      // Oscillation zone (simulating issue)
      setpoint = 50 + Math.sin(i * 0.8) * 20;
      feedback = setpoint + Math.sin(i * 1.2) * 8;
      torque = 900 + Math.sin(i * 0.6) * 200 + Math.random() * 100;
      power = 4.5 + Math.sin(i * 0.4) * 1.5 + Math.random() * 0.5;
      direction = i % 4 < 2 ? "CW" : "CCW";
    }

    temperature = 28 + (i / 120) * 15 + Math.sin(i * 0.1) * 2 + Math.random() * 1;

    points.push({
      timestamp: new Date(now - (120 - i) * 60000).toISOString(),
      time: t,
      setpoint: Math.round(setpoint * 10) / 10,
      feedback: Math.round(Math.max(0, Math.min(100, feedback)) * 10) / 10,
      torque: Math.round(torque),
      power: Math.round(power * 100) / 100,
      temperature: Math.round(temperature * 10) / 10,
      direction,
    });
  }
  return points;
}

function generateAnomalies(): AnomalyEvent[] {
  return [
    {
      id: "a1",
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      type: "torque_spike",
      severity: "high",
      message: "Torque spike detected: 1,150 Nmm exceeds threshold (1,000 Nmm)",
      value: 1150,
    },
    {
      id: "a2",
      timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
      type: "oscillation",
      severity: "medium",
      message: "Position oscillation detected: ±8% deviation from setpoint",
      value: 8,
    },
    {
      id: "a3",
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      type: "temp_warning",
      severity: "medium",
      message: "Internal temperature rising: 42.3°C approaching limit (50°C)",
      value: 42.3,
    },
    {
      id: "a4",
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      type: "position_drift",
      severity: "low",
      message: "Minor position drift: feedback 1.2% below setpoint",
      value: 1.2,
    },
  ];
}

export function computeHealthScore(data: TelemetryPoint[], anomalies: AnomalyEvent[]): number {
  let score = 100;

  // Penalize for anomalies
  anomalies.forEach((a) => {
    if (a.severity === "high") score -= 15;
    if (a.severity === "medium") score -= 8;
    if (a.severity === "low") score -= 3;
  });

  // Penalize for high average torque
  const avgTorque = data.reduce((s, d) => s + d.torque, 0) / data.length;
  if (avgTorque > 900) score -= 10;
  if (avgTorque > 1000) score -= 10;

  // Penalize for high temperature
  const maxTemp = Math.max(...data.map((d) => d.temperature));
  if (maxTemp > 40) score -= 5;
  if (maxTemp > 45) score -= 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export const mockTelemetry = generateTelemetry();
export const mockAnomalies = generateAnomalies();
export const healthScore = computeHealthScore(mockTelemetry, mockAnomalies);
