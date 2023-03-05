import MainLayout from 'layouts/MainLayout';
import { createUseStyles } from 'react-jss';
import Flex from 'components/Flex';
import Typography from 'components/Typography';
import Button from 'components/Button';
import { FiArrowLeft, FiCopy, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useEffect, useMemo, useState } from 'react';
import Dropdown from 'components/Dropdown';
import { getTables } from 'api/queryApi';
import { useAccount } from 'wagmi';
import Input from 'components/Input';
import { AiFillCloseCircle, AiFillSave } from 'react-icons/ai';
import { formatNumber } from 'utils';
import { BeatLoader } from 'react-spinners';
import { deleteEndpoint, getEndpointsByUser, saveEndpoint } from 'api/apiApi';
import { BlockTrekkerTheme } from 'theme';
import ConfirmationModal from 'components/Modal/ConfirmationModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { RootLocation } from 'locations';
import { copyToClipboard } from 'utils';

const useStyles = createUseStyles((theme: BlockTrekkerTheme) => ({
  container: {
    backgroundColor: '#424542',
    borderRadius: '8px',
    height: '80vh',
    padding: '16px',
    position: 'relative',
    width: 'min(850px, 100%)',
  },
  codeBlock: {
    backgroundColor: '#262726',
    borderRadius: '8px',
    boxSizing: 'border-box',
    color: '#FCFCFC',
    padding: '8px',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    width: '100%',
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
  queryOverview: {
    width: '50%',
  },
  values: ({ creatingNew }: { creatingNew: boolean }) => ({
    width: creatingNew ? '50%' : '40%',
  }),
}));

export default function Endpoints(): JSX.Element {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [costPerHit, setCostPerHit] = useState('');
  const [creatingNew, setCreatingNew] = useState(false);
  const styles = useStyles({ creatingNew });
  const [endPoints, setEndpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>({});
  const [selectedInputColumn, setSelectedInputColumn] = useState('');
  const [selectedOutputColumn, setSelectedOutputColumn] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [tables, setTables] = useState<any[]>([]);

  const { REACT_APP_API_URL: API_URL } = process.env;

  const availableInputColumns = useMemo(() => {
    const table = tables.find((table) => table.name === selectedTable);
    if (!table) return [];
    return table.columnNames.filter(
      (column: string) =>
        column !== selectedOutputColumn && column !== selectedInputColumn
    );
  }, [selectedInputColumn, selectedOutputColumn, selectedTable, tables]);

  const availableOutputColumns = useMemo(() => {
    const table = tables.find((table) => table.name === selectedTable);
    if (!table) return [];
    return table.columnNames.filter(
      (column: string) => column !== selectedOutputColumn
    );
  }, [selectedOutputColumn, selectedTable, tables]);

  const availableTableNames = useMemo(() => {
    return tables
      .map((table) => table.name)
      .filter((name) => name !== selectedTable);
  }, [selectedTable, tables]);

  const disabled = useMemo(() => {
    return (
      !costPerHit ||
      !name ||
      !selectedInputColumn ||
      !selectedOutputColumn ||
      !selectedTable
    );
  }, [
    costPerHit,
    name,
    selectedInputColumn,
    selectedOutputColumn,
    selectedTable,
  ]);

  const exampleRequest = useMemo(() => {
    if (!selectedEndpoint.name || !selectedEndpoint.user) return '';
    return `curl -X POST -H "Content-Type: application/json" -H "blocktrekker-api-key: <api_key>" -d '{"input": "<user_input>"}' ${API_URL}/api/custom/${selectedEndpoint.user}/${selectedEndpoint.name}`;
  }, [API_URL, selectedEndpoint]);

  const fullEndpoint = useMemo(() => {
    if (!selectedEndpoint.name || !selectedEndpoint.user) return '';
    return `${API_URL}/api/custom/${selectedEndpoint.user}/${selectedEndpoint.name}`;
  }, [API_URL, selectedEndpoint]);

  const query = useMemo(() => {
    if (!creatingNew && !endPoints.length) return;
    const from = `FROM ${
      creatingNew ? selectedTable || '<table_name>' : selectedEndpoint.table
    }`;
    const limit = 'LIMIT 1';
    const select = `SELECT ${
      creatingNew
        ? selectedOutputColumn || '<output_column>'
        : selectedEndpoint.outputColumn
    }`;
    const where = `WHERE ${
      creatingNew
        ? selectedInputColumn || '<input_column>'
        : selectedEndpoint.inputColumn
    } = <user_input>`;
    return `${select}\n${from}\n${where}\n${limit}`;
  }, [
    creatingNew,
    endPoints,
    selectedEndpoint,
    selectedInputColumn,
    selectedOutputColumn,
    selectedTable,
  ]);

  const removeEndpoint = async () => {
    if (!address) return;
    const index = endPoints.findIndex(
      ({ name }) => name === selectedEndpoint.name
    );
    await deleteEndpoint(address, selectedEndpoint.name);
    toast.success('Endpoint removed');
    setEndpoints((prev) => {
      prev.splice(index, 1);
      if (prev.length === 1 || index === 0) {
        setSelectedEndpoint(prev[0]);
      } else if (!prev.length) {
        selectedEndpoint({});
      } else {
        setSelectedEndpoint(prev[index]);
      }
      return prev;
    });
    setShowRemovalModal(false);
  };

  const renderNew = () => {
    setCostPerHit('');
    setName('');
    setSelectedInputColumn('');
    setSelectedOutputColumn('');
    setSelectedTable('');
    setCreatingNew(true);
  };

  const save = async () => {
    const { columnNames, columnTypes, queryId } = tables.find(
      (table) => selectedTable === table.name
    );
    const metadata = {
      cost: costPerHit,
      inputColumn: selectedInputColumn,
      name,
      outputColumn: selectedOutputColumn,
      table: selectedTable,
    };
    await saveEndpoint({
      user: address,
      ...metadata,
      columnNames,
      columnTypes,
      query,
      queryId,
    });
    toast.success('Endpoint saved');
    setSelectedEndpoint(metadata);
    setEndpoints((prev) => [...prev, metadata]);
    setCreatingNew(false);
  };

  useEffect(() => {
    if (!address) return;
    (async () => {
      const endpointsRes = await getEndpointsByUser(address);
      const endpointsData = await endpointsRes.json();
      const tableRes = await getTables(address);
      const tableData = await tableRes.json();
      setTables(tableData);
      if (endpointsData.length) {
        setSelectedEndpoint(endpointsData[0]);
      }
      setEndpoints(endpointsData);
      setLoading(false);
    })();
  }, [address]);

  useEffect(() => {
    setSelectedInputColumn('');
    setSelectedOutputColumn('');
  }, [selectedTable]);

  return (
    <MainLayout>
      <FiArrowLeft
        className={styles.icon}
        onClick={() => navigate(RootLocation)}
      />
      <Flex
        alignItems='center'
        justifyContent='center'
        style={{ minHeight: 'calc(100vh - 80px)' }}
      >
        <div className={styles.container}>
          {loading ? (
            <Flex
              alignItems='center'
              justifyContent='center'
              style={{ height: '100%' }}
            >
              <BeatLoader color='#5451FF' size={30} />
            </Flex>
          ) : (
            <>
              <Typography
                style={{ color: '#FCFCFC', marginBottom: '16px' }}
                variant='h6'
              >
                Custom Endpoints
              </Typography>
              {endPoints.length || creatingNew ? (
                <>
                  <Flex gap='32px'>
                    {!creatingNew && (
                      <div className={styles.endpoints}>
                        <Button onClick={() => renderNew()}>
                          <Flex alignItems='center' gap='8px'>
                            <div>New</div>
                            <FiPlus size={16} />
                          </Flex>
                        </Button>
                        <div style={{ marginTop: '8px' }}>
                          {endPoints.map((endpoint, index) => (
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
                      </div>
                    )}
                    <div className={styles.values}>
                      <Dropdown
                        disabled={!creatingNew}
                        onSelect={setSelectedTable}
                        options={availableTableNames}
                        placeholder='Select table'
                        selectedOption={
                          creatingNew ? selectedTable : selectedEndpoint.table
                        }
                        title='Table'
                      />
                      <Dropdown
                        disabled={!creatingNew || !selectedTable}
                        onSelect={setSelectedOutputColumn}
                        options={availableOutputColumns}
                        placeholder='Select output column'
                        selectedOption={
                          creatingNew
                            ? selectedOutputColumn
                            : selectedEndpoint.outputColumn
                        }
                        title='Output Column'
                        wrapperStyle={{ marginTop: '24px' }}
                      />
                      <Dropdown
                        disabled={
                          !creatingNew ||
                          !selectedTable ||
                          !selectedOutputColumn
                        }
                        onSelect={setSelectedInputColumn}
                        options={availableInputColumns}
                        placeholder='Select input column'
                        selectedOption={
                          creatingNew
                            ? selectedInputColumn
                            : selectedEndpoint.inputColumn
                        }
                        title='Input Column'
                        wrapperStyle={{ marginTop: '24px' }}
                      />
                      <Input
                        currency
                        disabled={!creatingNew}
                        onChange={(e) => setCostPerHit(e.target.value)}
                        placeholder='Cost per call (USD)'
                        value={creatingNew ? costPerHit : selectedEndpoint.cost}
                        title='Cost'
                        type={'number'}
                        wrapperStyle={{ marginTop: '24px' }}
                      />
                      <Input
                        disabled={!creatingNew}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Endpoint name'
                        value={creatingNew ? name : selectedEndpoint.name}
                        title='Name'
                        wrapperStyle={{ marginTop: '24px' }}
                      />
                    </div>
                    <div className={styles.values}>
                      <Flex justifyContent='flex-end'>
                        {!creatingNew && (
                          <Button onClick={() => setShowRemovalModal(true)}>
                            <Flex alignItems='center' gap='8px'>
                              <div>Remove</div>
                              <FiTrash2 size={16} />
                            </Flex>
                          </Button>
                        )}
                      </Flex>
                      <Flex mb='8px' mt='24px' style={{ color: '#FCFCFC' }}>
                        <Typography variant='subtitle2'>
                          Query format
                        </Typography>
                      </Flex>
                      <div className={styles.codeBlock}>{query}</div>
                      <Flex
                        justifyContent='space-between'
                        mb='8px'
                        mt='24px'
                        style={{ color: '#FCFCFC' }}
                      >
                        <Typography variant='subtitle2'>
                          Endpoint name
                        </Typography>
                        <Typography variant='subtitle2'>
                          Cost: $
                          {creatingNew
                            ? costPerHit
                              ? formatNumber(costPerHit, 4)
                              : '<cost>'
                            : selectedEndpoint.cost}
                          /call
                        </Typography>
                      </Flex>
                      {!creatingNew ? (
                        <div className={styles.codeBlock}>
                          <Flex
                            alignItems='center'
                            justifyContent='space-between'
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
                      ) : (
                        <div className={styles.codeBlock}>
                          <div>
                            /
                            {creatingNew
                              ? name || '<endpoint_name>'
                              : selectedEndpoint.name}
                          </div>
                        </div>
                      )}
                      {!creatingNew && (
                        <>
                          <Typography
                            style={{
                              color: '#FCFCFC',
                              marginBlock: '24px 4px',
                            }}
                            variant='subtitle2'
                          >
                            Example Request
                          </Typography>
                          <div className={styles.codeBlock}>
                            <Flex
                              alignItems='center'
                              justifyContent='space-between'
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
                        </>
                      )}
                    </div>
                  </Flex>
                  {creatingNew && (
                    <Flex
                      gap='16px'
                      style={{
                        bottom: '16px',
                        position: 'absolute',
                        right: '16px',
                      }}
                    >
                      <Button onClick={() => setCreatingNew(false)}>
                        <Flex alignItems='center' gap='8px'>
                          <div>Cancel</div>
                          <AiFillCloseCircle size={16} />
                        </Flex>
                      </Button>
                      <Button disabled={disabled} onClick={() => save()}>
                        <Flex alignItems='center' gap='8px'>
                          <div>Save</div>
                          <AiFillSave size={16} />
                        </Flex>
                      </Button>
                    </Flex>
                  )}
                </>
              ) : (
                <Flex
                  alignItems='center'
                  direction='column'
                  justifyContent='center'
                  gap='16px'
                  style={{ color: '#FCFCFC', height: '100%' }}
                >
                  <Typography variant='h5'>
                    You have not created any endpoints
                  </Typography>
                  <Button onClick={() => renderNew()}>
                    <Flex alignItems='center' gap='8px'>
                      <div>New</div>
                      <FiPlus size={16} />
                    </Flex>
                  </Button>
                </Flex>
              )}
            </>
          )}
        </div>
      </Flex>
      <ConfirmationModal
        actionText='Remove'
        onClose={() => setShowRemovalModal(false)}
        onFinish={() => removeEndpoint()}
        open={showRemovalModal}
        title='Remove Endpoint?'
      />
    </MainLayout>
  );
}
