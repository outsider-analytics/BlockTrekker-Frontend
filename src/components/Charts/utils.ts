// export const generateStackData = (key: string, rows: any[], xKey: string) => {
//     const unique = uniqueValues(key, rows);
//     const dateObj = {};
//     rows.forEach(row => {
//         if(dateObj.hasOwnProperty(xKey)) {
//             dateObj[xKey].push();
//         } else {
//             dateObj[xKey] =
//         }
//     });
// }

// TODO: Change from any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uniqueValues = (key: string, rows: any[]): any[] => {
  const set = new Set();
  rows.forEach((row) => {
    if (row[key] !== null) set.add(row[key]);
  });
  return Array.from(set);
};
