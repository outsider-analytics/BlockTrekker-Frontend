import Flex from 'components/Flex';
import InputWrapper from 'components/InputWrapper';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { CSSProperties, SetStateAction, useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  caret: ({ open }: { open: boolean }) => ({
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: '.3s transform',
  }),
  container: {
    backgroundColor: '#34383D',
    border: '1px solid #717371',
    borderRadius: '4px',
    color: '#EDEDED',
    cursor: 'pointer',
    padding: '8px 12px',
    position: 'relative',
  },
  expandedMenu: {
    backgroundColor: '#34383D',
    border: '1px solid #717371',
    borderRadius: '4px',
    left: 0,
    padding: '8px 4px',
    position: 'absolute',
    top: '120%',
    width: 'calc(100% - 2px)',
    zIndex: 100,
  },
  option: {
    padding: '3px 4px',
  },
});

type DropdownProps = {
  disabled?: boolean;
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelect: React.Dispatch<SetStateAction<any>>;
  options: string[];
  placeholder?: string;
  selectWithIndex?: boolean;
  selectedOption: string;
  style?: CSSProperties;
  title: string;
  wrapperStyle?: CSSProperties;
};

export default function Dropdown({
  disabled,
  onSelect,
  options,
  placeholder,
  selectWithIndex,
  selectedOption,
  style,
  title,
  wrapperStyle,
}: DropdownProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const styles = useStyles({ open });
  const dropdownRef = useRef(null);

  useOutsideAlerter(dropdownRef, () => setOpen(false));

  return (
    <InputWrapper style={{ ...wrapperStyle }} title={title}>
      <div
        className={styles.container}
        onClick={() => !disabled && setOpen(!open)}
        ref={dropdownRef}
        style={{ ...style }}
      >
        <Flex alignItems="center" justifyContent="space-between" gap="16px">
          <div>{selectedOption || placeholder}</div>
          <FiChevronDown className={styles.caret} />
          {open && (
            <div className={styles.expandedMenu}>
              {options.map((option: string, index: number) => (
                <div
                  className={styles.option}
                  key={option}
                  onClick={() =>
                    selectWithIndex ? onSelect(index) : onSelect(option)
                  }
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </Flex>
      </div>
    </InputWrapper>
  );
}
