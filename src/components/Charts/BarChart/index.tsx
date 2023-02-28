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
  height,
  scale,
  width,
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
        <XAxis dataKey={xKey} name={xAxisTitle} />
        <YAxis dataKey={yKey} name={yAxisTitle} scale={scale} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
