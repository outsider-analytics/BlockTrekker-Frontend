import { useWeb3Modal } from '@web3modal/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { useAccount } from 'wagmi';
import { RootLocation } from 'locations';
import Button from 'components/Button';

const useStyles = createUseStyles({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  text: {
    color: '#FCFCFC',
    fontSize: '64px',
    fontWeight: 500,
    maxWidth: '750px',
    textAlign: 'center',
  },
});

export default function Login(): JSX.Element {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const { open } = useWeb3Modal();
  const styles = useStyles();

  useEffect(() => {
    if (isConnected) {
      navigate(RootLocation);
    }
  }, [isConnected, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.text}>BlockTrekker</div>
      <Button onClick={() => open()} text='Login' />
    </div>
  );
}
