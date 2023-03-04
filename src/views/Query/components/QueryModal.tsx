import Modal from 'components/Modal';

type QueryModalProps = {
  onClose: () => void;
  open: boolean;
};

export default function QueryModal({
  onClose,
  open,
}: QueryModalProps): JSX.Element {
  return (
    <Modal
      onClose={onClose}
      open={open}
      style={{ height: '500px', width: 'min(600px, 100%)' }}
    >
      Test
    </Modal>
  );
}
