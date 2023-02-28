import {
  ChartScale,
  ChartScales,
  ChartType,
  ChartTypes,
  CurveOptions,
} from 'components/Charts/constants';

import Modal from '.';
import { SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { CurveType } from 'recharts/types/shape/Curve';
import Dropdown from 'components/Dropdown';
import { createUseStyles } from 'react-jss';
import Flex from 'components/Flex';
import ChartWrapper from 'components/Charts/ChartWrapper';
import { HexColorPicker } from 'react-colorful';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import Input from 'components/Input';
import RadioGroup from 'components/RadioGroup';
import Button from 'components/Button';
import { Droplet } from 'react-feather';

const useStyles = createUseStyles({
  chartContainer: {
    height: '350px',
    width: '750px',
  },
  color: ({ color }: { color: string }) => ({
    backgroundColor: color,
    borderRadius: '4px',
    height: '25px',
    width: '25px',
  }),
  colorPicker: {
    left: 0,
    position: 'absolute',
    bottom: 'calc(100% + 10px)',
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

const TABS = ['Chart', 'Axes'];

export default function VisualizationModal({
  columns,
  onClose,
  onFinish,
  open,
  rows,
}: VisualizationModalProps): JSX.Element {
  const [color, setColor] = useState('#8884d8');
  const styles = useStyles({ color });
  const [chartType, setChartType] = useState<ChartType>(ChartTypes[0]);
  const [scale, setScale] = useState<ChartScale>(ChartScales[0]);
  const [, setCurveType] = useState<CurveType>(CurveOptions[0]);
  const [stackBy, setStackBy] = useState('');
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

  const stackedData = useMemo(() => {
    if (!stackBy) return [];
    console.log('Data: ', rows);
  }, [rows, stackBy]);

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
      <Flex gap='24px'>
        <div className={styles.chartContainer}>
          <ChartWrapper
            color={color}
            chartType={chartType}
            data={rows}
            scale={scale}
            xAxisTitle={xAxisTitle}
            yAxisTitle={yAxisTitle}
            xKey={xKey}
            yKey={yKey}
          />
        </div>
        <RadioGroup
          onChange={setScale as React.Dispatch<SetStateAction<string>>}
          options={ChartScales}
          selectedOption={scale}
          title='Scale'
        />
      </Flex>
      <Flex alignItems='flex-end' gap='16px' mt='32px'>
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
          options={columns}
          placeholder='Select x-key'
          selectedOption={xKey}
          title='X-Axis Key'
        />
        <Dropdown
          onSelect={setYKey}
          options={columns}
          placeholder='Select y-key'
          selectedOption={yKey}
          title='Y-Axis Key'
        />
        <Dropdown
          onSelect={setStackBy}
          options={columns}
          placeholder='Select stack option'
          selectedOption={stackBy}
          title='Stack By'
        />
        <Flex alignItems='center' gap='8px'>
          <Button
            onClick={() => setShowPicker(true)}
            style={{ padding: '8px 12px', position: 'relative' }}
          >
            <Droplet size={20} />
            {showPicker && (
              <div className={styles.colorPicker} ref={colorRef}>
                <HexColorPicker color={color} onChange={setColor} />
              </div>
            )}
          </Button>
          <div className={styles.color} />
        </Flex>
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
      <Button
        onClick={() => save()}
        style={{
          bottom: '24px',
          right: '24px',
          padding: '8px 10px',
          position: 'absolute',
        }}
        text='Save'
      />
    </Modal>
  );
}
