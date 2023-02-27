import Flex from 'components/Flex';
import Modal from 'components/Modal';
import { createUseStyles } from 'react-jss';

type RemoveModalProps = {
  onClose: () => void;
  onRemove: () => void;
  open: boolean;
};

export default function RemoveModal({
  onClose,
  onRemove,
  open,
}: RemoveModalProps): JSX.Element {
  return (
    <Modal
      onClose={onClose}
      open={open}
      style={{ height: '300px', width: 'min(500px, 100%)' }}
    >
      <Flex>
        <button onClick={() => onClose()}>Close</button>
        <button onClick={() => onRemove()}>Remove</button>
      </Flex>
    </Modal>
  );
}
