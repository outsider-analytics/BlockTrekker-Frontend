import Flex from 'components/Flex';
import { useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
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
  paginateButton: {
    alignItems: 'center',
    backgroundColor: '#34383D',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    padding: '6px',
  },
  row: {
    backgroundColor: '#34383D',
    borderBottom: '2px solid transparent',
    color: '#FCFCFC',
    fontSize: '16px',
    height: '24px',
    fontWeight: 400,
    padding: '4px 24px',
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
  pageSize?: number;
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
};

export default function Table({
  columns,
  pageSize = 25,
  rows,
}: TableProps): JSX.Element {
  const styles = useStyles();
  const [currentPage, setCurrentPage] = useState(0);
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

  const switchPage = (direction: number) => {
    setCurrentPage((prev) => {
      if (!prev && direction < 0) {
        return prev;
      } else if ((prev + direction) * pageSize >= rows.length) {
        return prev;
      } else {
        return prev + direction;
      }
    });
  };

  return (
    <div>
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
          {(sortedRows.col ? sortedRows.rows : rows)
            .slice(pageSize * currentPage, currentPage * pageSize + pageSize)
            // TODO: Change from any
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((row: any, rowIndex) => (
              <tr className={styles.row} key={rowIndex}>
                {/* TODO: Change from any */}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {Object.values(row).map((val: any, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                      padding: '20px 24px',
                      paddingLeft: colIndex === 0 ? '24px' : '50px',
                      textAlign: 'left',
                    }}
                  >
                    {typeof val === 'object' ? val?.value ?? '' : val}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {rows.length > pageSize && (
        <Flex
          justifyContent="space-between"
          mt="24px"
          style={{ color: '#FCFCFC' }}
        >
          <div className={styles.paginateButton} onClick={() => switchPage(-1)}>
            <FiArrowLeft />
          </div>
          <Flex gap="6px">
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => setCurrentPage(Math.ceil(0))}
            >
              {currentPage + 1}
            </div>
            <div>of</div>
            <div
              onClick={() =>
                setCurrentPage(Math.ceil(rows.length / pageSize) - 1)
              }
              style={{ cursor: 'pointer' }}
            >
              {Math.ceil(rows.length / pageSize)}
            </div>
          </Flex>
          <div className={styles.paginateButton} onClick={() => switchPage(1)}>
            <FiArrowRight />
          </div>
        </Flex>
      )}
    </div>
  );
}
