import Button from 'components/Button';
import Flex from 'components/Flex';
import Modal from 'components/Modal';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  title: {
    color: '#FCFCFC',
    fontSize: '34px',
    fontWeight: 500,
  },
});

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
  const styles = useStyles();
  return (
    <Modal
      onClose={onClose}
      open={open}
      style={{
        borderRadius: '4px',
        height: '200px',
        padding: '24px',
        width: 'min(350px, 100%)',
      }}
    >
      <div className={styles.title}>Remove?</div>
      <Flex
        justifyContent='space-between'
        style={{
          bottom: '24px',
          position: 'absolute',
          width: 'calc(100% - 48px)',
        }}
      >
        <Button onClick={() => onClose()} text='Close' />
        <Button onClick={() => onRemove()} text='Remove' />
      </Flex>
    </Modal>
  );
}
