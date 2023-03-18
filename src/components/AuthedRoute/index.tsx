import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

type AuthedRouteProps = {
  children: ReactNode;
};

export const AuthedRoute = ({ children }: AuthedRouteProps): JSX.Element => {
  const { isConnected } = useAccount();
  if (!isConnected) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};
