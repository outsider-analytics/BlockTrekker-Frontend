import { getVisualizationNames } from 'api/visualizationApi';
import Button from 'components/Button';
import { ChartTypeToIcon } from 'components/Charts/constants';
import Flex from 'components/Flex';
import Modal from 'components/Modal';
import Typography from 'components/Typography';
import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useAccount } from 'wagmi';

const useStyles = createUseStyles({
  row: {
    color: '#FCFCFC',
    padding: '6px 12px',
    '&:hover': {
      backgroundColor: '#34383D',
    },
    '&:first-of-type': {
      borderTopLeftRadius: '4px',
      borderTopRightRadius: '4px',
    },
    '&:last-of-type': {
      borderBottomLeftRadius: '4px',
      borderBottomRightRadius: '4px',
    },
  },
  selectionContainer: {
    border: '1px solid #FCFCFC',
    borderRadius: '4px',
    marginTop: '24px',
    width: '100%',
  },
});

type DashboardVisualizationModalProps = {
  existingVisualiztions: any[];
  onClose: () => void;
  onFinish: (visualization: any) => void;
  open: boolean;
};

export default function DashboardVisualizationModal({
  existingVisualiztions,
  onClose,
  onFinish,
  open,
}: DashboardVisualizationModalProps): JSX.Element {
  const styles = useStyles();
  const { address } = useAccount();
  const [selectedVisualization, setSelectedVisualization] = useState(-1);
  const [visualizations, setVisualizations] = useState<any[]>([]);

  useEffect(() => {
    if (!address) return;
    if (open) {
      (async () => {
        const res = await getVisualizationNames(address);
        const data = await res.json();
        setVisualizations(
          data.results.map((query: any) => query.visualizations).flat()
        );
      })();
    } else {
      setSelectedVisualization(-1);
    }
  }, [address, open]);

  return (
    <Modal
      onClose={onClose}
      open={open}
      style={{
        borderRadius: '4px',
        height: '450px',
        padding: '24px',
        width: 'min(100%, 700px)',
      }}
    >
      <Typography style={{ color: '#FCFCFC' }} variant="h4">
        Add Visualization
      </Typography>
      {visualizations.length ? (
        <div className={styles.selectionContainer}>
          {visualizations.map((visualization, index) => {
            const placed = existingVisualiztions.includes(visualization.id);
            return (
              <div
                className={styles.row}
                key={visualization.id}
                onClick={() => setSelectedVisualization(index)}
                style={{
                  backgroundColor:
                    selectedVisualization === index || placed ? '#34383D' : '',
                  cursor: placed ? 'initial' : 'pointer',
                }}
              >
                <Flex alignItems="center" justifyContent="space-between">
                  <Flex alignItems="center" gap="16px">
                    <Flex alignItems="center" gap="4px">
                      <div style={{ width: '40px' }}>
                        {capitalize(visualization.chartType)}
                      </div>
                      {ChartTypeToIcon[visualization.chartType]}
                    </Flex>
                    <Typography variant="subtitle2">
                      {visualization.id}
                    </Typography>
                  </Flex>
                  {placed && <div>Added</div>}
                </Flex>
              </div>
            );
          })}
        </div>
      ) : (
        <Flex
          alignItems="center"
          justifyContent="center"
          style={{ height: '50vh' }}
        >
          <Typography style={{ color: '#FCFCFC' }} variant="h4">
            No queries
          </Typography>
        </Flex>
      )}
      <Flex
        justifyContent="space-between"
        style={{
          bottom: '24px',
          position: 'absolute',
          width: 'calc(100% - 48px)',
        }}
      >
        <Button onClick={() => onClose()} text="Close" />
        <Button
          disabled={selectedVisualization < 0}
          onClick={() => onFinish(visualizations[selectedVisualization])}
          text="Add"
        />
      </Flex>
    </Modal>
  );
}
