import { CurveType } from "recharts/types/shape/Curve";

export enum ChartType {
    Area = 'area',
    Bar = 'bar',
    Line = 'line',
    Scatter = 'scatter'
}

export const ChartTypes: ChartType[] = [ChartType.Area, ChartType.Bar, ChartType.Line, ChartType.Scatter];

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