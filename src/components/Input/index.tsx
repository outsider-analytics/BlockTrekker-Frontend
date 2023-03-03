import InputWrapper from 'components/InputWrapper';
import { createUseStyles } from 'react-jss';
import { CSSProperties } from 'react';

const useStyles = createUseStyles({
  input: {
    backgroundColor: '#34383D',
    border: '1px solid #717371',
    borderRadius: '4px',
    color: '#EDEDED',
    outline: 'transparent',
    padding: '8px 12px',
  },
});

type InputProps = {
  disabled?: boolean;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  title: string;
  value: string;
  wrapperStyle?: CSSProperties;
};

export default function Input({
  disabled,
  onChange,
  placeholder,
  title,
  value,
  wrapperStyle,
}: InputProps): JSX.Element {
  const styles = useStyles();
  return (
    <InputWrapper style={{ ...wrapperStyle }} title={title}>
      <input
        className={styles.input}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
    </InputWrapper>
  );
}
