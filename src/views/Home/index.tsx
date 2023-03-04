import MainLayout from 'layouts/MainLayout';
import { DashboardLocation, QueryLocation } from 'locations';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllQueries } from 'api/queryApi';
import Flex from 'components/Flex';
import { useAccount } from 'wagmi';
import { FiPlus } from 'react-icons/fi';
import Button from 'components/Button';
import APIKeyModal from './components/APIKeyModal';
import { BsFillKeyFill } from 'react-icons/bs';
import Typography from 'components/Typography';

const useStyles = createUseStyles({
  button: {
    backgroundColor: '#34383D',
    border: 'none',
    borderRadius: '4px',
    color: '#FCFCFC',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 800,
    outline: 'transparent',
    padding: '12px 15px',
  },
  container: {
    marginInline: 'auto',
    width: 'min(1100px, 100%)',
  },
  queries: {
    fontSize: '36px',
    marginBlock: '24px',
  },
  row: {
    border: '1px solid #FCFCFC',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBlock: '8px',
    padding: '8px 12px',
    transition: '.3s border-radius',
    '&:hover': {
      borderRadius: '0px',
    },
  },
});

export default function Home(): JSX.Element {
  const { address } = useAccount();
  const [queries, setQueries] = useState<string[]>([]);
  const [showAPIModal, setShowAPIModal] = useState(false);
  const navigate = useNavigate();
  const styles = useStyles();

  useEffect(() => {
    if (!address) return;
    (async () => {
      const res = await getAllQueries(address);
      const data = await res.json();
      setQueries(data.queries.map((query: any) => query.queryId));
    })();
  }, [address]);

  return (
    <MainLayout>
      <div className={styles.container}>
        <Flex gap='24px' justifyContent='flex-end' mt='24px'>
          <button
            className={styles.button}
            onClick={() => navigate(QueryLocation)}
          >
            <Flex alignItems='center' gap='8px'>
              <div>New Query</div>
              <FiPlus size={16} />
            </Flex>
          </button>
          <Button onClick={() => setShowAPIModal(true)}>
            <Flex alignItems='center' gap='8px'>
              <div>API Key</div>
              <BsFillKeyFill size={16} />
            </Flex>
          </Button>
          <button
            className={styles.button}
            onClick={() => navigate(DashboardLocation(address ?? ''))}
          >
            Dashboard
          </button>
        </Flex>
        {!!queries.length ? (
          <div style={{ color: 'white' }}>
            <div className={styles.queries}>Queries</div>
            {queries.map((query) => (
              <div
                className={styles.row}
                onClick={() => navigate(`${QueryLocation}/${query}`)}
              >
                {query}
              </div>
            ))}
          </div>
        ) : (
          <Flex
            alignItems='center'
            justifyContent='center'
            style={{ height: '50vh' }}
          >
            <Typography style={{ color: '#FCFCFC' }} variant='h4'>
              No queries
            </Typography>
          </Flex>
        )}
      </div>
      <APIKeyModal onClose={() => setShowAPIModal(false)} open={showAPIModal} />
    </MainLayout>
  );
}
