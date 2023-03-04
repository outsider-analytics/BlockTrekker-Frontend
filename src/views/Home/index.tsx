import MainLayout from 'layouts/MainLayout';
import { DashboardLocation, EndpointsLocation, QueryLocation } from 'locations';
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
import { AiOutlineAreaChart, AiOutlineCloudServer } from 'react-icons/ai';
import Typography from 'components/Typography';

const useStyles = createUseStyles({
  container: {
    marginInline: 'auto',
    width: 'min(1100px, 100%)',
  },
  queries: {
    color: '#FCFCFC',
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
  const [queries, setQueries] = useState<any[]>([]);
  const [showAPIModal, setShowAPIModal] = useState(false);
  const navigate = useNavigate();
  const styles = useStyles();

  useEffect(() => {
    if (!address) return;
    (async () => {
      const res = await getAllQueries(address);
      const data = await res.json();
      setQueries(data.queries);
    })();
  }, [address]);

  return (
    <MainLayout>
      <div className={styles.container}>
        <Flex gap='24px' justifyContent='flex-end' mt='24px'>
          <Button onClick={() => navigate(QueryLocation)}>
            <Flex alignItems='center' gap='8px'>
              <div>New Query</div>
              <FiPlus size={16} />
            </Flex>
          </Button>
          <Button onClick={() => setShowAPIModal(true)}>
            <Flex alignItems='center' gap='8px'>
              <div>API Key</div>
              <BsFillKeyFill size={16} />
            </Flex>
          </Button>
          <Button onClick={() => navigate(EndpointsLocation)}>
            <Flex alignItems='center' gap='8px'>
              <div>Custom Endpoints</div>
              <AiOutlineCloudServer size={16} />
            </Flex>
          </Button>
          <Button onClick={() => navigate(DashboardLocation(address ?? ''))}>
            Dashboard
          </Button>
        </Flex>
        {!!queries.length ? (
          <div>
            <div className={styles.queries}>Queries</div>
            {queries.map(({ name, queryId, visualizationCount }) => (
              <div
                className={styles.row}
                onClick={() => navigate(`${QueryLocation}/${queryId}`)}
              >
                <Flex alignItems='center' justifyContent='space-between'>
                  <Typography style={{ color: '#FCFCFC' }} variant='subtitle1'>
                    {name}
                  </Typography>
                  {!!visualizationCount && (
                    <Flex
                      alignItems='center'
                      gap='16px'
                      style={{ color: '#FCFCFC' }}
                    >
                      <Typography variant='subtitle1'>
                        Visualizations
                      </Typography>
                      <AiOutlineAreaChart size={20} />
                      <Typography variant='subtitle1'>
                        {visualizationCount}
                      </Typography>
                    </Flex>
                  )}
                </Flex>
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
