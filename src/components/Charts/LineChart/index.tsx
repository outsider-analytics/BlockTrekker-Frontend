import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';

import Tooltip from '../components/Tooltip';
import { AxisChartProps, PALETTE } from '../constants';

type LineChartProps = AxisChartProps;

export default function LineChart({
  color,
  curveType,
  data,
  grid,
  scale,
  stackBy,
  xAxisTitle,
  xKey,
  yAxisTitle,
  yKey,
}: LineChartProps): JSX.Element {
  return (
    <ResponsiveContainer>
      <RechartsLineChart
        data={stackBy ? data.formattedData : data}
        margin={{ bottom: 8, left: 0, right: 0 }}
      >
        {grid && <CartesianGrid strokeDasharray="3 3" />}
        <RechartsTooltip content={<Tooltip />} />
        {stackBy ? (
          data.keys?.map((key: string, index: number) => (
            <Line
              activeDot={{ strokeWidth: 1 }}
              dataKey={key}
              dot={false}
              fill={PALETTE[index % PALETTE.length]}
              key={key}
              stroke={PALETTE[index % PALETTE.length]}
              strokeWidth={2}
            />
          ))
        ) : (
          <Line
            activeDot={{ r: 5, strokeWidth: 0.5 }}
            isAnimationActive={false}
            dataKey={yKey}
            dot={false}
            stroke={color}
            type="monotone"
          />
        )}
        <XAxis
          dataKey={xKey}
          label={{ dy: 15, value: xAxisTitle }}
          name={xAxisTitle}
        />
        <YAxis
          dataKey={stackBy ? '' : yKey}
          domain={['auto', 'auto']}
          label={{
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
            value: yAxisTitle,
          }}
          scale={scale}
          name={yAxisTitle}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
