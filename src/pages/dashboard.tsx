import React, { useCallback, useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/wrap"
import { BsShieldFillCheck, BsShieldFillExclamation } from 'react-icons/bs'
import { FaChartLine, FaChartPie, FaEye, FaEyeSlash, FaGift, FaPlusCircle } from "react-icons/fa"
import { Link } from "react-router-dom"
import { fetchTokenPairs, getUserDetails } from "../hooks/getUserDetails"
import { useAccount, 
    // useNetwork 
} from "wagmi"
import usePreloader, { Preloader } from "../hooks/usePreloader"
import { WalletConnectButton } from "../components/ConnectWallet"
import { useContractInitializer } from "../hooks/useEthers"
import ERC20ABI from './../utils/ABIs/ERC20ABI.json'
import BigNumber from "bignumber.js"

const Dashboard = () => {
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(true);
    const [savingsBalance, setSavingsBalance] = useState<number>(0);
    const { address, isConnected, isConnecting } = useAccount();
    // const { chain } = useNetwork();
    // console.log(chain?.network);
    // console.log(chains)

    const getActivityStatus = async () => {
        let savingsBalance: number = 0;
        const data = await getUserDetails(String(address));

        const totalBalances = data.totalBalances;
        const balanceArr: [string, number][] = Object.entries(totalBalances);

        // Create an array of promises for the asynchronous operations
        const promises = balanceArr.map(async ([address, value]) => {
            // console.log(value)
            const assetContract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: String(address), contractABI: ERC20ABI });

            const assetDecimals: number = await assetContract?.decimals();
            // console.log(assetDecimals);
            
            const amt = new BigNumber(Number(value)).div(new BigNumber(10).pow(Number(assetDecimals))).toNumber();
            // console.log(amt);

            // const priceUsd: number = await fetchTokenPairs(address, String(chain?.network));

            const priceUsd: number = await fetchTokenPairs('0xeC1F55b5Be7Ee8c24Ee26B6Cc931ce4d7Fd5955C', 'bsc');

            const val = amt * priceUsd;
            savingsBalance += val;
        });

        // Wait for all promises to complete before updating and returning savingsBalance
        await Promise.all(promises);

        const isActive: boolean = data.isActive;

        return {
            savingsBalance,
            isActive
        };
    }

    useEffect(() => {
        const setPageData = async () => {
            const { savingsBalance, isActive } = await getActivityStatus();
            // console.log(savingsBalance, isActive);
            setIsActive(isActive);
            setSavingsBalance(Number(savingsBalance.toFixed(3)));
        }

        setPageData();
    }, [address]);
    
    const handleValueVisibility = () => {
        setIsVisible(!isVisible);
    }

    // Define your text conditionally
    let loadingText = 'Fetching data . . .';
    if (!isConnected) loadingText = "Please connect your wallet!"
    if (isConnecting) loadingText = "Connecting to your wallet. Please wait!"

    const checks = useCallback(async () => {
        // Perform your checks here. For example:
        const loaded = isConnected ? true : false;
        return loaded;
    }, [address, isConnected]);

    // Use the usePreloader hook, passing in the checks and the custom text
    const { loading } = usePreloader({ checks, text: loadingText });

    // Conditionally render the Preloader or your actual content based on the loading state
    if (loading) {
        return <Preloader text={loadingText} children={
            <WalletConnectButton />
        } />;
    };
    
    return (
        <React.Fragment>
            <Helmet>
                <title>Dashboard | Coffer City</title>
                {/* <!-- Meta --> */}
                <meta charSet="utf-8" />

                <meta http-equiv="X-UA-Compatible" content="IE=edge" />

                <meta name="viewport" content="width=device-width,initial-scale=1" />

                {/* <!-- The above 3 meta tags must come first in the head; any other head content must come after these tags --> */}
                <meta name="description" content="Crypto Saving Made Simple, Smart, and Secure. Powered by decentralized blockchain technology. Start saving your crypto today!" />

                <meta name="keywords" content="blockchain, dApp, decentralized applications, DeFi, decentralized finance, NFT, non-fungible tokens, cryptocurrency, crypto, Bitcoin, Binance Smart Chain, how to save money in cryptocurrency, save with crypto, how to save crypto in wallet, where can I save my bitcoin, how to save money in bitcoin, save in dollars, how to save cryptocurrency, save with crypto, save in dollars in nigeria, save in bitcoin, safe haven crypto, how to save cryptocurrency, how to save crypto, Save crypto to usd, Saving in dollars in Nigeria, How to save in US dollar in nigeria" />

                <meta property="og:site_name" content="Crypto Saving Made Simple, Smart, and Secure." />

                <meta property="og:title" content="Crypto Saving Made Simple, Smart, and Secure. " />

                <meta property="og:type" content="website" />

                <meta property="og:description" content="Crypto Saving Made Simple, Smart, and Secure. Powered by decentralized blockchain technology. Start saving your crypto today!" />

                <meta property="og:image" content="https://coffer.city/images/share.jpg" />

                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:width" content="512" />
                <meta property="og:image:height" content="315" />
                <meta property="og:url" content="https://coffer.city" />
                <meta property="twitter:card" content="summary_large_image" />

                <meta name="title" content="&quot;Coffer City offers the feature to top-up your deposits every week. It's an excellent way to save more when you have spare cash.&quot;" />

                <link rel="canonical" href="https://coffer.city" />

                <link rel="icon" type="image/png" href="images/favicon.png" />
                <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
            </Helmet>
            <Layout navbar footer>
                <div className="grid gap-10 px-10 md:px-32 pt-[38%] md:pt-[13%] h-[120%] md:h-[130%]">
                    <div>
                        <div className="md:flex w-full gap-5 relative justify-center">
                            <div className="p-4 grid gap-1 relative w-full md:w-[30%] rounded-xl bg-[#02075d] text-slate-50">
                                <div className='text-xs'>Total Savings</div>
                                <div className="text-2xl font-bold text-ellipsis">
                                    {
                                        isVisible ? `$${savingsBalance}` : '*******'
                                    }
                                </div>
                                <button onClick={handleValueVisibility} className="absolute text-lg right-5 h-full py-5 top-0">
                                    {
                                        isVisible ? <FaEye/> : <FaEyeSlash/>
                                    }
                                </button>
                            </div>
                            <div className="grid gap-3 text-xs py-3 md:py-0">
                                <Link to={'/overview'} className='font-bold p-2 rounded-lg bg-[#02075d] text-slate-50 h-fit m-auto hover:bg-[#02075d]/90 duration-300'>
                                    <FaPlusCircle className='inline m-1 -ml-0'/>
                                    Top-Up
                                </Link>
                                {/* <button className="p-2 rounded-lg bg-gray-300 text-slate-800 hover:bg-gray-300/90 duration-300">New Deposit</button> */}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>Quick Actions</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                            <Link to='' className={`rounded-lg ${isActive ? 'bg-[#27A844]/10' : 'bg-[#9d2b3c]/10'} p-5 grid gap-5 items-center`}>
                                <span className={`rounded-full w-fit h-fit bg-slate-50 ${isActive ? 'text-[#27A844]' : 'text-[#9d2b3c]'}`}>
                                    {
                                        isActive ? <BsShieldFillCheck className='m-3 text-xl' /> : <BsShieldFillExclamation className='m-3 text-xl' />
                                    }
                                </span>
                                <div className="flex flex-col justify-center">
                                    <div className="font-bold">Account Status</div>
                                    <div className="text-xs">
                                        {
                                            isActive ? 'Active' : 'You don\'t have an active savings.'
                                        }
                                    </div>
                                </div>
                            </Link>

                            <Link to='/rewards' className="rounded-lg bg-[#02075d]/10 p-5 grid gap-5 items-center">
                                <span className="rounded-full w-fit h-fit bg-slate-50 text-[#02075d]">
                                    <FaGift className='m-3 text-xl' />
                                </span>
                                <div className="flex flex-col justify-center">
                                    <div className="font-bold">Refer a friend</div>
                                    <div className="text-xs">Invite friends and earn rewards</div>
                                </div>
                            </Link>

                            <Link to='/overview' className="rounded-lg bg-[#FFD700]/10 p-5 grid gap-5 items-center">
                                <span className="rounded-full w-fit h-fit bg-slate-50 text-[#FFD700]">
                                    <FaChartLine className='m-3 text-xl' />
                                </span>
                                <div className="flex flex-col justify-center">
                                    <div className="font-bold">Saving progress</div>
                                    <div className="text-xs">Check your saving progress</div>
                                </div>
                            </Link>

                            <Link to='/deposit' className="rounded-lg bg-[#795548]/10 p-5 grid gap-5 items-center">
                                <span className="rounded-full w-fit h-fit bg-slate-50 text-[#795548]">
                                    <FaChartPie className='m-3 text-xl' />
                                </span>
                                <div className="flex flex-col justify-center">
                                    <div className="font-bold">New Savings</div>
                                    <div className="text-xs">Start saving for that well-deserved vacation or your dream home.</div>
                                </div>
                            </Link>

                        </div>

                    </div>
                </div>
            </Layout>
        </React.Fragment>
    )
}

export default Dashboard
