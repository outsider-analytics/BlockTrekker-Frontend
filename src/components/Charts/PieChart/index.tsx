import { useState } from 'react';
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Sector,
  Tooltip as RechartsTooltip,
} from 'recharts';

import Tooltip from '../components/Tooltip';
import { PALETTE } from '../constants';

type PieChartProps = {
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  dataKey: string;
  nameKey: string;
};

export default function PieChart({
  data,
  dataKey,
  nameKey,
}: PieChartProps): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(-1);

  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeShape = (props: any) => {
    const { cx, cy, endAngle, fill, innerRadius, outerRadius, startAngle } =
      props;
    return (
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius * 0.95}
        outerRadius={outerRadius * 1.05}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    );
  };

  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer>
      <RechartsPieChart>
        <RechartsTooltip
          content={<Tooltip />}
          wrapperStyle={{ outline: 'none', zIndex: 100 }}
        />
        <Pie
          activeIndex={activeIndex}
          activeShape={activeShape}
          cx="50%"
          cy="50%"
          data={data}
          dataKey={dataKey}
          labelLine={false}
          nameKey={nameKey}
          onMouseEnter={onPieEnter}
          onMouseLeave={() => setActiveIndex(-1)}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={PALETTE[index % PALETTE.length]}
            />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
