// import { useContractInitializer } from "./useEthers"
// import { addresses } from "./addresses";
// import { ethers } from "ethers";

// const abi = [
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": true,
//                 "internalType": "address",
//                 "name": "beneficiary",
//                 "type": "address"
//             },
//             {
//                 "indexed": true,
//                 "internalType": "address",
//                 "name": "NFTContract",
//                 "type": "address"
//             },
//             {
//                 "indexed": false,
//                 "internalType": "uint256",
//                 "name": "id",
//                 "type": "uint256"
//             }
//         ],
//         "name": "NFTRewarded",
//         "type": "event"
//     }
// ]

// const Iface = new ethers.Interface(abi);

export interface ReferralRewardPaidLogs {
    status: string;
    message: string;
    result: {
        address: string;
        topics: string[];
        data: string;
        blockNumber: string;
        blockHash: string;
        timeStamp: string;
        gasPrice: string;
        gasUsed: string;
        logIndex: string;
        transactionHash: string;
        transactionIndex: string;
    }[];
};

export const useReferralLogs = async (addr: string, CA: string) => {

    // const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: addresses.CofferCityVault[97], contractABI: abi });

    // const eventFilter = contract.filters.NFTRewarded(null, addr);

    // console.log(eventFilter);

    // const { beneficiary, topics } = eventFilter;

    let dataX: ReferralRewardPaidLogs;

    const address = addr.slice(2);

    const binanceAPI = `https://api-testnet.bscscan.com/api?module=logs&action=getLogs&fromBlock=32141034&toBlock=32161585&address=${CA}&topic0=0x385b6cb5cdf8ac8e4b220175bd2c4cc18f4ffeaf5abe0d13caf477594a390d73&topic0_1_opr=and&topic1=0x000000000000000000000000${address}&apikey=YourApiKeyToken`;

    // console.log(binanceAPI);

    let topicsArray = {
        topic0: "",
        topic1: "",
        topic2: ""
    };

    return fetch(binanceAPI)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(jsonData => {
            dataX = jsonData as ReferralRewardPaidLogs;
            const resultLength = dataX.result.length;

            if (resultLength > 0) {
                for (let i = 0; i < resultLength; i++) {
                    const topics: string[] = dataX.result[i].topics;
                    const topic0 = topics[0];
                    const topic1 = topics[1].replace('0x000000000000000000000000', '0x');
                    const topic2 = topics[2].replace('0x000000000000000000000000', '0x');
                    // console.log(topic0, topic1, topic2);

                    topicsArray = {
                        topic0: topic0,
                        topic1: topic1,
                        topic2: topic2,
                    };
                }
            }

            return {
                topicsArray,
                // other data
                // fullData: dataX,
            };

        })
        .catch(err => {
            console.log(err.message);
        });
};
