import { ReactNode, HTMLAttributes } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
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
    appName: 'NFT Apocalypse',
    projectId: projectId,
    chains,
});

const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient
});

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    navbar?: ReactNode;
    footer?: ReactNode;
}

const Layout = ({ children, navbar, footer, ...props }: LayoutProps) => {
    return (
        <WagmiConfig config={config}>
            <RainbowKitProvider showRecentTransactions={true} chains={chains} initialChain={bscTestnet}>
                <div className="font-manrope text-sm" {...props}>
                    <div className='absolute top-5 w-full text-slate-50'>
                        {navbar && <Navbar />}
                    </div>

                    <main className="">
                        {children}
                    </main>

                    <div className='py-10'>
                        {footer && <Footer />}
                    </div>
                </div>
            </RainbowKitProvider>
        </WagmiConfig>
    );
};

export default Layout;
