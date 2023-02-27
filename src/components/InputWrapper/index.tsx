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
  style?: CSSProperties;
  title: string;
};

export default function InputWrapper({
  children,
  style,
  title,
}: InpurtWrapperProps): JSX.Element {
  const styles = useStyles();
  return (
    <div style={{ ...style }}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
}
