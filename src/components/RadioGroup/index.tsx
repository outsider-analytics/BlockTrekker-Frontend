import InputWrapper from 'components/InputWrapper';
import React, { SetStateAction } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  label: {
    color: '#FCFCFC',
  },
});

type RadioGroupProps = {
  onChange: React.Dispatch<SetStateAction<string>>;
  options: string[];
  selectedOption: string;
  title: string;
};

function RadioGroup({
  onChange,
  options,
  selectedOption,
  title,
}: RadioGroupProps) {
  const styles = useStyles();
  return (
    <InputWrapper title={title}>
      <div>
        {options.map((option: string) => (
          <label className={styles.label} key={option}>
            <input
              type="radio"
              name={option}
              value={option}
              checked={option === selectedOption}
              onChange={(e) => onChange(e.target.value)}
            />
            {option}
          </label>
        ))}
      </div>
    </InputWrapper>
  );
}

export default RadioGroup;
