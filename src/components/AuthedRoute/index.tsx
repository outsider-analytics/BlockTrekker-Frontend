import { useTrekkerProfile } from 'contexts/UserContext';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type AuthedRouteProps = {
  children: ReactNode;
};

export const AuthedRoute = ({ children }: AuthedRouteProps): JSX.Element => {
  const { signedIn } = useTrekkerProfile();
  if (!signedIn) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};
