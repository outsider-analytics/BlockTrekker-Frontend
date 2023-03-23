import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';

import Tooltip from '../components/Tooltip';
import { AxisChartProps, PALETTE } from '../constants';
import { formatXAxisTicks, handleXKey } from '../utils';

type AreaChartProps = Omit<AxisChartProps, 'curveType'>;

export default function AreaChart({
  color,
  data,
  grid,
  scale,
  stackBy,
  xAxisTitle,
  xKey,
  yAxisTitle,
  yKey,
}: AreaChartProps): JSX.Element {
  return (
    <ResponsiveContainer>
      <RechartsAreaChart data={stackBy ? data.formattedData : data}>
        {grid && <CartesianGrid strokeDasharray="3 3" />}
        <RechartsTooltip
          content={<Tooltip />}
          wrapperStyle={{ outline: 'none', zIndex: 100 }}
        />
        {stackBy ? (
          data.keys?.map((key: string, index: number) => (
            <Area
              activeDot={{ r: 2, strokeWidth: 1 }}
              dataKey={key}
              fill={PALETTE[index % PALETTE.length]}
              fillOpacity={0.75}
              key={key}
              stackId={'1'}
              stroke={PALETTE[index % PALETTE.length]}
              type="linear"
            />
          ))
        ) : (
          <Area
            activeDot={{ r: 5, strokeWidth: 0.5 }}
            dataKey={yKey}
            dot={false}
            fill={color}
            fillOpacity={0.6}
            isAnimationActive={false}
            stroke={color}
            type="monotone"
          />
        )}
        <XAxis
          dataKey={(pt) => handleXKey(pt, xKey)}
          label={{ value: xAxisTitle }}
          tickFormatter={formatXAxisTicks}
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
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
