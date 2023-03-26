import { StackBy } from './constants';

export const formatXAxisTicks = (tick: string): string => {
  // Check if tick is date
  // const date = new Date(tick);
  // if (!isNaN(date.getTime())) {
  //   return moment(tick).format('MMM, D');
  // }
  return tick;
};

export const generateStackData = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  rows: any[],
  stackBy: StackBy,
  xKey: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
): any => {
  const { stackColumn, valueColumn } = stackBy;
  const unique = uniqueValues(stackColumn, rows);
  const keyObj = setToObject(unique);
  const reduceByXKey = rows.reduce((obj, entry) => {
    const parsedXKey = handleXKey(entry, xKey);
    // If date doesn't exist then intialize with all keys
    if (!obj[parsedXKey]) {
      obj[parsedXKey] = { ...keyObj };
    }
    obj[parsedXKey][entry[stackColumn]] = entry[valueColumn];
    return obj;
  }, {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  const formattedData = Object.entries(reduceByXKey).map((entry: any) => {
    return {
      [xKey]: entry[0],
      ...entry[1],
    };
  });
  return { formattedData, keys: Array.from(unique) };
};

/**
 *
 * @param data {any} - data at specific index in data array
 * @param key {string} - Key to parse from data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const handleXKey = (data: any, key: string) => {
  const val = data[key];
  // If val is object we can assume it is a BigQuery date. Return value inside
  if (val instanceof Object) {
    return val.value;
  }
  return val;
};

export const setToObject = (set: Set<string>): { [key: string]: number } => {
  const obj: { [key: string]: number } = {};
  set.forEach((value) => {
    obj[value] = 0;
  });
  return obj;
};

// TODO: Change from any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uniqueValues = (key: string, rows: any[]): Set<string> => {
  const set: Set<string> = new Set();
  rows.forEach((row) => {
    if (row[key] !== null) set.add(row[key]);
  });
  return set;
};
