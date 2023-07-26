import { useContractInitializer } from "./useEthers"
import CofferCityVaultABI from './../utils/ABIs/CofferVaultABI.json'
import { addresses } from "./addresses";
import { ethers } from "ethers";

export const getUserDetails = async (address: string ) => {

    const contract = await useContractInitializer({ contractType: 'read', rpc: 'https://bsc-testnet.publicnode.com', contractAddress: addresses.CofferCityVault[97], contractABI: CofferCityVaultABI });
    // console.log(contract);

    try {
        const userDepositIds = await contract?.getDepositsByOwnerAddress(address);
        // console.log(userDepositIds);

        let totalTopUps = 0;
        let firstDepositTime = Date.now() / 1000; // Current timestamp in seconds
        let latestDepositTime = 0;
        let isActive = false;

        // Initialize mappings for per-asset totals
        let totalBalances: { [key: string]: number } = {};
        let totalDebts: { [key: string]: number } = {};
        let totalFeesPaid: { [key: string]: number } = {};

        const userDeposits = [];

        for (let i = 0; i < userDepositIds.length; i++) {
            const deposit = await contract?.getDepositDetails(userDepositIds[i]);
            // console.log(deposit);

            // Get asset address as string
            const assetAddress = deposit.asset.toString();

            // Initialize asset totals if not yet done
            if (!(assetAddress in totalBalances)) {
                totalBalances[assetAddress] = 0;
                totalDebts[assetAddress] = 0;
                totalFeesPaid[assetAddress] = 0;
            }

            const debtWeeks = ethers.toNumber(await contract?.getDebtWeeks(Number(userDepositIds[i])));

            // Update per-asset totals
            totalBalances[assetAddress] += parseInt(deposit.balance);
            totalDebts[assetAddress] += debtWeeks * parseInt(deposit.amountPerWeek);
            totalFeesPaid[assetAddress] += (debtWeeks * parseInt(deposit.amountPerWeek)) - parseInt(deposit.balance);

            totalTopUps += parseInt(deposit.topUps);
            firstDepositTime = Math.min(firstDepositTime, Number(deposit.startTime));
            latestDepositTime = Math.max(latestDepositTime, Number(deposit.startTime));
            isActive = isActive || !deposit.withdrawn;

            userDeposits.push(deposit);
        }

        return {
            numberOfDeposits: userDepositIds.length,
            totalTopUps,
            userDeposits,
            totalBalances, // This is a mapping of asset address -> total balance
            totalDebts, // This is a mapping of asset address -> total debt
            firstDepositTime,
            latestDepositTime,
            totalFeesPaid, // This is a mapping of asset address -> total fees paid
            isActive
        };

    } catch (error) {
        console.log(error);
    }
}
