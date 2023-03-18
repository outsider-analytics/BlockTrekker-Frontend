import Flex from 'components/Flex';
import { CSSProperties, ReactNode } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  title: {
    color: '#EDEDED',
    fontSize: '12px',
    fontWeight: 400,
    marginBottom: '4px',
  },
});

type InpurtWrapperProps = {
  children: ReactNode;
  optional?: boolean;
  note?: string;
  style?: CSSProperties;
  title: string;
};

export default function InputWrapper({
  children,
  note,
  optional,
  style,
  title,
}: InpurtWrapperProps): JSX.Element {
  const styles = useStyles();
  return (
    <div style={{ ...style }}>
      <Flex justifyContent="space-between">
        <div className={styles.title}>{title}</div>
        {optional && <div className={styles.title}>Optional</div>}
      </Flex>
      {children}
      <div className={styles.title} style={{ marginBlock: '4px 0px' }}>
        {note}
      </div>
    </div>
  );
}
