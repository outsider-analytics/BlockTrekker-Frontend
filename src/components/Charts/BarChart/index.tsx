import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DEFAULT_DATA } from '../constants';

type BarChartProps = {
  color: string;
  data: any[];
  height: number;
  width: number;
  xKey: string;
  yKey: string;
};

export default function BarChart({
  color,
  data,
  height,
  width,
  xKey,
  yKey,
}: BarChartProps): JSX.Element {
  return (
    <ResponsiveContainer>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <Bar dataKey={yKey} fill={color} />
        <Tooltip />
        <XAxis dataKey={xKey} />
        <YAxis dataKey={yKey} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
