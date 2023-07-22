import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/wrap"
import cmc from './../utils/cmc.json'
import EarnersDropdown from "../components/EarnersDropdown"
import { FaCheck } from "react-icons/fa"

const getTokenData = (tokenAddr: string) => {

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

const addressArray = [
    '0x97A266490eFA4Fb564aD625AcCabE5641de2f805',
    '0x9CEFd9588f076c5f805341864adC8a6F077A5b99'
]

const populateAssets = () => {
    let assets = [];

    try {
        for (let i=0; i < addressArray.length; i++ ) {
            const tk = getTokenData(addressArray[i]);
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
    }])

    useEffect(()=>{
        const fetchAssets = async () => {
            const res = populateAssets();
            setSupportedAssets(res);
        }

        fetchAssets();
    }, [])

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
                                            className={`grid gap-2 rounded-xl bg-slate-300/50 p-5 relative cursor-pointer transform transition-transform duration-300 ease-in-out ${val.address === selectedAsset?.address ? 'bg-[#27A844]/50' : 'bg-slate-300/50'}`}
                                            onClick={() => (
                                                setSelectedAsset(val)
                                            )}
                                            style={{ transform: val.address === selectedAsset?.address ? 'scale(0.9)' : 'scale(1)' }}
                                        >
                                            <div className="absolute top-0 left-0">
                                                {val.address === selectedAsset?.address && (
                                                    <div className="bg-slate-50 p-3 m-2 rounded-lg">
                                                        <FaCheck className="text-[#27A844]" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-center justify-center">
                                                <img src={val.logo} className="mx-auto" />
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
                                    <div className="md:flex grid gap-2">
                                        {
                                            selectedAsset && (
                                                <div key={selectedAsset.address} className="flex gap-2">
                                                    <button className="my-auto rounded-lg border p-2 hover:bg-blue-900 hover:text-slate-50 duration-300">
                                                        5 {selectedAsset.symbol}
                                                    </button>
                                                    <button className="my-auto rounded-lg border p-2 hover:bg-blue-900 hover:text-slate-50 duration-300">
                                                        10 {selectedAsset.symbol}
                                                    </button>
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
