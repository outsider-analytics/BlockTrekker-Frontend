import Flex from 'components/Flex';
import Table from 'components/Table';
import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { ClockLoader } from 'react-spinners';
import { ArrowLeft, Download, Save } from 'react-feather';
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
import RemoveModal from './components/RemoveModal';

const useStyles = createUseStyles({
  back: {
    color: '#FCFCFC',
    cursor: 'pointer',
  },
  button: {
    backgroundColor: '#34383D',
    border: 'none',
    borderRadius: '4px',
    color: '#FCFCFC',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 800,
    opacity: 1,
    outline: 'transparent',
    padding: '12px 15px',
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
  const [elapsed, setElapsed] = useState(0);
  const [exporting, setExporting] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSaving, setIsSaving] = useState(false);
  const [oldQuery, setOldQuery] = useState('');
  const [showVisualizationModal, setShowVisualizationModal] = useState(false);
  const [query, setQuery] = useState('');
  const [queryResults, setQueryResults] = useState({
    columns: [] as string[],
    rows: [],
  });
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
    console.log('Filename: ', fileName);
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
    const payload = { id: '', query, user: address };
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
  }, [isExecuting, oldQuery, query]);

  const save = async () => {
    setIsSaving(true);
    const res = await saveQuery({ query, user: address });
    const { queryId } = await res.json();
    navigate(queryId);
    setIsSaving(false);
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
            <div className={styles.queryContainer}>
              <Flex justifyContent='space-between' mb='24px'>
                <ArrowLeft
                  className={styles.back}
                  onClick={() => navigate(-1)}
                />
                {!!queryResults.columns.length && !id && (
                  <button className={styles.button} onClick={() => save()}>
                    <Flex alignItems='center' gap='8px'>
                      <div>{isSaving ? 'Saving...' : 'Save'}</div>
                      <Save size={20} />
                    </Flex>
                  </button>
                )}
                {!!queryResults.columns.length && id && (
                  <Flex alignItems='center' gap='24px'>
                    {DOWNLOAD_OPTIONS.map((option) => (
                      <button
                        className={styles.button}
                        onClick={() => download(option)}
                      >
                        <Flex alignItems='center' gap='8px'>
                          {exporting === option ? 'Exporting...' : 'Export'}{' '}
                          {option}
                          <Download size={20} />
                        </Flex>
                      </button>
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
                  <button
                    className={styles.button}
                    onClick={() => setShowVisualizationModal(true)}
                  >
                    New Visualization
                  </button>
                )}
                <button
                  className={styles.button}
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
                </button>
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
