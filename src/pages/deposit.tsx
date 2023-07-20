import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/wrap"
import cmc from './../utils/cmc.json'

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

    return (
        <React.Fragment>
            <Helmet>
                <title>New Deposits | Coffer City</title>
            </Helmet>
            <Layout navbar footer>
                <div className="grid gap-10 px-10 md:px-32 pt-[38%] md:pt-[13%] h-[120%] md:h-[130%]">
                    <div className="grid gap-5">
                        <div className="text-4xl font-dynapuff font-bold">Pick An Asset</div>
                        <div className="grid gap-5 grid-cols-2 md:grid-cols-5">
                            {
                                supportedAssets.map((val)=> (
                                    <div key={val.address} className='grid gap-2 rounded-xl bg-slate-300/50 p-5'>
                                        <img src={val.logo} className="mx-auto" />
                                        {/* <div className="text-xs overflow-hidden overflow-ellipsis whitespace-nowrap">{val.address}i</div> */}
                                        <div className="mx-auto">{val.symbol}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </Layout>
        </React.Fragment>
    )
}

export default Deposits
