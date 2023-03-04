import Modal from 'components/Modal';
import { useEffect, useState } from 'react';
import Typography from 'components/Typography';
import { generateApiKey, getApiKey } from 'api/apiApi';
import { useAccount } from 'wagmi';
import Flex from 'components/Flex';
import Button from 'components/Button';
import { createUseStyles } from 'react-jss';
import { BiRefresh } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { FiCopy } from 'react-icons/fi';
import { copyToClipboard } from 'utils';
import ConfirmationModal from 'components/Modal/ConfirmationModal';

const useStyles = createUseStyles({
  copy: {
    color: '#FCFCFC',
    cursor: 'pointer',
  },
  keyContainer: {
    backgroundColor: '#CFE3DF66',
    borderRadius: '4px',
    color: '#E7F1EF',
    padding: '5px',
  },
});

type APIKeyModalProps = {
  onClose: () => void;
  open: boolean;
};

export default function APIKeyModal({
  onClose,
  open,
}: APIKeyModalProps): JSX.Element {
  const styles = useStyles();
  const { address } = useAccount();
  const [key, setKey] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const generateKey = async () => {
    if (!address) return;
    try {
      const res = await generateApiKey(address);
      const apiKey = await res.text();
      setKey(apiKey);
      toast.success(`Successfully ${key ? 're-' : ''}generated key`);
    } catch (err) {
      toast.error(`Error ${key ? 're-' : ''}generating key`);
    }
  };

  useEffect(() => {
    if (!address || !open) return;
    (async () => {
      const res = await getApiKey(address);
      const apiKey = await res.text();
      setKey(apiKey);
    })();
  }, [address, open]);
  return (
    <Modal
      onClose={onClose}
      open={open}
      style={{ height: '250px', padding: '16px', width: '500px' }}
    >
      <Typography variant='h5' style={{ color: '#FCFCFC' }}>
        Api Key
      </Typography>
      <Flex
        alignItems='center'
        direction='column'
        gap='24px'
        justifyContent='center'
        style={{ height: '200px' }}
      >
        {key ? (
          <Flex alignItems='center' gap='24px'>
            <div className={styles.keyContainer}>
              <Typography variant='subtitle1'>{key}</Typography>
            </div>
            <FiCopy
              className={styles.copy}
              onClick={() => copyToClipboard(key)}
              size={20}
            />
          </Flex>
        ) : (
          <Typography style={{ color: '#FCFCFC' }} variant='h6'>
            No key
          </Typography>
        )}
        <Flex
          justifyContent='space-between'
          style={{
            bottom: '16px',
            position: 'absolute',
            width: 'calc(100% - 32px)',
          }}
        >
          <Button onClick={() => onClose()} text='Close' />
          <Button
            onClick={() => (key ? setShowConfirmation(true) : generateKey())}
          >
            <Flex alignItems='center' gap='8px'>
              {key ? 'Regenerate key' : 'Generate key'}
              {key && <BiRefresh size={18} />}
            </Flex>
          </Button>
        </Flex>
      </Flex>
      <ConfirmationModal
        actionText='Regenerate'
        caption='This action is irreversible. Once a new key is generated the old one will not be able to access the api.'
        onClose={() => setShowConfirmation(false)}
        onFinish={() => {
          generateKey();
          setShowConfirmation(false);
        }}
        open={showConfirmation}
        title='Regenerate API Key?'
      />
    </Modal>
  );
}
