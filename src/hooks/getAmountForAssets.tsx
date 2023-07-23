import { useContractInitializer } from "./useEthers"
import CofferCityVaultABI from './../utils/ABIs/CofferVaultABI.json'
import ERC20ABI from './../utils/ABIs/ERC20ABI.json'

export const getAmountForAssets = async (address: string) => {

    const contract = await useContractInitializer({ contractType: 'read', rpc: 'https://bsc-testnet.publicnode.com', contractAddress: '0xf1dEDfDcFEe07B6Baa24918DfaD3ef83bCC15Daf', contractABI: CofferCityVaultABI });

    const assetContract = await useContractInitializer({ contractType: 'read', rpc: 'https://bsc-testnet.publicnode.com', contractAddress: address, contractABI: ERC20ABI });

    const amountTiersByToken: bigint[] = await contract?.getAmountTiersByToken(address);
    // console.log(amountTiersByToken);

    const assetDecimals: number = await assetContract?.decimals();

    // const durationTiers = await contract?.

    const result = { amountTiersByToken, assetDecimals }

    return result;
}
