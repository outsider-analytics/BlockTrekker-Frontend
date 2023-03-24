import AreaChart from 'components/Charts/AreaChart';
import BarChart from 'components/Charts/BarChart';
import LineChart from 'components/Charts/LineChart';
import { useMemo } from 'react';

import { ChartScale, ChartType, DEFAULT_DATA, StackBy } from '../constants';
import PieChart from '../PieChart';
import { generateStackData } from '../utils';

type ChartWrapperProps = {
  chartType: string;
  color: string;
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  grid?: boolean;
  stackBy?: StackBy;
  scale?: ChartScale;
  xAxisTitle?: string;
  xKey: string;
  yAxisTitle?: string;
  yKey: string;
};

export default function ChartWrapper({
  chartType,
  color,
  data,
  grid,
  scale = ChartScale.Linear,
  stackBy,
  xAxisTitle,
  xKey,
  yAxisTitle,
  yKey,
}: ChartWrapperProps): JSX.Element {
  const customSelected = useMemo(() => {
    return xKey && yKey;
  }, [xKey, yKey]);

  const stackedData = useMemo(() => {
    if (!stackBy) return [];
    return generateStackData(data, stackBy, xKey);
  }, [data, stackBy, xKey]);

  if (chartType === ChartType.Area) {
    return (
      <AreaChart
        color={color}
        data={customSelected ? (stackBy ? stackedData : data) : DEFAULT_DATA}
        grid={!!grid}
        scale={scale}
        stackBy={stackBy}
        xAxisTitle={xAxisTitle ?? ''}
        xKey={xKey || 'x'}
        yAxisTitle={yAxisTitle ?? ''}
        yKey={yKey || 'y'}
      />
    );
  } else if (chartType === ChartType.Bar) {
    return (
      <BarChart
        color={color}
        data={customSelected ? (stackBy ? stackedData : data) : DEFAULT_DATA}
        grid={!!grid}
        scale={scale}
        stackBy={stackBy}
        xAxisTitle={xAxisTitle ?? ''}
        xKey={xKey || 'x'}
        yAxisTitle={yAxisTitle ?? ''}
        yKey={yKey || 'y'}
      />
    );
  } else if (chartType === ChartType.Line) {
    return (
      <LineChart
        color={color}
        curveType="basis"
        data={customSelected ? (stackBy ? stackedData : data) : DEFAULT_DATA}
        grid={!!grid}
        scale={scale}
        stackBy={stackBy}
        xAxisTitle={xAxisTitle ?? ''}
        xKey={xKey || 'x'}
        yAxisTitle={yAxisTitle ?? ''}
        yKey={yKey || 'y'}
      />
    );
  } else {
    return (
      <PieChart
        data={customSelected ? data : DEFAULT_DATA}
        dataKey={yKey || 'y'}
        nameKey={xKey || 'x'}
      />
    );
  }
}
