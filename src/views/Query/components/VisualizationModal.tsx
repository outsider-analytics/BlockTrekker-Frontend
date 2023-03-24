import Button from 'components/Button';
import ChartWrapper from 'components/Charts/ChartWrapper';
import {
  AxisChartOptions,
  AxisCharts,
  ChartScale,
  ChartScales,
  ChartType,
  ChartTypes,
  CurveOptions,
} from 'components/Charts/constants';
import Dropdown from 'components/Dropdown';
import Flex from 'components/Flex';
import Input from 'components/Input';
import Modal from 'components/Modal';
import RadioGroup from 'components/RadioGroup';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { AiFillEdit, AiOutlineCheck } from 'react-icons/ai';
import { FiDroplet } from 'react-icons/fi';
import { createUseStyles } from 'react-jss';
import { CurveType } from 'recharts/types/shape/Curve';

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
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 10px)',
    zIndex: 100,
  },
  icon: {
    color: '#FCFCFC',
    cursor: 'pointer',
  },
  pickerButton: {
    position: 'relative',
  },
  title: {
    color: '#FCFCFC',
    fontSize: '34px',
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
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState('');
  const [renderGrid, setRenderGrid] = useState(false);
  const [scale, setScale] = useState<ChartScale>(ChartScales[0]);
  const [, setCurveType] = useState<CurveType>(CurveOptions[0]);
  // TODO: Change name
  const [renderOption, setRenderOption] = useState<string>(AxisChartOptions[0]);
  const [stackBy, setStackBy] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [xAxisTitle, setXAxisTitle] = useState('');
  const [xKey, setXKey] = useState('');
  const [yAxisTitle, setYAxisTitle] = useState('');
  const [yKey, setYKey] = useState('');
  const colorRef = useRef(null);

  const disabled = useMemo(() => {
    return !xKey || !yKey;
  }, [xKey, yKey]);

  const hasAxis = useMemo(() => {
    return AxisCharts.includes(chartType);
  }, [chartType]);

  const save = async () => {
    const payload = {
      chartType,
      color,
      name,
      renderGrid,
      scale,
      stackBy,
      xAxisTitle,
      xKey,
      yKey,
      yAxisTitle,
    };
    await onFinish(payload);
  };

  useEffect(() => {
    setChartType(ChartTypes[0]);
    setCurveType(CurveOptions[0]);
    setName('');
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
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap="8px" style={{ height: '60px' }}>
          {editingName ? (
            <>
              <Input
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                inputStyle={{ fontSize: '34px' }}
                title=""
                value={name}
              />
              <AiOutlineCheck
                className={styles.icon}
                onClick={() => setEditingName(false)}
                size={20}
              />
            </>
          ) : (
            <>
              <div className={styles.title}>{name || 'New Visualization'}</div>
              <AiFillEdit
                className={styles.icon}
                onClick={() => setEditingName(true)}
                size={20}
              />
            </>
          )}
        </Flex>
        {renderOption === 'Stacked' ? (
          <div></div>
        ) : (
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
        )}
      </Flex>
      <Flex gap="24px">
        <div className={styles.chartContainer}>
          <ChartWrapper
            color={color}
            chartType={chartType}
            data={rows}
            grid={renderGrid}
            scale={scale}
            stackBy={
              stackBy ? { stackColumn: stackBy, valueColumn: yKey } : undefined
            }
            xAxisTitle={xAxisTitle}
            yAxisTitle={yAxisTitle}
            xKey={xKey}
            yKey={yKey}
          />
        </div>
      </Flex>
      <Flex justifyContent="space-between">
        <div>
          <Flex alignItems="center" gap="16px" mt="32px">
            <Dropdown
              onSelect={
                setChartType as React.Dispatch<React.SetStateAction<string>>
              }
              options={ChartTypes}
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
          </Flex>
          <Flex alignItems="center" gap="16px" mt="8px">
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
            <label style={{ color: '#FCFCFC' }}>
              <input
                checked={renderGrid}
                onChange={() => setRenderGrid(!renderGrid)}
                type="checkbox"
              />
              Render grid
            </label>
          </Flex>
        </div>
        <Flex gap="32px">
          <RadioGroup
            onChange={setScale as React.Dispatch<SetStateAction<string>>}
            options={ChartScales}
            selectedOption={scale}
            title="Scale"
          />
          <div>
            <RadioGroup
              onChange={setRenderOption}
              options={AxisChartOptions}
              selectedOption={renderOption}
              title="Render option"
            />
            {renderOption === 'Stacked' && (
              <Dropdown
                onSelect={setStackBy}
                options={columns}
                placeholder="Column to stack by"
                selectedOption={stackBy}
                title="Stack by"
              />
            )}
          </div>
        </Flex>
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
