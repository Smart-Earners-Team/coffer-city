import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/wrap"
import cmc from './../utils/extras/cmc.json'
import EarnersDropdown from "../components/EarnersDropdown"
import { FaCheck } from "react-icons/fa"
import CofferCityVaultABI from './../utils/ABIs/CofferVaultABI.json'
import { useContractInitializer } from "../hooks/useEthers"
import { getAmountForAssets } from "../hooks/getAmountForAssets"
import { ethers } from "ethers"

const getAddressArray = async () => {
    const contract = await useContractInitializer({ contractType: 'read', rpc: 'https://bsc-testnet.publicnode.com', contractAddress: '0xf1dEDfDcFEe07B6Baa24918DfaD3ef83bCC15Daf', contractABI: CofferCityVaultABI });

    let addrArray: string[];

    addrArray = await contract?.getSupportedTokens();
    // console.log(addrArray);

    return addrArray;
}

const getTokenData = async (tokenAddr: string) => {

    let tokenData = {
        address: tokenAddr,
        symbol: '',
        logo: ''
    };

    // Search the tokens array
    const token = cmc.tokens.find(token => token.address === tokenAddr);
    tokenData.logo = String(token?.logoURI);
    tokenData.symbol = String(token?.symbol);
    return tokenData;
}

const populateAssets = async () => {
    const addressArray: string[] = await getAddressArray();
    // console.log(addressArray);

    let assets = [];

    try {
        for (let i=0; i < addressArray.length; i++ ) {
            const tk = await getTokenData(addressArray[i]);
            // console.log(tk);
            assets.push(tk);
        }
    } catch (error) {
        console.log(error)
    }

    // console.log(assets);
    return assets;
}

interface SP {
    address: string;
    symbol: string;
    logo: string;
}

const Deposits = () => {

    const [supportedAssets, setSupportedAssets] = useState<SP[]>([{
        address: '',
        symbol: '',
        logo: '',
    }]);

    const [ tokenAmounts, setTokenAmounts ] = useState<number[]>([]) 

    useEffect(()=>{
        const fetchAssets = async () => {
            const res = await populateAssets();
            setSupportedAssets(res);
        }

        fetchAssets();
    }, [])

    const selectAsset = async (val: SP) => {
        setSelectedAsset(val);
        try {
            const res = await getAmountForAssets(val.address);
            const tRes: bigint[] = res.amountTiersByToken;
            // console.log(tRes);

            // Convert each item in the array to a parseFloat value
            const tokenTiers = tRes.map(item => parseFloat(ethers.formatUnits(item, res.assetDecimals)));

            // console.log(tokenTiers);

            setTokenAmounts(tokenTiers);

        } catch (error) {
            console.log(error)
        }
    }

    const [selectedAsset, setSelectedAsset] = useState<SP | null>(null);
    // const [selectedDuration, setSelectedDuration] = useState<Date | null>(null);

    const dropdownOptions: string[] = [`month${'s'}`, `year${'s'}`];

    // const actionHandlers: { [key: string]: () => void } = {
    //     'Option 1': () => console.log('Option 1 selected'),
    //     'Option 2': () => console.log('Option 2 selected'),
    //     'Option 3': () => console.log('Option 3 selected'),
    // };

    return (
        <React.Fragment>
            <Helmet>
                <title>New Deposits | Coffer City</title>
            </Helmet>
            <Layout navbar footer>
                <div className="grid gap-10 px-10 md:px-32 pt-[38%] md:pt-[13%] h-[120%] md:h-[130%]">
                    <div className="grid gap-8">

                        <div>
                            <div className="text-4xl font-dynapuff font-bold">Pick An Asset</div>
                            <div className="grid gap-5 grid-cols-2 md:grid-cols-5">
                                {
                                    supportedAssets.map((val) => (
                                        <div
                                            key={val.address}
                                            className={`grid gap-2 rounded-xl p-5 relative cursor-pointer transform transition-transform duration-300 ease-in-out ${val.address === selectedAsset?.address ? 'bg-[#27A844]/40' : 'bg-slate-300/30'}`}
                                            onClick={async () => (
                                                await selectAsset(val)
                                            )}
                                            style={{ transform: val.address === selectedAsset?.address ? 'scale(0.9)' : 'scale(1)' }}
                                        >
                                            <div className="absolute top-0 left-0">
                                                {val.address === selectedAsset?.address && (
                                                    <div className="bg-slate-50 p-2 m-2 rounded-lg">
                                                        <FaCheck className="text-[#27A844]" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2 font-semibold flex-col items-center justify-center">
                                                <img src={val.logo} className="mx-auto select-none" />
                                                <div className="mx-auto">{val.symbol}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        
                        {
                            selectedAsset && (
                                <div>
                                    <div className="text-2xl font-dynapuff font-bold">Pick Weekly Amount</div>
                                    <div className="md:flex md:flex-wrap grid gap-2">
                                        {
                                            selectedAsset && tokenAmounts && (
                                                <div key={selectedAsset.address} className="flex flex-wrap gap-2" >
                                                    {
                                                        tokenAmounts.map((tk)=>(
                                                            <button 
                                                                key={tk} className="my-auto rounded-lg border p-2 hover:bg-[#27A844]/40 duration-300">
                                                                {tk} {selectedAsset.symbol}
                                                            </button>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <input min={5} autoFocus={false} type="number" id="wAmount" name="wAmount" className="bg-transparent p-2 px-3 rounded-lg ring-1 ring-slate-400 focus:ring-slate-500 outline-none duration-300 w-fit" placeholder="Ex. $200" />
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            selectedAsset && (
                                <div>
                                    <div className="text-2xl font-dynapuff font-bold">Pick a duration</div>
                                    <div className="md:flex grid gap-3">
                                        <div className="flex flex-wrap gap-2">
                                            <button className="my-auto rounded-lg border p-2 hover:bg-blue-900 hover:text-slate-50 duration-300">1 month</button>
                                            <button className="my-auto rounded-lg border p-2 hover:bg-blue-900 hover:text-slate-50 duration-300">3 months</button>
                                            <div className="grid md:flex gap-2 text-xs">
                                                <input min={1} 
                                                defaultValue={1}
                                                autoFocus={false} type="number" id="duration" name="duration" className="bg-transparent p-2 px-3 rounded-lg ring-1 ring-slate-400 focus:ring-slate-500 outline-none duration-300" />
                                            </div>
                                        </div>
                                        <div className="my-auto">
                                            <EarnersDropdown
                                                className="w-fit"
                                                options={dropdownOptions}
                                            // actionHandlers={actionHandlers}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                    </div>
                </div>
            </Layout>
        </React.Fragment>
    )
}

export default Deposits
