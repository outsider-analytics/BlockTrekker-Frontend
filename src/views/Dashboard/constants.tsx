import { ChartType } from 'components/Charts/constants';

export const COLUMNS = 12;

export const ROW_HEIGHT = 120;

export const WIDTH = 1200;

// type DashboardWidgetTypes = 'visualization' | 'text';

export const DEFAULT_LAYOUT = [
  {
    content: {
      format: 'plaintext',
      text: 'This is your dashboard! Do whatever you like with it!',
    },
    elementType: 'text',
    gridInstructions: { i: '1', w: 12, h: 1, x: 0, y: 0 },
  },
  {
    content: {
      chartType: ChartType.Line,
      data: [
        { x: 0, y: 4 },
        { x: 1, y: 20 },
        { x: 2, y: 45 },
        { x: 3, y: 120 },
        { x: 4, y: 78 },
        { x: 5, y: 80 },
        { x: 6, y: 180 },
        { x: 7, y: 226 },
        { x: 8, y: 226 },
        { x: 9, y: 1226 },
        { x: 10, y: 46 },
      ],
      name: 'Example Line Chart',
      xKey: 'x',
      yKey: 'y',
    },
    elementType: 'visualization',
    gridInstructions: { i: '2', w: 6, h: 3, x: 0, y: 1 },
  },
  {
    content: {
      chartType: ChartType.Area,
      color: '#22AA61',
      data: [
        { x: 0, y: 4 },
        { x: 1, y: 20 },
        { x: 2, y: 45 },
        { x: 3, y: 120 },
        { x: 4, y: 78 },
        { x: 5, y: 80 },
        { x: 6, y: 180 },
        { x: 7, y: 226 },
        { x: 8, y: 226 },
        { x: 9, y: 1226 },
        { x: 10, y: 46 },
      ],
      name: 'Example Area Chart',
      xKey: 'x',
      yKey: 'y',
    },
    elementType: 'visualization',
    gridInstructions: { i: '3', w: 6, h: 3, x: 6, y: 1 },
  },
  {
    content: {
      chartType: ChartType.Bar,
      color: '#F4B70E',
      data: [
        { x: 0, y: 4 },
        { x: 1, y: 20 },
        { x: 2, y: 45 },
        { x: 3, y: 120 },
        { x: 4, y: 78 },
        { x: 5, y: 80 },
        { x: 6, y: 180 },
        { x: 7, y: 226 },
        { x: 8, y: 226 },
        { x: 9, y: 1226 },
        { x: 10, y: 46 },
      ],
      name: 'Example Bar Chart',
      xKey: 'x',
      yKey: 'y',
    },
    elementType: 'visualization',
    gridInstructions: { i: '4', w: 6, h: 3, x: 0, y: 2 },
  },
  // {
  //   content: { type: ChartType.Line, xKey: 'x' },
  //   elementType: 'visualization',
  //   gridInstructions: { i: '5', w: 6, h: 3, x: 6, y: 2 },
  // },
];
