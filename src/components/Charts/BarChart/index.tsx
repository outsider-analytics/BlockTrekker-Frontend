import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';

import Tooltip from '../components/Tooltip';
import { AxisChartProps, PALETTE } from '../constants';

type BarChartProps = Omit<AxisChartProps, 'curveType'>;

export default function BarChart({
  color,
  data,
  grid,
  scale,
  stackBy,
  xAxisTitle,
  xKey,
  yAxisTitle,
  yKey,
}: BarChartProps): JSX.Element {
  return (
    <ResponsiveContainer>
      <RechartsBarChart data={stackBy ? data.formattedData : data}>
        {grid && <CartesianGrid strokeDasharray="3 3" />}
        <RechartsTooltip
          content={<Tooltip />}
          wrapperStyle={{ outline: 'none', zIndex: 100 }}
        />
        {stackBy ? (
          data.keys?.map((key: string, index: number) => (
            <Bar
              dataKey={key}
              fill={PALETTE[index % PALETTE.length]}
              fillOpacity={1}
              isAnimationActive={false}
              key={key}
              stackId={'1'}
              type="monotone"
            />
          ))
        ) : (
          <Bar dataKey={yKey} fill={color} />
        )}
        <XAxis dataKey={xKey} label={{ value: xAxisTitle }} name={xAxisTitle} />
        <YAxis
          dataKey={stackBy ? '' : yKey}
          domain={['auto', 'auto']}
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
