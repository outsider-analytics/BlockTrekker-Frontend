import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { AxisChartProps } from '../constants';

type LineChartProps = {} & AxisChartProps;

export default function LineChart({
  color,
  curveType,
  data,
  scale,
  xAxisTitle,
  xKey,
  yAxisTitle,
  yKey,
}: LineChartProps): JSX.Element {
  return (
    <ResponsiveContainer>
      <RechartsLineChart data={data} margin={{ bottom: 8, left: 0, right: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <Line
          activeDot={{ r: 1 }}
          isAnimationActive={false}
          dataKey={yKey}
          dot={false}
          stroke={color}
          type={curveType}
        />
        <Tooltip />
        <XAxis
          dataKey={xKey}
          label={{ dy: 15, value: xAxisTitle }}
          name={xAxisTitle}
          scale={scale}
        />
        <YAxis
          dataKey={yKey}
          label={{
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
            value: yAxisTitle,
          }}
          name={yAxisTitle}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
