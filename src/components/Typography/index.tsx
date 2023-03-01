import { CSSProperties, ReactNode } from 'react';
import { createUseStyles } from 'react-jss';
import { BlockTrekkerTheme, TypographyVariant } from 'theme';

const useStyles = createUseStyles((theme: BlockTrekkerTheme) => ({
  text: (props: TypographyProps) => ({
    ...theme.typography[props.variant],
    cursor: props.onClick ? 'pointer' : 'inherit',
  }),
}));

type TypographyProps = {
  center?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
  variant: TypographyVariant;
};

export default function Typography({
  center,
  children,
  onClick,
  style,
  variant,
  className,
}: TypographyProps): JSX.Element {
  const styles = useStyles({ children, onClick, variant });
  return (
    <div
      className={className ? `${styles.text} ${className}` : styles.text}
      onClick={onClick}
      style={{ textAlign: center ? 'center' : 'initial', ...style }}
    >
      {children}
    </div>
  );
}

export function Span({
  children,
  onClick,
  style,
  variant,
  className,
}: TypographyProps): JSX.Element {
  const styles = useStyles({ children, onClick, variant });
  return (
    <span
      className={className ? `${styles.text} ${className}` : styles.text}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      style={{ ...style }}
    >
      {children}
    </span>
  );
}
