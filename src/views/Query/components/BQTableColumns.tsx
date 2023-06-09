import { getTableColumns } from 'api/queryApi';
import Flex from 'components/Flex';
import Typography from 'components/Typography';
import { SetStateAction, useEffect, useState } from 'react';
import { BiClipboard } from 'react-icons/bi';
import { FiArrowLeft, FiColumns } from 'react-icons/fi';
import { createUseStyles } from 'react-jss';
import { FadeLoader } from 'react-spinners';

const useStyles = createUseStyles({
  icon: {
    color: '#FCFCFC',
    cursor: 'pointer',
  },
  column: {
    alignItems: 'center',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    gap: '4px',
    padding: '2px',
    '&:hover': {
      backgroundColor: '#424542',
    },
  },
  columnList: {
    bottom: '8px',
    marginLeft: '22px',
    position: 'absolute',
    overflowY: 'auto',
    top: '80px',
    width: 'calc(100% - 38px)',
  },
});

type BQTableColumnsProps = {
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[];
  clearTableSelection: () => void;
  setQuery: React.Dispatch<SetStateAction<string>>;
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTableColumns: React.Dispatch<SetStateAction<any>>;
  table: { dataset: string; name: string };
};

export default function BQTableColumns({
  columns,
  clearTableSelection,
  setQuery,
  setTableColumns,
  table,
}: BQTableColumnsProps): JSX.Element {
  const styles = useStyles();
  const [loading, setLoading] = useState(!columns.length);

  useEffect(() => {
    if (!table.name) return;
    (async () => {
      const res = await getTableColumns(table.dataset, table.name);
      const data = await res.json();
      // TODO: Change from any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTableColumns((prev: any) => ({ ...prev, [table.name]: data }));
    })();
    setLoading(false);
  }, [setTableColumns, table]);

  return (
    <div style={{ height: '100%' }}>
      <Flex justifyContent="space-between" mt="12px">
        <Flex alignItems="center" gap="8px" style={{ color: '#FCFCFC' }}>
          <FiArrowLeft
            className={styles.icon}
            onClick={() => clearTableSelection()}
          />
          <Typography variant="subtitle2">{table.name}</Typography>
        </Flex>
        <BiClipboard
          className={styles.icon}
          onClick={() =>
            setQuery((prev) => prev + `${table.dataset}.${table.name}`)
          }
          size={18}
        />
      </Flex>
      {loading ? (
        <Flex
          alignItems="center"
          justifyContent="center"
          style={{ height: '80%' }}
        >
          <FadeLoader color="#5451FF" />
        </Flex>
      ) : (
        <div className={styles.columnList}>
          {columns.map(({ name, type }) => (
            <Flex
              alignItems="center"
              key={name}
              justifyContent="space-between"
              style={{ color: '#FCFCFC' }}
            >
              <div
                className={styles.column}
                onClick={() => setQuery((prev) => prev + name)}
              >
                <FiColumns />
                <div>{name}</div>
              </div>
              <div>{type}</div>
            </Flex>
          ))}
        </div>
      )}
    </div>
  );
}
