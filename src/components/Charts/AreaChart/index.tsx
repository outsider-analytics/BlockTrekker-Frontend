import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DEFAULT_DATA } from '../constants';

type AreaChartProps = {
  color: string;
  data: any[];
  height: number;
  width: number;
  xKey: string;
  yKey: string;
};

export default function AreaChart({
  color,
  data,
  height,
  width,
  xKey,
  yKey,
}: AreaChartProps): JSX.Element {
  return (
    <ResponsiveContainer>
      <RechartsAreaChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <Area
          activeDot={{ r: 1 }}
          dataKey={yKey}
          dot={false}
          fill={color}
          fillOpacity={0.6}
          isAnimationActive={false}
          stroke={color}
          type='monotone'
        />
        <Tooltip />
        <XAxis dataKey={xKey} />
        <YAxis dataKey={yKey} />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
