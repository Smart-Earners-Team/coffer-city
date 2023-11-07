import { useContractInitializer } from "./useEthers";
import CofferCityVaultABI from "./../utils/ABIs/CofferVaultABI.json";
import ERC20ABI from "./../utils/ABIs/ERC20ABI.json";

export const getAmountForAssets = async (
  address: string,
  rpcUrl: string,
  contractAddress: string
) => {
  console.log(rpcUrl);
  const contract = useContractInitializer({
    rpc: rpcUrl,
    contractAddress: contractAddress,
    contractABI: CofferCityVaultABI,
  });

  const assetContract = useContractInitializer({
    rpc: rpcUrl,
    contractAddress: contractAddress,
    contractABI: ERC20ABI,
  });

  console.log(assetContract);

  const amountTiersByToken: bigint[] = await contract?.getAmountTiersByToken(
    address
  );
  // console.log(amountTiersByToken);

  let assetDecimals: number;
  /* assetDecimals = await assetContract?.decimals();
  console.log("Hurray" + assetDecimals); */
  try {
    assetDecimals = await assetContract?.decimals();
    //.log("Hurray");
  } catch (error) {
    assetDecimals = 18;
    console.log(error);
  }

  const durationTiers: bigint[] = await contract?.getDurations();
  // console.log(durationTiers);

  const result = { amountTiersByToken, assetDecimals, durationTiers };

  return result;
};
