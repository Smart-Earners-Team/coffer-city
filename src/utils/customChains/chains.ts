import { Chain } from "@rainbow-me/rainbowkit";

export const tToro: Chain = {
  id: 54321,
  name: "Toronet Testnet",
  network: "toronet",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/5167.png",
  nativeCurrency: {
    decimals: 18,
    name: "TestToro",
    symbol: "tToro",
  },
  rpcUrls: {
    public: { http: ["https://testnet.toronet.org/rpc/"] },
    default: { http: ["https://testnet.toronet.org/rpc/"] },
  },
  blockExplorers: {
    etherscan: {
      name: "Toronet Explorer",
      url: "https://testnet.toronet.org/",
    },
    default: { name: "Toronet Explorer", url: "https://testnet.toronet.org/" },
  },
  contracts: {
    multicall3: {
      address: "0x3364045D78f0df62425C48B721FC5C1c742bD7fb",
      blockCreated: 14308550,
    },
  },
} as const satisfies Chain;

export const KavaEVM: Chain = {
  id: 2222,
  name: "Kava EVM",
  network: "kava",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/200x200/4846.png",
  nativeCurrency: {
    decimals: 18,
    name: "Kava",
    symbol: "KAVA",
  },
  rpcUrls: {
    public: { http: ["https://kava-evm.publicnode.com/"] },
    default: { http: ["https://kava-evm.publicnode.com/"] },
  },
  blockExplorers: {
    etherscan: { name: "Kava Explorer", url: "https://explorer.kava.io/" },
    default: { name: "Kava Explorer", url: "https://explorer.kava.io/" },
  },
  contracts: {
    multicall3: {
      address: "0x6A9a1D41269e979733b8D7C66d3600CEB02Efd01",
      blockCreated: 7147633,
    },
  },
} as const satisfies Chain;
