import { getAllEndpoints } from 'api/apiApi';
import Flex from 'components/Flex';
import Input from 'components/Input';
import Typography from 'components/Typography';
import MainLayout from 'layouts/MainLayout';
import { RootLocation } from 'locations';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiCopy } from 'react-icons/fi';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { BlockTrekkerTheme } from 'theme';
import { copyToClipboard, formatNumber, truncateAddress } from 'utils';
import { useAccount } from 'wagmi';

const { REACT_APP_API_URL: API_URL } = process.env;

const useStyles = createUseStyles((theme: BlockTrekkerTheme) => ({
  codeBlock: {
    backgroundColor: '#262726',
    borderRadius: '8px',
    boxSizing: 'border-box',
    color: '#FCFCFC',
    padding: '8px',
    position: 'relative',
    whiteSpace: 'pre-wrap',
    width: '100%',
  },
  container: {
    backgroundColor: '#424542',
    borderRadius: '8px',
    height: '80vh',
    padding: '16px',
    position: 'relative',
    width: 'min(850px, 100%)',
  },
  endpoints: {
    width: '15%',
  },
  endpointTab: {
    ...theme.typography.subtitle2,
    color: '#FCFCFC',
    cursor: 'pointer',
    overflow: 'hidden',
    padding: '5px 10px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '&:hover': {
      opacity: 0.8,
    },
    '&:first-of-type': {
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    },
    '&:last-of-type': {
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
    },
  },
  icon: {
    color: '#FCFCFC',
    cursor: 'pointer',
  },
  values: {
    width: '40%',
  },
}));

export default function Market(): JSX.Element {
  const { address } = useAccount();
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>({});
  const styles = useStyles();
  const navigate = useNavigate();

  const exampleRequest = `curl -X POST -H "Content-Type: application/json" -H "blocktrekker-api-key: <api_key>" -d '{"input": "<user_input>"}' ${API_URL}/api/custom/${selectedEndpoint.user}/${selectedEndpoint.name}`;

  const fullEndpoint = `${API_URL}/api/custom/${selectedEndpoint.user}/${selectedEndpoint.name}`;

  useEffect(() => {
    if (!address) return;
    (async () => {
      const res = await getAllEndpoints(address);
      const data = await res.json();
      if (data.length) {
        setSelectedEndpoint(data[0]);
      }
      setEndpoints(data);
      setLoading(false);
    })();
  }, [address]);

  return (
    <MainLayout>
      <FiArrowLeft
        className={styles.icon}
        onClick={() => navigate(RootLocation)}
      />
      <Flex
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: 'calc(100vh - 80px)' }}
      >
        <div className={styles.container}>
          {loading ? (
            <Flex
              alignItems="center"
              justifyContent="center"
              style={{ height: '100%' }}
            >
              <BeatLoader color="#5451FF" size={30} />
            </Flex>
          ) : (
            <>
              <Typography
                style={{ color: '#FCFCFC', marginBottom: '16px' }}
                variant="h6"
              >
                Endpoint Marketplace
              </Typography>
              {endpoints.length ? (
                <>
                  <Flex gap="32px">
                    <div className={styles.endpoints}>
                      {endpoints.map((endpoint, index) => (
                        <div
                          className={styles.endpointTab}
                          key={`${endpoint.name}-${index}`}
                          onClick={() => setSelectedEndpoint(endpoint)}
                          style={{
                            backgroundColor:
                              endpoint.name === selectedEndpoint.name
                                ? '#616661'
                                : '#34383D',
                          }}
                        >
                          {endpoint.name}
                        </div>
                      ))}
                    </div>
                    <div className={styles.values}>
                      <Input
                        disabled
                        onChange={() => null}
                        placeholder="Select table"
                        value={selectedEndpoint.table}
                        title="Table"
                      />
                      <Input
                        disabled
                        onChange={() => null}
                        placeholder="Select output column"
                        value={selectedEndpoint.outputColumn}
                        title="Output Column"
                        wrapperStyle={{ marginTop: '24px' }}
                      />
                      <Input
                        disabled
                        onChange={() => null}
                        placeholder="Select input column"
                        value={selectedEndpoint.inputColumn}
                        title="Input Column"
                        wrapperStyle={{ marginTop: '24px' }}
                      />
                      <Input
                        currency
                        disabled
                        onChange={() => null}
                        placeholder="Cost per call (USD)"
                        value={selectedEndpoint.cost}
                        title="Cost"
                        type={'number'}
                        wrapperStyle={{ marginTop: '24px' }}
                      />
                      <Input
                        disabled
                        placeholder="Endpoint name"
                        value={selectedEndpoint.name}
                        title="Name"
                        wrapperStyle={{ marginTop: '24px' }}
                      />
                    </div>
                    <div className={styles.values}>
                      <Typography
                        style={{ color: '#FCFCFC', marginBottom: '8px' }}
                        variant="subtitle2"
                      >
                        Owner
                      </Typography>
                      <div className={styles.codeBlock}>
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          {truncateAddress(selectedEndpoint.user)}
                          <FiCopy
                            className={styles.icon}
                            onClick={() =>
                              copyToClipboard(selectedEndpoint.user)
                            }
                          />
                        </Flex>
                      </div>
                      <Flex mb="8px" mt="24px" style={{ color: '#FCFCFC' }}>
                        <Typography variant="subtitle2">
                          Query format
                        </Typography>
                      </Flex>
                      <div className={styles.codeBlock}>
                        {selectedEndpoint.query}
                        <FiCopy
                          className={styles.icon}
                          onClick={() =>
                            copyToClipboard(selectedEndpoint.query)
                          }
                          style={{
                            position: 'absolute',
                            right: '8px',
                            top: '8px',
                          }}
                        />
                      </div>
                      <Flex
                        justifyContent="space-between"
                        mb="8px"
                        mt="24px"
                        style={{ color: '#FCFCFC' }}
                      >
                        <Typography variant="subtitle2">
                          Endpoint name
                        </Typography>
                        <Typography variant="subtitle2">
                          Cost: ${formatNumber(selectedEndpoint.cost, 4)}/call
                        </Typography>
                      </Flex>
                      <div className={styles.codeBlock}>
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <div
                            style={{
                              overflow: 'auto',
                              whiteSpace: 'nowrap',
                              width: '92%',
                            }}
                          >
                            {fullEndpoint}
                          </div>
                          <FiCopy
                            className={styles.icon}
                            onClick={() => copyToClipboard(fullEndpoint)}
                          />
                        </Flex>
                      </div>
                      <Typography
                        style={{ color: '#FCFCFC', marginBlock: '24px 4px' }}
                        variant="subtitle2"
                      >
                        Example Request
                      </Typography>
                      <div className={styles.codeBlock}>
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <div
                            style={{
                              overflow: 'auto',
                              whiteSpace: 'nowrap',
                              width: '92%',
                            }}
                          >
                            {exampleRequest}
                          </div>
                          <FiCopy
                            className={styles.icon}
                            onClick={() => copyToClipboard(exampleRequest)}
                          />
                        </Flex>
                      </div>
                    </div>
                  </Flex>
                </>
              ) : (
                <Flex
                  alignItems="center"
                  direction="column"
                  justifyContent="center"
                  gap="16px"
                  style={{ color: '#FCFCFC', height: '90%' }}
                >
                  <Typography variant="h5">No Endpoints</Typography>
                </Flex>
              )}
            </>
          )}
        </div>
      </Flex>
    </MainLayout>
  );
}
