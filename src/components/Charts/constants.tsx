import {
  AiOutlineAreaChart,
  AiOutlineBarChart,
  AiOutlineLineChart,
  AiOutlinePieChart,
} from 'react-icons/ai';
import { CurveType } from 'recharts/types/shape/Curve';

export const AxisChartOptions = ['Standard', 'Stacked'];

export enum ChartScale {
  Linear = 'linear',
  Log = 'log',
}

export const ChartScales: ChartScale[] = [ChartScale.Linear, ChartScale.Log];

export enum ChartType {
  Area = 'area',
  Bar = 'bar',
  Line = 'line',
  Pie = 'pie',
}

export const ChartTypeToIcon: { [key: string]: JSX.Element } = {
  [ChartType.Area]: <AiOutlineAreaChart size={16} />,
  [ChartType.Bar]: <AiOutlineBarChart size={16} />,
  [ChartType.Line]: <AiOutlineLineChart size={16} />,
  [ChartType.Pie]: <AiOutlinePieChart size={16} />,
};

export const AxisCharts: ChartType[] = [
  ChartType.Area,
  ChartType.Bar,
  ChartType.Line,
];

export const ChartTypes: ChartType[] = [
  ChartType.Area,
  ChartType.Bar,
  ChartType.Line,
  ChartType.Pie,
];

export const CurveOptions: CurveType[] = [
  'basis',
  'basisClosed',
  'linear',
  'linearClosed',
  'monotone',
  'monotoneX',
  'monotoneY',
  'natural',
  'step',
  'stepAfter',
  'stepBefore',
];

export const DEFAULT_DATA = [
  { x: 1, y: 50 },
  { x: 2, y: 75 },
  { x: 3, y: 175 },
  { x: 4, y: 130 },
  { x: 5, y: 200 },
  { x: 6, y: 140 },
  { x: 7, y: 175 },
  { x: 8, y: 220 },
  { x: 9, y: 260 },
  { x: 10, y: 280 },
];

export const PALETTE = [
  '#a6cee3',
  '#1f78b4',
  '#b2df8a',
  '#33a02c',
  '#fb9a99',
  '#e31a1c',
  '#fdbf6f',
  '#ff7f00',
  '#cab2d6',
  '#6a3d9a',
  '#ffff99',
  '#b15928',
];

export type StackBy = {
  stackColumn: string;
  valueColumn: string;
};

export type AxisChartProps = {
  color: string;
  curveType: CurveType;
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  grid: boolean;
  height?: number;
  scale: ChartScale;
  stackBy?: StackBy;
  width?: number;
  xAxisTitle: string;
  xKey: string;
  yAxisTitle?: string;
  yKey: string;
};
