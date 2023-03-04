import { CSSProperties, ReactNode } from 'react';
import { createUseStyles } from 'react-jss';
import Flex from 'components/Flex';

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
  style?: CSSProperties;
  title: string;
};

export default function InputWrapper({
  children,
  optional,
  style,
  title,
}: InpurtWrapperProps): JSX.Element {
  const styles = useStyles();
  return (
    <div style={{ ...style }}>
      <Flex justifyContent='space-between'>
        <div className={styles.title}>{title}</div>
        {optional && <div className={styles.title}>Optional</div>}
      </Flex>
      {children}
    </div>
  );
}
