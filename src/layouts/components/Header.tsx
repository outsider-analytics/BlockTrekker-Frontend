import logo from 'assets/images/logo.png';
import Flex from 'components/Flex';
import Typography from 'components/Typography';
import { useTrekkerProfile } from 'contexts/UserContext';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { RootLocation } from 'locations';
import { useRef, useState } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import { truncateAddress } from 'utils';
import { useAccount, useDisconnect } from 'wagmi';

const useStyles = createUseStyles({
  container: {
    borderBottom: '1px solid #FCFCFC',
    boxSizing: 'border-box',
    height: '60px',
  },
  icon: {
    color: '#FCFCFC',
    cursor: 'pointer',
  },
  logo: {
    cursor: 'pointer',
    height: '34px',
    width: '34px',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: '1px solid #FCFCFC',
    borderRadius: '4px',
    color: '#FCFCFC',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    padding: '8px 16px',
  },
  menu: {
    backgroundColor: '#34383D',
    border: '1px solid #FCFCFC',
    borderRadius: '4px',
    height: '100px',
    left: '50%',
    padding: '8px',
    position: 'absolute',
    top: '110%',
    transform: 'translateX(-50%)',
    width: '120px',
  },
  usdc: {
    height: '16px',
    width: '16px',
  },
});

export default function Header(): JSX.Element {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);
  const styles = useStyles();
  const { credits } = useTrekkerProfile();

  useOutsideAlerter(popoverRef, () => setShowPopover(false));

  return (
    <div className={styles.container}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        ml="24px"
        mr="24px"
        style={{ height: '100%' }}
      >
        <Flex alignItems="center" gap="8px">
          <img
            alt="Logo"
            className={styles.logo}
            onClick={() => navigate(RootLocation)}
            src={logo}
          />
          <Typography style={{ color: '#FCFCFC' }} variant="h5">
            BlockTrekker
          </Typography>
        </Flex>
        <Flex alignItems="center" gap="16px">
          <div
            onClick={() => setShowPopover(!showPopover)}
            ref={popoverRef}
            style={{ position: 'relative' }}
          >
            <AiOutlineUser className={styles.icon} size={24} />
            {showPopover && (
              <div className={styles.menu}>
                <Flex
                  alignItems="center"
                  gap="4px"
                  style={{ color: '#FCFCFC', height: '100%' }}
                >
                  <Typography variant="subtitle1">Credits:</Typography>
                  {credits}
                </Flex>
              </div>
            )}
          </div>
          <button className={styles.logoutButton} onClick={() => disconnect()}>
            {truncateAddress(address ?? '')}
          </button>
        </Flex>
      </Flex>
    </div>
  );
}
