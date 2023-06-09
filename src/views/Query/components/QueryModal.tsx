import Button from 'components/Button';
import Flex from 'components/Flex';
import Input from 'components/Input';
import Modal from 'components/Modal';
import Typography from 'components/Typography';
import { useEffect, useMemo, useState } from 'react';

type QueryModalProps = {
  description: string;
  edit: boolean;
  name: string;
  onClose: () => void;
  onFinish: (description: string, name: string) => void;
  open: boolean;
};

export default function QueryModal({
  description,
  edit,
  name,
  onClose,
  onFinish,
  open,
}: QueryModalProps): JSX.Element {
  const [editedDescription, setEditedDescription] = useState('');
  const [editedName, setEditedName] = useState('');

  const disabled = useMemo(() => {
    return (
      !editedName || (description === editedDescription && editedName === name)
    );
  }, [description, editedDescription, editedName, name]);

  useEffect(() => {
    setEditedDescription(description);
    setEditedName(name);
  }, [description, name]);

  return (
    <Modal
      onClose={onClose}
      open={open}
      style={{ height: '350px', padding: '24px', width: 'min(500px, 100%)' }}
    >
      <Typography style={{ color: '#FCFCFC' }} variant="h4">
        {edit ? 'Edit' : 'Save'} Query
      </Typography>
      <Input
        onChange={(e) => setEditedName(e.target.value)}
        title="Name"
        value={editedName}
      />
      <Input
        onChange={(e) => setEditedDescription(e.target.value)}
        optional
        rows={6}
        textarea
        title="Description"
        value={editedDescription}
        wrapperStyle={{ marginTop: '24px' }}
      />
      <Flex
        justifyContent="space-between"
        style={{
          bottom: '24px',
          position: 'absolute',
          width: 'calc(100% - 48px)',
        }}
      >
        <Button onClick={() => onClose()} text="Close" />
        <Button
          disabled={disabled}
          onClick={() => onFinish(editedDescription, editedName)}
          text="Save"
        />
      </Flex>
    </Modal>
  );
}
