import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MonitorSmartphone } from "lucide-react";

const COLORS = ["#ea580c", "#3b82f6", "#22c55e", "#f59e0b"];

export function DevicePieChart({ deviceData }) {
  return (
    <Card className="bg-white border-slate-200 rounded-3xl shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-3 px-5 pt-5">
        <CardTitle className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
          <MonitorSmartphone className="w-4 h-4 text-slate-400" /> Devices
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 h-[130px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={deviceData}
              cx="30%"
              cy="50%"
              innerRadius={26}
              outerRadius={45}
              paddingAngle={4}
              dataKey="value"
            >
              {deviceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

