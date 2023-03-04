import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { sortArbitrayType } from 'utils';

const useStyles = createUseStyles({
  header: {
    borderRadius: '10px',
    color: '#A1A2A1',
    fontSize: '16px',
    fontWeight: 400,
    '& > th': {
      border: '1px solid #424542',
      borderStyle: 'solid none solid none',
      padding: '12px 24px',
      textAlign: 'left',
    },
    '& > th:first-child': {
      borderRadius: '4px 0 0 4px',
      borderLeftStyle: 'solid',
    },
    '& > th:last-child': {
      borderRadius: '0 4px 4px 0',
      borderRightStyle: 'solid',
    },
  },
  row: {
    backgroundColor: '#34383D',
    borderBottom: '2px solid transparent',
    color: '#FCFCFC',
    fontSize: '16px',
    height: '32px',
    fontWeight: 400,
    padding: '7px 24px',
    '& > td:first-of-type': {
      borderRadius: '4px 0px 0px 4px',
    },
    '& > td:last-of-type': {
      borderRadius: '0px 4px 4px 0px',
    },
    '&:hover': {
      background: '#424542',
    },
  },
  table: {
    borderCollapse: 'seperate',
    borderSpacing: '0 5px',
    minWidth: '100%',
  },
  tableBody: {
    '&::before': {
      content: '.',
      display: 'block',
      lineHeight: '10px',
      textIndent: '-99999px',
    },
  },
});

type SortedRows = {
  col: string;
  count: number;
  rows: string[];
};

type TableProps = {
  columns: string[];
  rows: any[];
};

export default function Table({ columns, rows }: TableProps): JSX.Element {
  const styles = useStyles();
  const [sortedRows, setSortedRows] = useState<SortedRows>({
    col: '',
    count: 0,
    rows: [],
  });

  const sortByColumn = (col: string) => {
    setSortedRows((prev) => {
      if (prev.col === col) {
        if (!prev.count) {
          const sortedRows = rows
            .slice()
            .sort((a, b) => sortArbitrayType(a[col], b[col]));
          return { col, count: 1, rows: sortedRows };
        } else {
          return { col: '', count: 0, rows: [] };
        }
      } else {
        const sortedRows = rows
          .slice()
          .sort((a, b) => sortArbitrayType(b[col], a[col]));
        return { col, count: 0, rows: sortedRows };
      }
    });
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.header}>
          {columns.map((col: string, index: number) => (
            <th
              key={`${col}-${index}`}
              style={{ paddingLeft: index === 0 ? '24px' : '50px' }}
            >
              <div
                onClick={() => sortByColumn(col)}
                style={{ cursor: 'pointer' }}
              >
                {col}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={styles.tableBody}>
        {(sortedRows.col ? sortedRows.rows : rows).map((row: any, rowIndex) => (
          <tr className={styles.row} key={rowIndex}>
            {Object.values(row).map((val: any, colIndex) => (
              <td
                key={`${rowIndex}-${colIndex}`}
                style={{
                  padding: '20px 24px',
                  paddingLeft: colIndex === 0 ? '24px' : '50px',
                  textAlign: 'left',
                }}
              >
                {val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
