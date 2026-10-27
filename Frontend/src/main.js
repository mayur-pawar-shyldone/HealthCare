import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/store';
import App from './App.tsx';
import { AccountProvider } from '@/account/AccountContext';
import { BookingCartProvider } from '@/cart/BookingCartContext';
import { SiteCartUi } from '@/components/site/SiteCartUi';
import './index.css';
import './styles/healthid-tailwind.css';
import './styles/healthid-account.css';
import './styles/hid-landing.css';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: true,
            staleTime: 0,
        },
    },
});
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(Provider, { store: store, children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(BrowserRouter, { children: _jsx(AccountProvider, { children: _jsxs(BookingCartProvider, { children: [_jsx(App, {}), _jsx(SiteCartUi, {})] }) }) }) }) }) }));
