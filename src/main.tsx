import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Chain, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { AppContextProvider } from "./components/wrap";
import { bscTestnet, bsc } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';

export const tToro: Chain = {
  id: 54321,
  name: 'Toronet Testnet',
  network: 'toronet',
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/200x200/5167.png',
  nativeCurrency: {
    decimals: 18,
    name: 'TestToro',
    symbol: 'tToro',
  },
  rpcUrls: {
    public: { http: ['https://testnet.toronet.org/rpc/'] },
    default: { http: ['https://testnet.toronet.org/rpc/'] },
  },
  blockExplorers: {
    etherscan: { name: 'Toronet Explorer', url: 'https://testnet.toronet.org/' },
    default: { name: 'Toronet Explorer', url: 'https://testnet.toronet.org/' },
  },
  contracts: {
    multicall3: {
      address: '0x3364045D78f0df62425C48B721FC5C1c742bD7fb',
      blockCreated: 14308550,
    },
  },
} as const satisfies Chain

// const chains = [bscTestnet]
const { chains, publicClient } = configureChains(
  [bscTestnet, tToro, bsc],
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
      <RainbowKitProvider showRecentTransactions={true} chains={chains} initialChain={tToro}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)
