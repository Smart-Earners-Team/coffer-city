import { Chain } from '@rainbow-me/rainbowkit';

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