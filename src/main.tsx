import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react'; // ✅ CORRECT
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import './index.css';
import theme from './theme';

const queryClient = new QueryClient(); 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
