import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CurveType } from 'recharts/types/shape/Curve';
import { AxisChartProps } from '../constants';

type LineChartProps = {} & AxisChartProps;

export default function LineChart({
  color,
  curveType,
  data,
  height,
  scale,
  width,
  xAxisTitle,
  xKey,
  yAxisTitle,
  yKey,
}: LineChartProps): JSX.Element {
  return (
    <ResponsiveContainer>
      <RechartsLineChart data={data} margin={{ bottom: 0, left: 0, right: 0 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <Line
          activeDot={{ r: 1 }}
          isAnimationActive={false}
          dataKey={yKey}
          dot={false}
          stroke={color}
          type={curveType}
        />
        <Tooltip />
        <XAxis dataKey={xKey} name={xAxisTitle} scale={scale} />
        <YAxis dataKey={yKey} name={yAxisTitle} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
