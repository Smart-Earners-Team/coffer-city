import { useContractInitializer } from "./useEthers"
import CofferCityVaultABI from './../utils/ABIs/CofferVaultABI.json'
import { addresses } from "./addresses";
import { ethers } from "ethers";

export const getUserDetails = async (address: string ) => {

    const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: addresses.CofferCityVault[97], contractABI: CofferCityVaultABI });
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
        return {
            numberOfDeposits: 0,
            totalTopUps: 0,
            userDeposits: [],
            totalBalances: {}, // This is a mapping of asset address -> total balance
            totalDebts: 0, // This is a mapping of asset address -> total debt
            firstDepositTime: 0,
            latestDepositTime: 0,
            totalFeesPaid: 0, // This is a mapping of asset address -> total fees paid
            isActive: false,
        }
    }
}

export const getDepositIds = async (address: string) => {
    const contract = useContractInitializer({rpc: 'https://bsc-testnet.publicnode.com', contractAddress: addresses.CofferCityVault[97], contractABI: CofferCityVaultABI });
    // console.log(contract);

    const userDepositIds = await contract?.getDepositsByOwnerAddress(address);
    // console.log(userDepositIds);
    return userDepositIds;
}

export const getDepositDetails = async (id: number) => {
    let result = {
        owner: '',
        asset: '',
        startTime: 0,
        amountPerWeek: 0,
        duration: 0,
        balance: 0,
        topUps: 0,
        withdrawn: false,
    }

    const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: addresses.CofferCityVault[97], contractABI: CofferCityVaultABI });

    try {
        const data = await contract?.getDepositDetails(id);

        result = {
            owner: String(data[0]),
            asset: String(data[1]),
            startTime: Number(data[2]),
            amountPerWeek: Number(data[3]),
            duration: Number(data[4]),
            balance: Number(data[5]),
            topUps: Number(data[6]),
            withdrawn: Boolean(data[7]),
        };

        return result;
    } catch (error) {
        console.error(error);
        return result;
    }
}

export const getProgressPercentage = (startTime: number, duration: number) => {
    const elapsedTime: number = (Date.now() - (startTime * 1000));
    // console.log(elapsedTime);
    // console.log(Date.now());
    // console.log((startTime + duration));
    // const progressPercentage: number = (((elapsedTime / duration) * 100) < 100) ? ((elapsedTime / duration) * 100) : 100;
    // console.log(progressPercentage);
    const progressPercentage: number = (elapsedTime / (duration * 1000)) * 100;
    return Math.min(progressPercentage, 100);
}

export const getDebtWeeks = async (depositId: number) => {
    const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: addresses.CofferCityVault[97], contractABI: CofferCityVaultABI });

    const debtWeeks = ethers.toNumber(await contract?.getDebtWeeks(depositId));
    // console.log(debtWeeks);
    return debtWeeks;
}

export async function parseTokenUri(uri: string) {
    let jsonString;

    if (uri.startsWith('ipfs://')) {
        jsonString = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
        const response = await fetch(jsonString);
        const jsonObject = await response.json();
        return jsonObject;
    } else if (uri.startsWith('data:application/json;base64,')) {
        const base64String = uri.replace("data:application/json;base64,", "");
        jsonString = atob(base64String);
        const jsonObject = JSON.parse(jsonString);
        return jsonObject;
    } else {
        throw new Error('Invalid IPFS URI');
    }
};

export async function fetchTokenPairs(address: string, chain: string) {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`;

    let price: number = 0;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const filteredData = data.pairs.filter((item: any) => item.chainId === chain && item.baseToken.address === address);

        if (filteredData[0].priceUsd > 0) {
            price = filteredData[0].priceUsd;
        }
    } catch (error) {
        console.error(error);
    }

    // console.log(price)
    return price;
};