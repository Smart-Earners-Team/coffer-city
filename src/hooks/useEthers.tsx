import { ethers } from 'ethers'

interface ContractInitializer {
    contractType: 'read' | 'write',
    rpc?: string,
    address?: ethers.Wallet,
    contractAddress?: string,
    contractABI?: any;
}

export const useContractInitializer = async ({ contractType, rpc = 'http://localhost:8545', address, contractAddress = '0x0000000000000000000000000000000000000000', contractABI = [] }: ContractInitializer) => {
    let contract: ethers.Contract | undefined;
    try {
        const JsonProvider = new ethers.JsonRpcProvider(rpc);
        // const signerOrProvider = address ? await JsonProvider.getSigner(address) : JsonProvider;
        const signer = address?.connect(JsonProvider)

        if (contractType === 'read' || !address) {
            contract = new ethers.Contract(contractAddress, contractABI, JsonProvider);
        }
        else if (contractType === 'write') {
            contract = new ethers.Contract(contractAddress, contractABI, signer);
        }

        return contract;
    } catch (error) {
        console.error('Failed to initialize contract:', error);
        throw error;
    }
}
