import 'react-toastify/dist/ReactToastify.css';

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { UserProvider } from 'contexts/UserContext';
import { ThemeProvider } from 'react-jss';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import router from 'routes';
import { theme } from 'theme';
import { configureChains, createClient, mainnet, WagmiConfig } from 'wagmi';

const { REACT_APP_WALLET_CONNECT_ID: WALLET_CONNECT_ID } = process.env;

const { provider } = configureChains(
  [mainnet],
  [walletConnectProvider({ projectId: WALLET_CONNECT_ID ?? '' })]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: WALLET_CONNECT_ID ?? '',
    version: '2',
    appName: 'web3Modal',
    chains: [mainnet],
  }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, [mainnet]);

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider theme={theme}>
        <WagmiConfig client={wagmiClient}>
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </WagmiConfig>
      </ThemeProvider>
      <ToastContainer
        position="top-right"
        style={{ zIndex: 10000000000 }}
        theme="colored"
      />
      <Web3Modal
        projectId={WALLET_CONNECT_ID ?? ''}
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default App;
