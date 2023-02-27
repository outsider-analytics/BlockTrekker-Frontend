import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type BarChartProps = {
  color: string;
  data: any[];
  height: number;
  width: number;
  xAxisTitle: string;
  xKey: string;
  yAxisTitle: string;
  yKey: string;
};

export default function BarChart({
  color,
  data,
  height,
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
        <YAxis dataKey={yKey} name={yAxisTitle} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
