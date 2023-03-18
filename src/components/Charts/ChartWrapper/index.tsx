import AreaChart from 'components/Charts/AreaChart';
import BarChart from 'components/Charts/BarChart';
import LineChart from 'components/Charts/LineChart';
import { useMemo } from 'react';

import { ChartScale, ChartType, DEFAULT_DATA } from '../constants';

type ChartWrapperProps = {
  chartType: string;
  color: string;
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  height?: number;
  scale?: ChartScale;
  width?: number;
  xAxisTitle?: string;
  xKey: string;
  yAxisTitle?: string;
  yKey: string;
};

export default function ChartWrapper({
  chartType,
  color,
  height,
  data,
  scale = ChartScale.Linear,
  width,
  xAxisTitle,
  xKey,
  yAxisTitle,
  yKey,
}: ChartWrapperProps): JSX.Element {
  const customSelected = useMemo(() => {
    return xKey && yKey;
  }, [xKey, yKey]);

  if (chartType === ChartType.Area) {
    return (
      <AreaChart
        color={color}
        data={customSelected ? data : DEFAULT_DATA}
        height={height ?? 300}
        scale={scale}
        width={width ?? 800}
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
        data={customSelected ? data : DEFAULT_DATA}
        height={height ?? 300}
        scale={scale}
        width={width ?? 800}
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
        data={customSelected ? data : DEFAULT_DATA}
        height={height ?? 300}
        scale={scale}
        width={width ?? 800}
        xAxisTitle={xAxisTitle ?? ''}
        xKey={xKey || 'x'}
        yAxisTitle={yAxisTitle ?? ''}
        yKey={yKey || 'y'}
      />
    );
  } else {
    return <div>TODO</div>;
  }
}
