import Button from 'components/Button';
import Flex from 'components/Flex';
import Modal from 'components/Modal';
import Typography from 'components/Typography';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  title: {
    color: '#FCFCFC',
    fontSize: '34px',
    fontWeight: 500,
  },
});

type RemoveModalProps = {
  actionText: string;
  caption?: string;
  onClose: () => void;
  onFinish: () => void;
  open: boolean;
  title: string;
};

export default function ConfirmationModal({
  actionText,
  caption,
  onClose,
  onFinish,
  open,
  title,
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
      <div className={styles.title}>{title}</div>
      {caption && (
        <Typography
          style={{ color: '#D0D0D0', marginTop: '4px' }}
          variant="caption"
        >
          {caption}
        </Typography>
      )}
      <Flex
        justifyContent="space-between"
        style={{
          bottom: '24px',
          position: 'absolute',
          width: 'calc(100% - 48px)',
        }}
      >
        <Button onClick={() => onClose()} text="Close" />
        <Button onClick={() => onFinish()} text={actionText} />
      </Flex>
    </Modal>
  );
}
