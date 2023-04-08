import { ethSignIn } from 'api/auth';
import {
  connectUser as connectUserCall,
  disconnectUser,
  reconnectUser,
} from 'api/userApi';
import { providers } from 'ethers';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAccount, useDisconnect } from 'wagmi';

type UserContextType = {
  credits: number;
  disconnect: () => void;
  restoringSession: boolean;
  signedIn: boolean;
};

type UserProviderType = {
  children: ReactNode;
};

export const UserContext = createContext<UserContextType>({
  credits: 0,
  disconnect: () => null,
  restoringSession: false,
  signedIn: false,
});

export const UserProvider: React.FC<UserProviderType> = ({ children }) => {
  const { disconnect: disconnectAddress } = useDisconnect();
  const [credits] = useState(0);
  const [restoringSession, setRestoringSession] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useAccount({
    async onConnect({ connector, isReconnected }) {
      // If not a reconnect then trigger sign in
      if (connector && !isReconnected) {
        const provider = new providers.Web3Provider(
          await connector.getProvider()
        );
        signIn(provider);
      }
    },
  });

  const disconnect = async () => {
    await disconnectUser();
    disconnectAddress();
    setSignedIn(false);
    // TODO: Clear cookies
  };

  const signIn = async (provider: providers.Web3Provider) => {
    const { message, signature } = await ethSignIn(provider);
    await connectUserCall({ message, signature });
    setSignedIn(true);
  };

  useEffect(() => {
    (async () => {
      const res = await reconnectUser();
      const { hasSession } = await res.json();
      setSignedIn(hasSession);
      setRestoringSession(false);
    })();
  }, []);

  return (
    <UserContext.Provider
      value={{ credits, disconnect, restoringSession, signedIn }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useTrekkerProfile = (): UserContextType => useContext(UserContext);
