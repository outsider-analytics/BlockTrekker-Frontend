import { useWeb3Modal } from '@web3modal/react';
import logo from 'assets/images/logo.png';
import Button from 'components/Button';
import { useTrekkerProfile } from 'contexts/UserContext';
import { RootLocation } from 'locations';
import { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { signedIn } = useTrekkerProfile();
  const { open } = useWeb3Modal();
  const styles = useStyles();

  useEffect(() => {
    if (signedIn) {
      navigate(RootLocation);
    }
  }, [navigate, signedIn]);

  return (
    <>
      <div className={styles.container}>
        <img alt="Logo" className={styles.logo} src={logo} />
        <Button onClick={() => open()} text="Sign-In" />
      </div>
    </>
  );
}
