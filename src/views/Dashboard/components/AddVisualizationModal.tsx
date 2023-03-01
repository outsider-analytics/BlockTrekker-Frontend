import Modal from 'components/Modal';
import { createUseStyles } from 'react-jss';
import { useEffect, useState } from 'react';
import Flex from 'components/Flex';
import Button from 'components/Button';
import { getVisualizationNames } from 'api/visualizationApi';
import { useAccount } from 'wagmi';
import Typography from 'components/Typography';
import { ChartTypeToIcon } from 'components/Charts/constants';
import { capitalize } from 'lodash';

const useStyles = createUseStyles({
  row: {
    color: '#FCFCFC',
    cursor: 'pointer',
    padding: '6px 12px',
    '&:hover': {
      backgroundColor: '#34383D',
    },
  },
  selectionContainer: {
    border: '1px solid #FCFCFC',
    borderRadius: '4px',
    marginTop: '24px',
    width: '100%',
  },
});

type AddVisualizationModalProps = {
  existingVisualiztions: any[];
  onClose: () => void;
  onFinish: (visualization: any) => void;
  open: boolean;
};

export default function AddVisualizationModal({
  onClose,
  onFinish,
  open,
}: AddVisualizationModalProps): JSX.Element {
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
      <Typography style={{ color: '#FCFCFC' }} variant='h4'>
        Add Visualization
      </Typography>
      <div className={styles.selectionContainer}>
        {visualizations.map((visualization, index) => (
          <div
            className={styles.row}
            key={visualization.id}
            onClick={() => setSelectedVisualization(index)}
            style={{
              backgroundColor: selectedVisualization === index ? '#34383D' : '',
            }}
          >
            <Flex gap='16px'>
              <Flex alignItems='center' gap='4px'>
                <div style={{ width: '40px' }}>
                  {capitalize(visualization.chartType)}
                </div>
                {ChartTypeToIcon[visualization.chartType]}
              </Flex>
              <Typography variant='subtitle2'>{visualization.id}</Typography>
            </Flex>
          </div>
        ))}
      </div>
      <Flex
        justifyContent='space-between'
        style={{
          bottom: '24px',
          position: 'absolute',
          width: 'calc(100% - 48px)',
        }}
      >
        <Button onClick={() => onClose()} text='Close' />
        <Button
          disabled={selectedVisualization < 0}
          onClick={() => onFinish(visualizations[selectedVisualization])}
          text='Add'
        />
      </Flex>
    </Modal>
  );
}
