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
import { truncateAddress } from 'utils';

const useStyles = createUseStyles({
  back: {
    color: '#FCFCFC',
    cursor: 'pointer',
  },
  completedIn: {
    fontSize: '16px',
    fontWeight: 500,
  },
  container: {
    padding: '32px',
  },
  queryContainer: {
    textAlign: 'right',
    width: '80%',
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
});

const DOWNLOAD_OPTIONS = ['CSV', 'JSON'];

export default function Query(): JSX.Element {
  const { address } = useAccount();
  const { id } = useParams();
  const navigate = useNavigate();
  const [, setCompleteIn] = useState(0);
  const [description, setDescription] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [exporting, setExporting] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState('');
  const [oldQuery, setOldQuery] = useState('');
  const [query, setQuery] = useState('');
  const [queryResults, setQueryResults] = useState({
    columns: [] as string[],
    rows: [],
  });
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [showVisualizationModal, setShowVisualizationModal] = useState(false);
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
    if (!id) return;
    setExporting(type);
    const res = await downloadResults(id, type);
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
    if (isExecuting) return 'Executing...';
    else if (!id) {
      return 'Execute';
    } else {
      return oldQuery === query ? 'Execute' : 'Save & Execute';
    }
  }, [id, isExecuting, oldQuery, query]);

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
    if (!id) return;
    (async () => {
      const res = await getQuery(id);
      const data = await res.json();
      setOldQuery(data.query.query);
      setQuery(data.query.query);
      const columns = Object.keys(data.query.results[0]);
      setDescription(data.query.description);
      setName(data.query.name);
      setQueryResults({ columns, rows: data.query.results });
      setVisualizations(data.query.visualizations ?? []);
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
            <div className={styles.queryContainer}>
              <Flex justifyContent='space-between' mb='24px'>
                <FiArrowLeft
                  className={styles.back}
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
                <Button
                  disabled={!query}
                  onClick={() => !isExecuting && execute()}
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
