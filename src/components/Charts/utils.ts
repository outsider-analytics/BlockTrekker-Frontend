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

export const uniqueValues = (key: string, rows: any[]) => {
    const set = new Set();
    rows.forEach(row => {
        if (row[key] !== null) set.add(row[key]);
    })
    return Array.from(set);
}