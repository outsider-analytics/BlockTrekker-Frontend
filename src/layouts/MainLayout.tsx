import { ReactNode } from 'react';
import Header from './components/Header';

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 80px)' }}>{children}</div>
    </div>
  );
}
