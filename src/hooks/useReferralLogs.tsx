import { useContractInitializer } from "./useEthers"
import CofferNftABI from './../utils/ABIs/CofferNftABI.json'
import CofferCityVaultABI from './../utils/ABIs/CofferVaultABI.json'
import { ethers } from "ethers";

// export interface ReferralRewardPaidLogs {
//     status: string;
//     message: string;
//     result: {
//         address: string;
//         topics: string[];
//         data: string;
//         blockNumber: string;
//         blockHash: string;
//         timeStamp: string;
//         gasPrice: string;
//         gasUsed: string;
//         logIndex: string;
//         transactionHash: string;
//         transactionIndex: string;
//     }[];
// };

export interface EventLogger {
    _type: string;
    address: string;
    blockHash: string;
    blockNumber: number;
    data: string;
    index: number;
    removed: boolean;
    topics: string[];
    transactionHash: string;
    transactionIndex: number;
}

export const useReferralLogs = async (addr: string, CA: string, latestBlockNumber: bigint, fromBlockNumber: bigint, rpcUrl: string) => {

    // const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: CA, contractABI: CofferCityVaultABI });

    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const contract = new ethers.Contract(CA, CofferCityVaultABI, provider);
    
    const address = addr.slice(2);

    // const filter = contract.filters.NFTRewarded('0x385b6cb5cdf8ac8e4b220175bd2c4cc18f4ffeaf5abe0d13caf477594a390d73');
    
    const filter = contract.interface.getEvent("NFTRewarded");
    
    // let dataX: ReferralRewardPaidLogs;
    // let dataX: EventLogger;

    const dataY: { nftCA: string, nftID: number }[] = [];

    // const binanceAPI = `https://api-testnet.bscscan.com/api?module=logs&action=getLogs&fromBlock=32184602&toBlock=${latestBlockNumber}&address=${CA}&topic0=0x385b6cb5cdf8ac8e4b220175bd2c4cc18f4ffeaf5abe0d13caf477594a390d73&topic0_1_opr=and&topic1=0x000000000000000000000000${address}&apikey=YourApiKeyToken`;

    // console.log(binanceAPI);

    let nftID: number;

    let rewardsInfo: {nftCA: string, nftID: number};

    try {
        const logs = await provider.getLogs({
            ...filter,
            fromBlock: fromBlockNumber,
            toBlock: latestBlockNumber,
            address: CA,
            topics: [`${filter?.topicHash}`, `0x000000000000000000000000${address}`],
        });

        logs.forEach((log) => {
            const topic2 = log.topics[2].replace('0x000000000000000000000000', '0x');
            nftID = parseInt(log.data, 16);
            rewardsInfo = {
                nftCA: topic2,
                nftID: nftID,
            };
            dataY.push(rewardsInfo);
        });
    } catch (error) {
        console.error("Error fetching logs:", error);
    }

    // console.log(dataY);
    return dataY;

    // return fetch(binanceAPI)
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         return response.json();
    //     })
    //     .then(async jsonData => {
    //         dataX = jsonData as ReferralRewardPaidLogs;
    //         const resultLength = dataX.result.length;
    //         // console.log(resultLength);

    //         if (resultLength > 0) {
    //             for (let i = 0; i < resultLength; i++) {
    //                 const topics: string[] = dataX.result[i].topics;
    //                 // const topic0 = topics[0];
    //                 const topic1 = topics[2].replace('0x000000000000000000000000', '0x');
    //                 // const topic2 = topics[2].replace('0x000000000000000000000000', '0x');
    //                 // console.log(topic0, topic1, topic2);

    //                 nftID = parseInt(dataX.result[i].data, 16);

    //                 // await getRewardDetails(topic1, nftID);

    //                 rewardsInfo = {
    //                     nftCA: topic1,
    //                     nftID: nftID,
    //                 };

    //                 dataY.push(rewardsInfo);

    //             }
    //         }

    //         return dataY;

    //     })
    //     .catch(err => {
    //         console.log(err.message);
    //     });
};

export const getRewardDetails = async (nftCA: string, nftID: number) => {

    const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: nftCA, contractABI: CofferNftABI });

    const tokenURI = await contract.tokenURI(nftID);
    console.log(tokenURI);
    // const base64String = tokenURI.replace("data:application/json;base64,", "");
    // const jsonString = atob(base64String);
    // const jsonObject = JSON.parse(jsonString);
    // console.log(jsonObject);
    // return jsonObject;
}
