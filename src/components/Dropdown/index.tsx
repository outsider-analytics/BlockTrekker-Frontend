import { SetStateAction } from 'react';

type DropdownProps = {
  onSelect: React.Dispatch<SetStateAction<string>>;
  options: string[];
  selectedOption: string;
};

export default function Dropdown({
  onSelect,
  options,
  selectedOption,
}: DropdownProps): JSX.Element {
  return (
    <select onChange={(e) => onSelect(e.target.value)} value={selectedOption}>
      {options.map((option) => (
        <option value={option}>{option}</option>
      ))}
    </select>
  );
}
