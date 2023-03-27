import { useWeb3Modal } from '@web3modal/react';
import logo from 'assets/images/logo.png';
import Button from 'components/Button';
import { RootLocation } from 'locations';
import { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

const useStyles = createUseStyles({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  logo: {
    height: '200px',
    width: '200px',
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
      <img alt="Logo" className={styles.logo} src={logo} />
      <Button onClick={() => open()} text="Login" />
    </div>
  );
}
