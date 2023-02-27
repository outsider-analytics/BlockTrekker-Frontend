import { useMemo } from 'react';
import { ChartType } from '../constants';
import AreaChart from 'components/Charts/AreaChart';
import BarChart from 'components/Charts/BarChart';
import LineChart from 'components/Charts/LineChart';
import { DEFAULT_DATA } from '../constants';

type ChartWrapperProps = {
  chartType: string;
  color: string;
  height?: number;
  rows: any[];
  width?: number;
  xKey: string;
  yKey: string;
};

export default function ChartWrapper({
  chartType,
  color,
  height,
  rows,
  width,
  xKey,
  yKey,
}: ChartWrapperProps): JSX.Element {
  const customSelected = useMemo(() => {
    return xKey && yKey;
  }, [xKey, yKey]);

  if (chartType === ChartType.Area) {
    return (
      <AreaChart
        color={color}
        data={customSelected ? rows : DEFAULT_DATA}
        height={height ?? 300}
        width={width ?? 800}
        xKey={xKey || 'x'}
        yKey={yKey || 'y'}
      />
    );
  } else if (chartType === ChartType.Bar) {
    return (
      <BarChart
        color={color}
        data={customSelected ? rows : DEFAULT_DATA}
        height={height ?? 300}
        width={width ?? 800}
        xKey={xKey || 'x'}
        yKey={yKey || 'y'}
      />
    );
  } else if (chartType === ChartType.Line) {
    return (
      <LineChart
        color={color}
        curveType='basis'
        data={customSelected ? rows : DEFAULT_DATA}
        height={height ?? 300}
        width={width ?? 800}
        xKey={xKey || 'x'}
        yKey={yKey || 'y'}
      />
    );
  } else {
    return <div>TODO</div>;
  }
}
