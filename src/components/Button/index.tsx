import { createUseStyles } from 'react-jss';
import { CSSProperties, ReactNode } from 'react';

const useStyles = createUseStyles({
  button: {
    backgroundColor: '#34383D',
    border: 'none',
    borderRadius: '4px',
    color: '#FCFCFC',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 800,
    outline: 'transparent',
    padding: '12px 15px',
  },
});

type ButtonProps = {
  children?: ReactNode;
  onClick: () => void;
  style?: CSSProperties;
  text?: string;
};

export default function Button({
  children,
  onClick,
  style,
  text,
}: ButtonProps): JSX.Element {
  const styles = useStyles();
  return (
    <button className={styles.button} onClick={onClick} style={{ ...style }}>
      {text && <div>{text}</div>}
      <div>{children}</div>
    </button>
  );
}
