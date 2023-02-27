import {
  ChartType,
  ChartTypes,
  CurveOptions,
} from 'components/Charts/constants';

import Modal from '.';
import { useEffect, useRef, useState } from 'react';
import { CurveType } from 'recharts/types/shape/Curve';
import Dropdown from 'components/Dropdown';
import { createUseStyles } from 'react-jss';
import Flex from 'components/Flex';
import ChartWrapper from 'components/Charts/ChartWrapper';
import { HexColorPicker } from 'react-colorful';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import Input from 'components/Input';

const useStyles = createUseStyles({
  chartContainer: {
    height: '350px',
    width: '750px',
  },
  colorPicker: {
    position: 'absolute',
    top: '-100%',
  },
  pickerButton: {
    position: 'relative',
  },
  save: {
    bottom: '24px',
    right: '24px',
    position: 'absolute',
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
  const [, setCurveType] = useState<CurveType>(CurveOptions[0]);
  const [showPicker, setShowPicker] = useState(false);
  const [xAxisTitle, setXAxisTitle] = useState('');
  const [xKey, setXKey] = useState('');
  const [yAxisTitle, setYAxisTitle] = useState('');
  const [yKey, setYKey] = useState('');
  const colorRef = useRef(null);

  const save = async () => {
    const payload = { chartType, color, xKey, yKey };
    await onFinish(payload);
  };

  useEffect(() => {
    setChartType(ChartTypes[0]);
    setCurveType(CurveOptions[0]);
    setXAxisTitle('');
    setXKey('');
    setYKey('');
  }, [open]);

  useOutsideAlerter(colorRef, () => setShowPicker(false));

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
      <div className={styles.chartContainer}>
        <ChartWrapper
          color={color}
          chartType={chartType}
          rows={rows}
          xAxisTitle={xAxisTitle}
          yAxisTitle={yAxisTitle}
          xKey={xKey}
          yKey={yKey}
        />
      </div>
      <Flex alignItems='center' gap='16px' mt='32px'>
        <Dropdown
          onSelect={
            setChartType as React.Dispatch<React.SetStateAction<string>>
          }
          options={ChartTypes.slice(0, 3)}
          selectedOption={chartType as string}
          title='Chart type'
        />
        <Dropdown
          onSelect={setXKey}
          options={xKey ? columns : ['Select x-key', ...columns]}
          selectedOption={xKey}
          title='X-Axis Key'
        />
        <Dropdown
          onSelect={setYKey}
          options={yKey ? columns : ['Select y-key', ...columns]}
          selectedOption={yKey}
          title='Y-Axis Key'
        />
        <button
          onClick={() => setShowPicker(true)}
          ref={colorRef}
          style={{ position: 'relative' }}
        >
          <div>Pick Color</div>
          {showPicker && (
            <HexColorPicker
              className={styles.colorPicker}
              color={color}
              onChange={setColor}
            />
          )}
        </button>
      </Flex>
      <Flex gap='16px' mt='8px'>
        <Input
          onChange={(e) => setXAxisTitle(e.target.value)}
          placeholder='X-Axis Label'
          title='X-Axis Label'
          value={xAxisTitle}
        />
        <Input
          onChange={(e) => setYAxisTitle(e.target.value)}
          placeholder='Y-Axis Label'
          title='Y-Axis Label'
          value={yAxisTitle}
        />
      </Flex>
      <button className={styles.save} onClick={() => save()}>
        Save
      </button>
    </Modal>
  );
}
