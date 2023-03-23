import { removeVisualization } from 'api/visualizationApi';
import ChartWrapper from 'components/Charts/ChartWrapper';
import { ChartTypeToIcon } from 'components/Charts/constants';
import Flex from 'components/Flex';
import ConfirmationModal from 'components/Modal/ConfirmationModal';
import Table from 'components/Table';
import Typography from 'components/Typography';
import { capitalize } from 'lodash';
import { SetStateAction, useEffect, useState } from 'react';
import { AiFillEdit, AiOutlineUnorderedList } from 'react-icons/ai';
import { FiTrash2 } from 'react-icons/fi';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  icon: {
    color: '#FCFCFC',
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
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any;
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setVisualizations: React.Dispatch<SetStateAction<any[]>>;
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          alignItems="center"
          justifyContent="space-between"
          mb="24px"
          mt="32px"
        >
          <div className={styles.tabContainer}>
            {tabs.map((tab, index) => (
              <div
                className={styles.tab}
                key={index}
                onClick={() => setSelectedTab(index)}
                style={{
                  backgroundColor:
                    selectedTab === index ? '#424542' : 'initial',
                }}
              >
                <Flex alignItems="center" gap="4px">
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
            <Flex gap="16px">
              <AiFillEdit className={styles.icon} size={20} />
              <FiTrash2
                className={styles.icon}
                onClick={() => setShowRemoveModal(true)}
                size={20}
              />
            </Flex>
          )}
        </Flex>
      )}
      {!!results.columns.length && !isExecuting && (
        <div className={styles.tableContainer}>
          {selectedTab === 0 && (
            <Table
              columns={results.columns}
              pageSize={10}
              rows={results.rows}
            />
          )}
          {visualizations.map(
            (vis, index) =>
              selectedTab === index + 1 && (
                <div key={index} style={{ color: '#FCFCFC' }}>
                  <Typography variant="h6">{vis.name}</Typography>
                  <div style={{ height: '300px', width: '100%' }}>
                    <ChartWrapper
                      chartType={vis.chartType}
                      color={vis.color}
                      data={results.rows}
                      grid={vis.renderGrid}
                      scale={vis.scale}
                      stackBy={{
                        stackColumn: vis.stackBy,
                        valueColumn: vis.yKey,
                      }}
                      xAxisTitle={vis.xAxisTitle}
                      xKey={vis.xKey}
                      yAxisTitle={vis.yAxisTitle}
                      yKey={vis.yKey}
                    />
                  </div>
                </div>
              )
          )}
        </div>
      )}
      <ConfirmationModal
        actionText="Remove"
        onClose={() => setShowRemoveModal(false)}
        onFinish={() => onRemove()}
        open={showRemoveModal}
        title="Remove?"
      />
    </div>
  );
}
