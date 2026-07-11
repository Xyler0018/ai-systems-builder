"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card } from "@/components/ui";

const colors = ["#38c7c0", "#d6a84f", "#7aa2ff", "#8fd694", "#f47b7b", "#b694f6"];

export function ChartCard({
  title,
  data,
  type,
  keys
}: {
  title: string;
  data: Record<string, unknown>[];
  type: "area" | "bar" | "line" | "pie";
  keys: string[];
}) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground">{data.length} points</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === "area" ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.18)" />
              <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} />
              <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#0c1423", border: "1px solid #243044" }} />
              <Area type="monotone" dataKey={keys[0]} stroke={colors[0]} fill={colors[0]} fillOpacity={0.18} />
            </AreaChart>
          ) : type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.18)" />
              <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 12 }} />
              <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#0c1423", border: "1px solid #243044" }} />
              <Line type="monotone" dataKey={keys[0]} stroke={colors[0]} strokeWidth={2} dot={false} />
            </LineChart>
          ) : type === "pie" ? (
            <PieChart>
              <Pie data={data} dataKey={keys[0]} nameKey="name" innerRadius={55} outerRadius={86} paddingAngle={2}>
                {data.map((_entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0c1423", border: "1px solid #243044" }} />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.18)" />
              <XAxis dataKey={data[0]?.category ? "category" : "name"} tick={{ fill: "currentColor", fontSize: 12 }} />
              <YAxis tick={{ fill: "currentColor", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#0c1423", border: "1px solid #243044" }} />
              {keys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
