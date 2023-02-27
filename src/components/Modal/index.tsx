import { CSSProperties, ReactNode, useEffect } from 'react';
import ReactModal from 'react-modal';

const customStyles = {
  content: {
    background: '#21201E',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    zIndex: 100001,
    padding: 0,
  },
  overlay: {
    background: 'transparent',
    backdropFilter: 'blur(8px)',
    border: 'none',
    zIndex: 100000,
  },
};

ReactModal.setAppElement('#root');

type IModal = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  style?: CSSProperties;
};

export default function Modal({
  open,
  onClose,
  children,
  style,
}: IModal): JSX.Element {
  const modalStyles = {
    content: {
      borderRadius: '0px',
      height: '600px',
      width: '700px',
      ...customStyles.content,
      ...style,
    },
    overlay: { ...customStyles.overlay },
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'scroll';
    }
  }, [open]);

  return (
    <ReactModal
      closeTimeoutMS={300}
      isOpen={open}
      onRequestClose={onClose}
      style={modalStyles}
      contentLabel='modal'
    >
      {children}
    </ReactModal>
  );
}
