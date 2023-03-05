import * as React from "react";
import { useTheme } from "@mui/material/styles";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "0",
    uv: 400,
    amt: 240,
  },
  {
    name: "1",
    uv: 500,
    amt: 221,
  },
  {
    name: "2",
    uv: 300,
    amt: 221,
  },
  {
    name: "3",
    uv: 200,
    amt: 229,
  },
  {
    name: "4",
    uv: 278,
    amt: 200,
  },
  {
    name: "4",
    uv: 189,
    amt: 218,
  },
  {
    name: "5",
    uv: 239,
    amt: 250,
  },
  {
    name: "6",
    uv: 349,
    amt: 210,
  },
];
export default function StatisticChart() {
  const theme = useTheme();

  return (
    <ResponsiveContainer>
      <AreaChart
        data={data}
        syncId="anyId"
        margin={{
          top: 0,
          right: 0,
          left: -20,
          bottom: -10,
        }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="20%" stopColor="#61d129" stopOpacity={1} />
          <stop offset="95%" stopColor="#1A2027" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis  />
        <CartesianGrid horizontal={false} vertical={false} />
        <Tooltip />
        <Area
          type="linear"
          dataKey="uv"
          stroke={theme.palette.primary.main}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
