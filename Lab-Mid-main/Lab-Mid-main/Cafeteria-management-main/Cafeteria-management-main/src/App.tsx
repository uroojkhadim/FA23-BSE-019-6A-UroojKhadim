import React from 'react';
import AppRouter from '@/components/Router';
import { AuthProvider } from '@/contexts/AuthContext';
import { MemberProvider } from '@/integrations';
import { Toaster } from 'sonner';
import { Toaster as UIToaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MemberProvider>
        <AppRouter />
        <Toaster position="top-center" richColors />
        <UIToaster />
      </MemberProvider>
    </AuthProvider>
  );
};

export default App;
