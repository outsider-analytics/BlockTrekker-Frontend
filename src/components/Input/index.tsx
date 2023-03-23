import Flex from 'components/Flex';
import InputWrapper from 'components/InputWrapper';
import { CSSProperties } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    backgroundColor: '#34383D',
    border: '1px solid #717371',
    borderRadius: '4px',
    boxSizing: 'border-box',
    padding: '8px 12px',
    width: '100%',
  },
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#EDEDED',
    height: '100%',
    outline: 'transparent',
    resize: 'none',
    width: '100%',
  },
});

type InputProps = {
  currency?: boolean;
  disabled?: boolean;
  inputStyle?: CSSProperties;
  note?: string;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  optional?: boolean;
  placeholder?: string;
  rows?: number;
  style?: CSSProperties;
  title: string;
  textarea?: boolean;
  type?: string;
  value: string;
  wrapperStyle?: CSSProperties;
};

export default function Input({
  currency,
  disabled,
  inputStyle,
  note,
  onChange,
  optional,
  placeholder,
  rows = 5,
  style,
  textarea,
  title,
  type = 'text',
  value,
  wrapperStyle,
}: InputProps): JSX.Element {
  const styles = useStyles();
  return (
    <InputWrapper
      note={note}
      optional={optional}
      style={{ ...wrapperStyle }}
      title={title}
    >
      <div className={styles.container} style={{ ...style }}>
        <Flex alignItems="center" gap="2px">
          {currency && <div style={{ color: '#FCFCFC' }}>$</div>}
          {textarea ? (
            <textarea
              className={styles.input}
              onChange={onChange}
              placeholder={placeholder}
              rows={rows}
              style={{ ...inputStyle }}
              value={value}
            />
          ) : (
            <input
              className={styles.input}
              disabled={disabled}
              onChange={onChange}
              placeholder={placeholder}
              style={{ ...inputStyle }}
              type={type}
              value={value}
            />
          )}
        </Flex>
      </div>
    </InputWrapper>
  );
}
