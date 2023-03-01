import { ReactNode } from 'react';
import Header from './components/Header';

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <Header />
      <div
        style={{
          minHeight: 'calc(100vh - 80px)',
          padding: '0px 16px 40px 16px',
          width: 'calc(100vw - 32px)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
