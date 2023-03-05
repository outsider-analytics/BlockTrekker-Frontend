import Flex from 'components/Flex';
import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { ClockLoader } from 'react-spinners';
import { FiArrowLeft, FiDownload, FiSave } from 'react-icons/fi';
import MainLayout from 'layouts/MainLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import VisualizationModal from 'components/Modal/VisualizationModal';
import {
  downloadResults,
  executeQuery,
  getPublicDatasets,
  getQuery,
  saveQuery,
} from 'api/queryApi';
import { saveVisualization } from 'api/visualizationApi';
import QueryLoader from './components/QueryLoader';
import DataSection from './components/DataSection';
import { RootLocation } from 'locations';
import QueryModal from './components/QueryModal';
import Typography from 'components/Typography';
import { AiFillEdit } from 'react-icons/ai';
import Button from 'components/Button';
import { formatNumber, truncateAddress } from 'utils';
import { BlockTrekkerTheme } from 'theme';
import { BiClipboard, BiTable } from 'react-icons/bi';
import BQTableColumns from './components/BQTableColumns';
import { executeWithDryRun } from 'api/queryApi';
import ConfirmationModal from 'components/Modal/ConfirmationModal';

const useStyles = createUseStyles((theme: BlockTrekkerTheme) => ({
  completedIn: {
    fontSize: '16px',
    fontWeight: 500,
  },
  container: {
    padding: '32px',
  },
  dryRun: {
    backgroundColor: '#BF3B2F',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontWeight: 900,
    padding: '8px',
  },
  icon: {
    color: '#FCFCFC',
    cursor: 'pointer',
  },
  queryContainer: {
    textAlign: 'right',
    width: '75%',
  },
  queryInput: {
    backgroundColor: '#34383D',
    borderRadius: '8px',
    boxSizing: 'border-box',
    caretColor: '#FCFCFC',
    color: '#9191F7',
    height: '300px',
    padding: '8px',
    outline: 'none',
    resize: 'none',
    width: '100%',
  },
  tables: {
    width: '35%',
    '& > div': {
      backgroundColor: '#34383D',
      border: '1px solid #717371',
      borderRadius: '10px',
      height: '100%',
      padding: '8px',
      position: 'relative',
    },
  },
  tableList: {
    bottom: '8px',
    position: 'absolute',
    overflowY: 'auto',
    top: '48px',
    width: 'calc(100% - 16px)',
  },
  tableRowLeft: {
    ...theme.typography.subtitle2,
    alignItems: 'center',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    gap: '4px',
    padding: '2px',
    width: '85%',
    '& > div:last-child': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    '&:hover': {
      backgroundColor: '#424542',
    },
  },
  title: {
    color: '#FCFCFC',
    fontSize: '72px',
    textAlign: 'center',
  },
  // eslint-disable-next-line
  ['@media(max-width: 600px)']: {
    queryContainer: {
      width: '100%',
    },
  },
}));

const DOWNLOAD_OPTIONS = ['CSV', 'JSON'];

