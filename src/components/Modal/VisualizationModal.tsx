import {
  ChartType,
  ChartTypes,
  CurveOptions,
} from 'components/Charts/constants';

import Modal from '.';
import { useState } from 'react';
import { CurveType } from 'recharts/types/shape/Curve';
import Dropdown from 'components/Dropdown';
import { createUseStyles } from 'react-jss';
import Flex from 'components/Flex';
import ChartWrapper from 'components/Charts/ChartWrapper';
import { HexColorPicker } from 'react-colorful';

const useStyles = createUseStyles({
  colorPicker: {
    position: 'absolute',
    left: '150px',
    top: '-140px',
  },
  pickerButton: {
    position: 'relative',
  },
  title: {
    color: '#FCFCFC',
    fontSize: '34px',
    marginBottom: '24px',
  },
});

type VisualizationModalProps = {
  columns: string[];
  onClose: () => void;
  onFinish: (payload: any) => Promise<void>;
  open: boolean;
  rows: any[];
};

export default function VisualizationModal({
  columns,
  onClose,
  onFinish,
  open,
  rows,
}: VisualizationModalProps): JSX.Element {
  const styles = useStyles();
  const [color, setColor] = useState('#8884d8');
  const [chartType, setChartType] = useState<ChartType>(ChartTypes[0]);
  const [curveType, setCurveType] = useState<CurveType>(CurveOptions[0]);
  const [showPicker, setShowPicker] = useState(false);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');

  const save = async () => {
    const payload = { chartType, color, xKey, yKey };
    await onFinish(payload);
  };

  return (
    <Modal
      onClose={onClose}
      open={open}
      style={{
        borderRadius: '4px',
        padding: '24px',
        width: 'min(100%, 1050px)',
      }}
    >
      <div className={styles.title}>Create Visualization</div>
      <div style={{ height: '350px', width: '750px' }}>
        <ChartWrapper
          color={color}
          chartType={chartType}
          rows={rows}
          xKey={xKey}
          yKey={yKey}
        />
      </div>
      <Flex gap='16px' mt='32px'>
        <Dropdown
          onSelect={
            setChartType as React.Dispatch<React.SetStateAction<string>>
          }
          options={ChartTypes.slice(0, 3)}
          selectedOption={chartType as string}
        />
        <Dropdown
          onSelect={setXKey}
          options={xKey ? columns : ['Select x-key', ...columns]}
          selectedOption={xKey}
        />
        <Dropdown
          onSelect={setYKey}
          options={yKey ? columns : ['Select y-key', ...columns]}
          selectedOption={yKey}
        />
        <button
          onClick={() => setShowPicker(true)}
          style={{ position: 'relative' }}
        >
          <div>Pick Color</div>{' '}
          {showPicker && (
            <HexColorPicker
              className={styles.colorPicker}
              color={color}
              onChange={setColor}
            />
          )}
        </button>
      </Flex>
      <button onClick={() => save()}>Save</button>
    </Modal>
  );
}
