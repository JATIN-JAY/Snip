import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MapPin } from "lucide-react";

export function TopLocationsChart({ countryData }) {
  return (
    <Card className="bg-white border-slate-200 rounded-3xl shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4 px-6 pt-6">
        <CardTitle className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" /> Top Locations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 h-[130px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={countryData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis
              type="number"
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
              width={80}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar dataKey="value" fill="#fb923c" radius={[0, 4, 4, 0]} barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
