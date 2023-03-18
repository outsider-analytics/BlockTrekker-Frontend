import Button from 'components/Button';
import ChartWrapper from 'components/Charts/ChartWrapper';
import {
  ChartScale,
  ChartScales,
  ChartType,
  ChartTypes,
  CurveOptions,
} from 'components/Charts/constants';
import Dropdown from 'components/Dropdown';
import Flex from 'components/Flex';
import Input from 'components/Input';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { FiDroplet } from 'react-icons/fi';
import { createUseStyles } from 'react-jss';
import { CurveType } from 'recharts/types/shape/Curve';

import Modal from '.';
// import { generateStackData } from 'components/Charts/utils';

const useStyles = createUseStyles({
  chartContainer: {
    height: '350px',
    width: '100%',
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
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFinish: (payload: any) => Promise<void>;
  open: boolean;
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
};

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
  const [scale] = useState<ChartScale>(ChartScales[0]);
  const [, setCurveType] = useState<CurveType>(CurveOptions[0]);
  // const [stackBy, setStackBy] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [xAxisTitle, setXAxisTitle] = useState('');
  const [xKey, setXKey] = useState('');
  const [yAxisTitle, setYAxisTitle] = useState('');
  const [yKey, setYKey] = useState('');
  const colorRef = useRef(null);

  const disabled = useMemo(() => {
    return !xKey || !yKey;
  }, [xKey, yKey]);

  const save = async () => {
    const payload = { chartType, color, xAxisTitle, xKey, yKey };
    await onFinish(payload);
  };

  // const stackedData = useMemo(() => {
  //   if (!stackBy) return [];
  //   const stackedData = generateStackData(stackBy, rows);
  // }, [rows, stackBy]);

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
      <Flex gap="24px">
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
        {/* <RadioGroup
          onChange={setScale as React.Dispatch<SetStateAction<string>>}
          options={ChartScales}
          selectedOption={scale}
          title='Scale'
        /> */}
      </Flex>
      <Flex alignItems="flex-end" gap="16px" mt="32px">
        <Dropdown
          onSelect={
            setChartType as React.Dispatch<React.SetStateAction<string>>
          }
          options={ChartTypes.slice(0, 3)}
          selectedOption={chartType as string}
          title="Chart type"
        />
        <Dropdown
          onSelect={setXKey}
          options={columns}
          placeholder="Select x-key"
          selectedOption={xKey}
          title="X-Axis Key"
        />
        <Dropdown
          onSelect={setYKey}
          options={columns}
          placeholder="Select y-key"
          selectedOption={yKey}
          title="Y-Axis Key"
        />
        {/* <Dropdown
          onSelect={setStackBy}
          options={columns}
          placeholder='Select stack option'
          selectedOption={stackBy}
          title='Stack By'
        /> */}
        <Flex alignItems="center" gap="8px">
          <Button
            onClick={() => setShowPicker(true)}
            style={{ padding: '8px 12px', position: 'relative' }}
          >
            <FiDroplet size={20} />
            {showPicker && (
              <div className={styles.colorPicker} ref={colorRef}>
                <HexColorPicker color={color} onChange={setColor} />
              </div>
            )}
          </Button>
          <div className={styles.color} />
        </Flex>
      </Flex>
      <Flex gap="16px" mt="8px">
        <Input
          onChange={(e) => setXAxisTitle(e.target.value)}
          placeholder="X-Axis Label"
          title="X-Axis Label"
          value={xAxisTitle}
        />
        <Input
          onChange={(e) => setYAxisTitle(e.target.value)}
          placeholder="Y-Axis Label"
          title="Y-Axis Label"
          value={yAxisTitle}
        />
      </Flex>
      <Button
        disabled={disabled}
        onClick={() => save()}
        style={{
          bottom: '24px',
          right: '24px',
          padding: '8px 10px',
          position: 'absolute',
        }}
        text="Save"
      />
    </Modal>
  );
}
