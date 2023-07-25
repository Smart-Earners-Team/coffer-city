import { useContractInitializer } from "./useEthers"
import CofferCityVaultABI from './../utils/ABIs/CofferVaultABI.json'
import ERC20ABI from './../utils/ABIs/ERC20ABI.json'
import { addresses } from "./addresses";

export const getAmountForAssets = async (address: string) => {

    const contract = await useContractInitializer({ contractType: 'read', rpc: 'https://bsc-testnet.publicnode.com', contractAddress: addresses.CofferCityVault[97], contractABI: CofferCityVaultABI });

    const assetContract = await useContractInitializer({ contractType: 'read', rpc: 'https://bsc-testnet.publicnode.com', contractAddress: address, contractABI: ERC20ABI });

    const amountTiersByToken: bigint[] = await contract?.getAmountTiersByToken(address);
    // console.log(amountTiersByToken);

    const assetDecimals: number = await assetContract?.decimals();

    const durationTiers: bigint[] = await contract?.getDurations();
    // console.log(durationTiers);

    const result = { amountTiersByToken, assetDecimals, durationTiers }

    return result;
}