export default function Query(): JSX.Element {
  const { address } = useAccount();
  const { id } = useParams();
  const navigate = useNavigate();
  const [, setCompleteIn] = useState(0);
  const [cost, setCost] = useState(-1);
  const [description, setDescription] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [exporting, setExporting] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState('');
  const [oldQuery, setOldQuery] = useState('');
  const [query, setQuery] = useState('');
  const [queryResults, setQueryResults] = useState({
    columns: [] as string[],
    rows: [],
  });
  const [selectedTable, setSelectedTable] = useState<{
    dataset: string;
    name: string;
  }>({ dataset: '', name: '' });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [showVisualizationModal, setShowVisualizationModal] = useState(false);
  const [tables, setTables] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<any>({});
  const [visualizations, setVisualizations] = useState<any[]>([]);
  const styles = useStyles();

  const addVisualization = async (payload: any) => {
    if (!id) return;
    await saveVisualization(id, {
      id: `${id}-${visualizations.length}`,
      ...payload,
    });
    setVisualizations((prev: any) => [...prev, payload]);
    setShowVisualizationModal(false);
  };

  const displayTimer = (timer: number) => {
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;

    const formattedSec = seconds < 10 ? `0${seconds}` : seconds.toString();
    return `${minutes}:${formattedSec}`;
  };

  const download = async (type: string) => {
    if (!address || !id) return;
    setExporting(type);
    const res = await downloadResults(id, type, address);
    const disposition = res.headers.get('content-disposition');
    const fileName = disposition!.substring(21).replace(/^"(.*)"$/, '$1');
    const data = await res.blob();
    let elm = document.createElement('a');
    elm.href = URL.createObjectURL(data);
    elm.setAttribute('download', fileName);
    elm.click();
    elm.remove();
    setExporting('');
  };

  const dryRun = async () => {
    setIsExecuting(true);
    const payload = { query };
    const res = await executeWithDryRun(payload);
    const { cost } = await res.json();
    setIsExecuting(false);
    setCost(cost);
  };

  const dryRunText = cost > 0 ? ` $${formatNumber(cost, 4)}` : ' subcent';

  const execute = async () => {
    setIsExecuting(true);
    const payload = { id: '', name, query, user: address };
    if (id) {
      payload.id = id;
    }
    const res = await executeQuery(payload);
    const data = await res.json();
    const columns = Object.keys(data.rows[0]);
    setQueryResults({ columns, rows: data.rows });
    setCompleteIn(elapsed);
    setElapsed(0);
    setIsExecuting(false);
  };

  const executeText = useMemo(() => {
    if (cost < 0) {
      if (isExecuting) {
        return 'Executing Dry Run...';
      }
      return 'Execute with Dry Run';
    } else if (isExecuting) return 'Executing...';
    else if (!id) {
      return 'Execute';
    } else {
      return oldQuery === query ? 'Execute' : 'Save & Execute';
    }
  }, [cost, id, isExecuting, oldQuery, query]);

  const handleTableSelect = (table: string) => {
    const found = tables.find((tbl) =>
      (Object.values(tbl) as string[])[0].includes(table)
    );
    if (found) {
      const dataset = Object.keys(found)[0];
      setSelectedTable({ dataset, name: table });
    }
  };

  const loadExistingQuery = async (id: string) => {
    const res = await getQuery(id);
    const data = await res.json();
    setOldQuery(data.query.query);
    setQuery(data.query.query);
    setDescription(data.query.description);
    setName(data.query.name);
    setQueryResults({
      columns: data.query.columns,
      rows: data.query.results,
    });
    setVisualizations(data.query.visualizations ?? []);
  };

  const save = async (queryDesc: string, queryName: string) => {
    setIsSaving(true);
    const res = await saveQuery({
      columns: queryResults.columns,
      description: queryDesc,
      name: queryName,
      query,
      user: address,
    });
    const { queryId } = await res.json();
    navigate(queryId, { replace: true });
    setIsSaving(false);
    setShowQueryModal(false);
  };

  const tableNames = useMemo(() => {
    return tables.reduce((acc, obj) => {
      const values = Object.values(obj)[0] as string[];
      return [...acc, ...values];
    }, []);
  }, [tables]);

  const updateMetadata = async (queryDesc: string, queryName: string) => {
    setIsSaving(true);
    await saveQuery({ queryId: id, description: queryDesc, name: queryName });
    setDescription(queryDesc);
    setName(queryName);
    setIsSaving(false);
    setShowQueryModal(false);
  };

  useEffect(() => {
    if (!isExecuting) return;
    const interval = setInterval(() => {
      setElapsed((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [elapsed, isExecuting]);

  useEffect(() => {
    (async () => {
      const res = await getPublicDatasets();
      const data = await res.json();
      setTables(data);
      if (id) {
        await loadExistingQuery(id);
      }
      setIsLoading(false);
    })();
  }, [id]);

  return (
    <MainLayout>
      <div className={styles.container}>
        {isLoading ? (
          <QueryLoader />
        ) : (
          <>
            {name && (
              <Typography
                style={{ color: '#FCFCFC', marginBottom: '8px' }}
                variant='h6'
              >
                {truncateAddress(address ?? '')}/{name}
              </Typography>
            )}
            {description && (
              <Typography
                style={{
                  color: '#E7F1EF',
                  marginBottom: '24px',
                  maxWidth: '500px',
                }}
                variant='caption'
              >
                {description}
              </Typography>
            )}
            <Flex gap='24px'>
              <div className={styles.tables}>
                <div>
                  <Typography style={{ color: '#FCFCFC' }} variant='h5'>
                    Tables
                  </Typography>
                  {selectedTable.name ? (
                    <BQTableColumns
                      clearTableSelection={() =>
                        setSelectedTable({ dataset: '', name: '' })
                      }
                      columns={tableColumns[selectedTable.name] ?? []}
                      setQuery={setQuery}
                      setTableColumns={setTableColumns}
                      table={selectedTable}
                    />
                  ) : (
                    <div
                      className={styles.tableList}
                      style={{ color: '#FCFCFC' }}
                    >
                      {tableNames.map((table: string) => (
                        <div key={table}>
                          <Flex
                            alignItems='center'
                            justifyContent='space-between'
                          >
                            <div
                              className={styles.tableRowLeft}
                              onClick={() => handleTableSelect(table)}
                            >
                              <BiTable style={{ flexShrink: 0 }} />
                              <div>{table}</div>
                            </div>
                            <BiClipboard
                              className={styles.icon}
                              onClick={() => setQuery((prev) => prev + table)}
                              size={18}
                            />
                          </Flex>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.queryContainer}>
                <Flex justifyContent='space-between' mb='24px'>
                  <FiArrowLeft
                    className={styles.icon}
                    onClick={() => navigate(RootLocation)}
                  />
                  {!!queryResults.columns.length && !id && (
                    <Button onClick={() => setShowQueryModal(true)}>
                      <Flex alignItems='center' gap='8px'>
                        <div>{isSaving ? 'Saving...' : 'Save'}</div>
                        <FiSave size={20} />
                      </Flex>
                    </Button>
                  )}
                  {!!queryResults.columns.length && id && (
                    <Flex alignItems='center' gap='24px'>
                      <Button onClick={() => setShowQueryModal(true)}>
                        <Flex alignItems='center' gap='8px'>
                          <div>Edit</div>
                          <AiFillEdit size={20} />
                        </Flex>
                      </Button>
                      {DOWNLOAD_OPTIONS.map((option) => (
                        <Button key={option} onClick={() => download(option)}>
                          <Flex alignItems='center' gap='8px'>
                            {exporting === option ? 'Exporting...' : 'Export'}{' '}
                            {option}
                            <FiDownload size={20} />
                          </Flex>
                        </Button>
                      ))}
                    </Flex>
                  )}
                </Flex>
                <textarea
                  className={styles.queryInput}
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                />
                <Flex
                  alignItems='center'
                  justifyContent='flex-end'
                  gap='24px'
                  mt='24px'
                >
                  {id && (
                    <Button
                      onClick={() => setShowVisualizationModal(true)}
                      text='New Visualization'
                    />
                  )}
                  {cost >= 0 && (
                    <>
                      <div className={styles.dryRun}>
                        Your query is estimated to be {dryRunText}
                      </div>
                      {!isExecuting && (
                        <Button
                          disabled={!query}
                          onClick={() => dryRun()}
                          text='Re-execute Dry Run'
                        />
                      )}
                    </>
                  )}
                  <Button
                    disabled={!query}
                    onClick={() =>
                      !isExecuting && cost >= 0
                        ? setShowConfirmation(true)
                        : dryRun()
                    }
                    style={{
                      cursor: !query ? 'not-allowed' : 'pointer',
                      opacity: !query ? 0.5 : 1,
                    }}
                  >
                    <Flex alignItems='center' gap='12px'>
                      <div>{executeText}</div>
                      {isExecuting && (
                        <Flex alignItems='center' gap='12px'>
                          <div>{displayTimer(elapsed)}</div>
                          <ClockLoader color='#FCFCFC' size={20} />
                        </Flex>
                      )}
                    </Flex>
                  </Button>
                </Flex>
              </div>
            </Flex>
            <DataSection
              isExecuting={isExecuting}
              queryId={id ?? ''}
              results={queryResults}
              setVisualizations={setVisualizations}
              visualizations={visualizations}
            />
          </>
        )}
      </div>
      <ConfirmationModal
        actionText='Execute'
        caption={`Your query will be ${dryRunText}. Are you sure you'd like to execute?`}
        onClose={() => setShowConfirmation(false)}
        onFinish={() => {
          execute();
          setShowConfirmation(false);
        }}
        open={showConfirmation}
        title='Wait!!'
      />
      <QueryModal
        description={description}
        edit={!!id}
        name={name}
        onClose={() => setShowQueryModal(false)}
        onFinish={(queryDesc, queryName) =>
          id ? updateMetadata(queryDesc, queryName) : save(queryDesc, queryName)
        }
        open={showQueryModal}
      />
      <VisualizationModal
        columns={queryResults.columns}
        onClose={() => setShowVisualizationModal(false)}
        onFinish={addVisualization}
        open={showVisualizationModal}
        rows={queryResults.rows}
      />
    </MainLayout>
  );
}
