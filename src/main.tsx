import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { AppContextProvider } from "./components/wrap";
import { bscTestnet, bsc } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';

// const chains = [bscTestnet]
const { chains, publicClient } = configureChains(
  [bscTestnet, bsc],
  [
    publicProvider()
  ]
);

const projectId = 'dc1010b0fa2321b0bcc8494ad8356de2'

const { connectors } = getDefaultWallets({
  appName: 'Coffer City',
  projectId: projectId,
  chains,
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <RainbowKitProvider showRecentTransactions={true} chains={chains} initialChain={bscTestnet}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)
