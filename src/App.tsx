import { RouterProvider } from 'react-router-dom';
import router from 'routes';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createClient, mainnet, WagmiConfig } from 'wagmi';

const { REACT_APP_WALLET_CONNECT_ID: WALLET_CONNECT_ID } = process.env;

const { provider } = configureChains(
  [mainnet],
  [walletConnectProvider({ projectId: WALLET_CONNECT_ID! })]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: WALLET_CONNECT_ID!,
    version: '2',
    appName: 'web3Modal',
    chains: [mainnet],
  }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, [mainnet]);

function App() {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RouterProvider router={router} />
      </WagmiConfig>
      <Web3Modal
        projectId={WALLET_CONNECT_ID!}
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default App;
