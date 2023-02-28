import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AxisChartProps } from '../constants';

type BarChartProps = {} & Omit<AxisChartProps, 'curveType'>;

export default function BarChart({
  color,
  data,
  scale,
  xAxisTitle,
  xKey,
  yAxisTitle,
  yKey,
}: BarChartProps): JSX.Element {
  return (
    <ResponsiveContainer>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <Bar dataKey={yKey} fill={color} />
        <Tooltip />
        <XAxis dataKey={xKey} label={{ value: xAxisTitle }} name={xAxisTitle} />
        <YAxis
          dataKey={yKey}
          label={{
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
            value: yAxisTitle,
          }}
          name={yAxisTitle}
          scale={scale}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
