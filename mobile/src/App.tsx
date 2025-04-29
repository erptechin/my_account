import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { MainProvider } from '@/src/contexts';
import "@/global.css";

import { Navigation } from './navigation';

const queryClient = new QueryClient();

export default function App() {

  return (
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        <MainProvider>
          <Navigation />
          <Toast />
        </MainProvider>
      </QueryClientProvider>
    </GluestackUIProvider >
  );
}