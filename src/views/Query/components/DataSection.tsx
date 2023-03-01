import { SetStateAction, useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import Table from 'components/Table';
import ChartWrapper from 'components/Charts/ChartWrapper';
import Flex from 'components/Flex';
import { Trash2 } from 'react-feather';
import RemoveModal from '../../../components/Modal/RemoveModal';
import { removeVisualization } from 'api/visualizationApi';
import { AiOutlineUnorderedList } from 'react-icons/ai';
import { ChartTypeToIcon } from 'components/Charts/constants';
import { capitalize } from 'lodash';

const useStyles = createUseStyles({
  delete: {
    cursor: 'pointer',
  },
  tab: {
    borderRadius: '4px',
    color: '#FCFCFC',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 400,
    padding: '4px 8px',
  },
  tabContainer: {
    border: '1px solid #424542',
    borderRadius: '4px',
    display: 'flex',
    padding: '4px 8px',
    width: 'fit-content',
  },
  tableContainer: {
    overflowX: 'auto',
    width: '100%',
  },
});

type DataSectionProps = {
  isExecuting: boolean;
  queryId: string;
  results: any;
  setVisualizations: React.Dispatch<SetStateAction<any[]>>;
  visualizations: any[];
};

export default function DataSection({
  isExecuting,
  queryId,
  results,
  setVisualizations,
  visualizations,
}: DataSectionProps): JSX.Element {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [tabs, setTabs] = useState(['Results']);
  const styles = useStyles();

  const onRemove = async () => {
    // TODO: Remove from db
    const pos = selectedTab - 1;
    await removeVisualization(queryId, pos);
    const copy = [...visualizations];
    copy.splice(pos, 1);
    setVisualizations(copy);
    setShowRemoveModal(false);
    setSelectedTab(0);
  };

  useEffect(() => {
    const visualizationNames = visualizations.map(({ chartType }) =>
      capitalize(chartType)
    );
    setTabs((prev) => [prev[0], ...visualizationNames]);
  }, [visualizations]);

  return (
    <div>
      {!!results.columns.length && (
        <Flex
          alignItems='center'
          justifyContent='space-between'
          mb='24px'
          mt='24px'
        >
          <div className={styles.tabContainer}>
            {tabs.map((tab, index) => (
              <div
                className={styles.tab}
                onClick={() => setSelectedTab(index)}
                style={{
                  backgroundColor:
                    selectedTab === index ? '#424542' : 'initial',
                }}
              >
                <Flex alignItems='center' gap='4px'>
                  {tab}
                  {index > 0 ? (
                    ChartTypeToIcon[visualizations[index - 1].chartType]
                  ) : (
                    <AiOutlineUnorderedList />
                  )}
                </Flex>
              </div>
            ))}
          </div>
          {selectedTab > 0 && (
            <Trash2
              className={styles.delete}
              color='#FCFCFC'
              onClick={() => setShowRemoveModal(true)}
              size={20}
            />
          )}
        </Flex>
      )}
      {!!results.columns.length && !isExecuting && (
        <div className={styles.tableContainer}>
          {selectedTab === 0 && (
            <Table columns={results.columns} rows={results.rows} />
          )}
          {visualizations.map(
            (vis, index) =>
              selectedTab === index + 1 && (
                <div style={{ height: '300px', width: '100%' }}>
                  <ChartWrapper
                    chartType={vis.chartType}
                    color={vis.color}
                    data={results.rows}
                    xKey={vis.xKey}
                    yKey={vis.yKey}
                  />
                </div>
              )
          )}
        </div>
      )}
      <RemoveModal
        onClose={() => setShowRemoveModal(false)}
        onRemove={() => onRemove()}
        open={showRemoveModal}
      />
    </div>
  );
}
