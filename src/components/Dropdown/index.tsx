import { SetStateAction, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { ChevronDown } from 'react-feather';
import Flex from 'components/Flex';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import InputWrapper from 'components/InputWrapper';

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
    paddingBlock: '4px',
    position: 'absolute',
    top: '120%',
    width: 'calc(100% - 2px)',
  },
  option: {
    padding: '3px 4px',
  },
});

type DropdownProps = {
  onSelect: React.Dispatch<SetStateAction<string>>;
  options: string[];
  placeholder?: string;
  selectedOption: string;
  title: string;
};

export default function Dropdown({
  onSelect,
  options,
  placeholder,
  selectedOption,
  title,
}: DropdownProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const styles = useStyles({ open });
  const dropdownRef = useRef(null);

  useOutsideAlerter(dropdownRef, () => setOpen(false));

  return (
    <InputWrapper title={title}>
      <div
        className={styles.container}
        onClick={() => setOpen(!open)}
        ref={dropdownRef}
      >
        <Flex justifyContent='space-between' gap='16px'>
          <div>{selectedOption || placeholder}</div>
          <ChevronDown className={styles.caret} />
          {open && (
            <div className={styles.expandedMenu}>
              {options.map((option: string) => (
                <div className={styles.option} onClick={() => onSelect(option)}>
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
