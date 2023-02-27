import { useWeb3Modal } from '@web3modal/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { useAccount } from 'wagmi';
import { RootLocation } from 'locations';

const useStyles = createUseStyles({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  loginButton: {
    backgroundColor: '#34383D',
    border: 'none',
    borderRadius: '4px',
    color: '#FCFCFC',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 800,
    outline: 'transparent',
    padding: '12px 15px',
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
  }, [isConnected]);

  return (
    <div className={styles.container}>
      <div className={styles.text}>Dune Screwed You. We Fixed-It.</div>
      <button className={styles.loginButton} onClick={() => open()}>
        Login
      </button>
    </div>
  );
}
