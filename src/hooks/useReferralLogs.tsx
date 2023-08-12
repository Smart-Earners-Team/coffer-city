import { useContractInitializer } from "./useEthers"
import CofferNftABI from './../utils/ABIs/CofferNftABI.json'

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

export const useReferralLogs = async (addr: string, CA: string, latestBlockNumber: string) => {

    // const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: addresses.CofferCityVault[97], contractABI: abi });

    // const eventFilter = contract.filters.NFTRewarded(null, addr);

    // console.log(eventFilter);

    // const { beneficiary, topics } = eventFilter;
    
    // console.log(latestBlockNumber);

    let dataX: ReferralRewardPaidLogs;

    const dataY: { nftCA: string, nftID: number }[] = []

    const address = addr.slice(2);

    const binanceAPI = `https://api-testnet.bscscan.com/api?module=logs&action=getLogs&fromBlock=32184602&toBlock=${latestBlockNumber}&address=${CA}&topic0=0x385b6cb5cdf8ac8e4b220175bd2c4cc18f4ffeaf5abe0d13caf477594a390d73&topic0_1_opr=and&topic1=0x000000000000000000000000${address}&apikey=YourApiKeyToken`;

    // console.log(binanceAPI);

    let nftID: number;

    let rewardsInfo: {nftCA: string, nftID: number};

    return fetch(binanceAPI)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(async jsonData => {
            dataX = jsonData as ReferralRewardPaidLogs;
            const resultLength = dataX.result.length;
            // console.log(resultLength);

            if (resultLength > 0) {
                for (let i = 0; i < resultLength; i++) {
                    const topics: string[] = dataX.result[i].topics;
                    // const topic0 = topics[0];
                    const topic1 = topics[2].replace('0x000000000000000000000000', '0x');
                    // const topic2 = topics[2].replace('0x000000000000000000000000', '0x');
                    // console.log(topic0, topic1, topic2);

                    nftID = parseInt(dataX.result[i].data, 16);

                    // await getRewardDetails(topic1, nftID);

                    rewardsInfo = {
                        nftCA: topic1,
                        nftID: nftID,
                    };

                    dataY.push(rewardsInfo);

                }
            }

            return dataY;

        })
        .catch(err => {
            console.log(err.message);
        });
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
