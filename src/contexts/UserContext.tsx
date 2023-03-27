import { connectUser as connectUserCall } from 'api/userApi';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useAccount } from 'wagmi';

type UserContextType = {
  credits: number;
};

type UserProviderType = {
  children: ReactNode;
};

export const UserContext = createContext<UserContextType>({ credits: 0 });

export const UserProvider: React.FC<UserProviderType> = ({ children }) => {
  useAccount({
    async onConnect({ address }) {
      await connectUser(address ?? '');
    },
  });
  const [credits, setCredits] = useState(0);

  const connectUser = async (user: string) => {
    // TODO: Improve how user state is stored across app
    if (!user) return;
    const res = await connectUserCall(user);
    const data = await res.json();
    setCredits(data.credits || 0);
  };

  return (
    <UserContext.Provider value={{ credits }}>{children}</UserContext.Provider>
  );
};

export const useTrekkerProfile = (): UserContextType => useContext(UserContext);
