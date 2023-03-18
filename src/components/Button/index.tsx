import { CSSProperties, ReactNode } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  button: ({ disabled }: { disabled?: boolean }) => ({
    backgroundColor: '#34383D',
    border: 'none',
    borderRadius: '4px',
    color: '#FCFCFC',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
    fontWeight: 800,
    opacity: disabled ? 0.65 : 1,
    outline: 'transparent',
    padding: '10px 12px',
  }),
});

type ButtonProps = {
  children?: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  style?: CSSProperties;
  text?: string;
};

export default function Button({
  children,
  disabled,
  onClick,
  style,
  text,
}: ButtonProps): JSX.Element {
  const styles = useStyles({ disabled });
  return (
    <button
      className={styles.button}
      onClick={() => !disabled && onClick()}
      style={{ ...style }}
    >
      {text && <div>{text}</div>}
      <div>{children}</div>
    </button>
  );
}
