
import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Line,
} from "recharts";

// Sample candlestick data format
interface CandleData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const data: CandleData[] = [
  { date: "2023-04-10", open: 140, high: 145, low: 138, close: 144 },
  { date: "2023-04-11", open: 144, high: 146, low: 141, close: 142 },
  { date: "2023-04-12", open: 142, high: 143, low: 139, close: 140 },
  { date: "2023-04-13", open: 140, high: 141, low: 136, close: 137 },
  { date: "2023-04-14", open: 137, high: 139, low: 134, close: 138 },
  { date: "2023-04-15", open: 138, high: 142, low: 137, close: 141 },
];

const CandleChart = () => {
  // Custom tooltip to show OHLC
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-md text-xs text-gray-700">
          <p>Date: {d.date}</p>
          <p>Open: ${d.open.toFixed(2)}</p>
          <p>High: ${d.high.toFixed(2)}</p>
          <p>Low: ${d.low.toFixed(2)}</p>
          <p>Close: ${d.close.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl shadow-md mb-8 w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <CartesianGrid strokeDasharray="3 3" />
          {/* High-Low line */}
          <Bar
            dataKey="low"
            fill="none"
            shape={({ x, y, width, height, payload, index, ...rest }) => {
              const high = payload.high;
              const low = payload.low;
              const xPos = x! + width! / 2;
              const yHigh = rest?.y!;
              const yLow = rest?.y! + height!;
              return (
                <line
                  x1={xPos}
                  x2={xPos}
                  y1={yHigh}
                  y2={yLow}
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
              );
            }}
          />
          {/* Open-Close rectangle */}
          <Bar
            dataKey="close"
            fill="#0ea5e9"
            barSize={10}
            shape={({ x, y, width, height, payload }) => {
              const open = payload.open;
              const close = payload.close;
              const isBearish = close < open;
              const rectY = y;
              const rectHeight = height;
              return (
                <rect
                  x={x!}
                  y={y!}
                  width={10}
                  height={Math.abs(y! - (y! + height!))}
                  fill={isBearish ? "#ef4444" : "#22c55e"}
                  stroke="#0ea5e9"
                />
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandleChart;

