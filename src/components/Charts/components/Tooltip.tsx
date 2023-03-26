import Flex from 'components/Flex';
import { createUseStyles } from 'react-jss';
import { TooltipProps } from 'recharts';
import { formatNumber } from 'utils';

const useStyles = createUseStyles({
  container: {
    backgroundColor: '#34383D',
    border: '1px solid #717371',
    borderRadius: '4px',
    fontSize: '16px',
    padding: '12px',
  },
});

export default function Tooltip(
  props: TooltipProps<number, string>
): JSX.Element {
  const { payload } = props;
  const styles = useStyles();
  if (!payload) return <></>;
  return (
    <div className={styles.container}>
      {payload.map(({ color, name, payload: { fill }, value }) => (
        <Flex key={name} gap="12px" style={{ color: color ?? fill }}>
          <div>{name}:</div>
          <div>{formatNumber(value ?? 0, 0)}</div>
        </Flex>
      ))}
    </div>
  );
}
