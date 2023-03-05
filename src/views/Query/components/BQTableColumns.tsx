import { createUseStyles } from 'react-jss';
import Flex from 'components/Flex';
import Typography from 'components/Typography';
import { FiArrowLeft } from 'react-icons/fi';
import { SetStateAction, useEffect, useState } from 'react';
import { BiClipboard } from 'react-icons/bi';
import { FadeLoader } from 'react-spinners';
import { getTableColumns } from 'api/queryApi';

const useStyles = createUseStyles({
  icon: {
    color: '#FCFCFC',
    cursor: 'pointer',
  },
});

type BQTableColumnsProps = {
  columns: any[];
  clearTableSelection: () => void;
  setQuery: React.Dispatch<SetStateAction<string>>;
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
      console.log('Data: ', data);
      setTableColumns((prev: any) => ({ ...prev, [table.name]: data }));
    })();
    setLoading(false);
  }, [table]);

  return (
    <div style={{ height: '100%' }}>
      <Flex justifyContent='space-between' mt='12px'>
        <Flex alignItems='center' gap='8px' style={{ color: '#FCFCFC' }}>
          <FiArrowLeft
            className={styles.icon}
            onClick={() => clearTableSelection()}
          />
          <Typography variant='subtitle2'>{table.name}</Typography>
        </Flex>
        <BiClipboard
          className={styles.icon}
          onClick={() => setQuery((prev) => prev + table)}
          size={18}
        />
      </Flex>
      {loading && (
        <Flex
          alignItems='center'
          justifyContent='center'
          style={{ height: '80%' }}
        >
          <FadeLoader color='#5451FF' />
        </Flex>
      )}
    </div>
  );
}
