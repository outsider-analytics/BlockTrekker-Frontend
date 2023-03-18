import Flex from 'components/Flex';
import { createUseStyles } from 'react-jss';
import { truncateAddress } from 'utils';
import { useAccount, useDisconnect } from 'wagmi';

const useStyles = createUseStyles({
  colorBanner: {
    backgroundColor: '#5451FF',
    height: '8px',
    width: '100%',
  },
  container: {
    boxSizing: 'border-box',
    height: '80px',
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
});

export default function Header(): JSX.Element {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <div className={styles.colorBanner} />
      <Flex
        alignItems="center"
        justifyContent="flex-end"
        ml="40px"
        mr="40px"
        style={{ height: '100%' }}
      >
        <button className={styles.logoutButton} onClick={() => disconnect()}>
          {truncateAddress(address!)}
        </button>
      </Flex>
    </div>
  );
}
