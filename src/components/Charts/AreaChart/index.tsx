import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { AxisChartProps } from '../constants';

type AreaChartProps = {} & Omit<AxisChartProps, 'curveType'>;

export default function AreaChart({
  color,
  data,
  scale,
  xAxisTitle,
  xKey,
  yAxisTitle,
  yKey,
}: AreaChartProps): JSX.Element {
  return (
    <ResponsiveContainer>
      <RechartsAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <Area
          activeDot={{ r: 1 }}
          dataKey={yKey}
          dot={false}
          fill={color}
          fillOpacity={0.6}
          isAnimationActive={false}
          stroke={color}
          type="monotone"
        />
        <Tooltip />
        <XAxis dataKey={xKey} label={{ value: xAxisTitle }} />
        <YAxis
          dataKey={yKey}
          label={{
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
            value: yAxisTitle,
          }}
          scale={scale}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
