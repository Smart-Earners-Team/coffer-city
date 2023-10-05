import React, { useEffect, useState } from 'react'
import Layout from '../components/wrap'
import { Helmet } from 'react-helmet'
import { Link, useParams } from 'react-router-dom'
import { getDebtWeeks, getDepositDetails, getProgressPercentage } from '../hooks/getUserDetails'
import { useAccount, useNetwork } from 'wagmi'
import { getTokenData } from './deposit'
import { useDateFromTimestamp } from '../hooks/getDuration'
import { getAmountForAssets } from '../hooks/getAmountForAssets'
import BigNumber from 'bignumber.js'
import ProgressBar from '../components/ProgressBar'
import { shortenAddress } from '../hooks/shortenAddress'
import { addresses } from '../hooks/addresses'
import CofferCityVaultABI from './../utils/ABIs/CofferVaultABI.json'
import ERC20ABI from './../utils/ABIs/ERC20ABI.json'
import { useEthersSigner } from '../hooks/wagmiSigner'
import { ethers } from 'ethers'
import { useContractInitializer } from '../hooks/useEthers'

interface DepositDetails {
    owner: string;
    asset: string;
    startTime: number;
    amountPerWeek: number;
    duration: number;
    balance: number;
    topUps: number;
    withdrawn: boolean;
}

interface SP {
    address: string;
    symbol: string;
    logo: string;
}

const DepositInfo = () => {

    const { depositId } = useParams();
    const { address } = useAccount();
    const { chain } = useNetwork();
    const cID = Number(chain?.id);
    const signer = useEthersSigner({ chainId: cID });
    
    const blockExplorerUrl = chain?.blockExplorers?.default.url;
    
    const [ depositDetails, setDepositDetails ] = useState<DepositDetails | null>(null);
    const [assetDetails, setAssetDetails] = useState<SP | null>(null);
    const [assetBalance, setAssetBalance] = useState<number>(0);
    const [amountWeekly, setAmountWeekly] = useState<number>(0);
    const [outstanding, setOutstanding] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const [withdrawn, setWithdrawn] = useState<boolean>(false);
    const [isApproved, setIsApproved] = useState<boolean>(false);

    useEffect(() => {
        const fetchPageData = async () => {
            const res = await getDepositDetails(Number(depositId));
            // console.log(res);
            setDepositDetails(res);

            const tk = await getTokenData(res.asset);
            // console.log(tk);
            
            const { assetDecimals } = await getAmountForAssets(tk.address);

            const debtWeeks = await getDebtWeeks(Number(depositId));
            // console.log(debtWeeks);

            const assetBal = new BigNumber(res.balance).div(new BigNumber(10).pow(Number(assetDecimals))).toNumber();
            // console.log(assetBal);
            
            const amtWeek = new BigNumber(res.amountPerWeek).div(new BigNumber(10).pow(Number(assetDecimals))).toNumber();
            // console.log(amtWeek);

            const outS = amtWeek * Number(debtWeeks);
            // console.log(outS);

            const apprStatus = await checkApproval(amtWeek, tk.address, res.owner);
            // console.log(apprStatus);

            setAssetDetails(tk);
            setAssetBalance(assetBal);
            setAmountWeekly(amtWeek);
            setOutstanding(outS);
            setIsApproved(apprStatus);
            setWithdrawn(res.withdrawn);
        }

        fetchPageData();

    }, [address]);

    useEffect(() => {
        const fetchProgress = () => {
            const prg = getProgressPercentage(Number(depositDetails?.startTime), Number(depositDetails?.duration));
            // console.log(prg);
            setProgress(prg);
        }

        // Then set up the interval
        const intervalId = setInterval(fetchProgress, 3000); // every 3 seconds

        // Be sure to clear your interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [depositDetails]);

    // console.log(depositDetails);
    // console.log(assetDetails);

    const handleTopUp = async () => {
        setOutstanding(0);
        const contract = new ethers.Contract(addresses.CofferCityVault[97], CofferCityVaultABI, signer);

        const res = await contract?.topup(Number(depositId));
        await res.wait();

        if (res) window.location.reload();
    };

    const handleWithdraw = async () => {
        setWithdrawn(true);
        const contract = new ethers.Contract(addresses.CofferCityVault[97], CofferCityVaultABI, signer);

        const res = await contract?.withdraw(Number(depositId));
        await res.wait();

        if (res) window.location.reload();
    };

    const handleApprove = async () => {
        const contract = new ethers.Contract(String(assetDetails?.address), ERC20ABI, signer);

        const approve = await contract?.approve(addresses.CofferCityVault[97], ethers.MaxUint256);
        await approve.wait();

        await checkApproval(Number(amountWeekly), String(assetDetails?.address), String(depositDetails?.owner));
    };

    const checkApproval = async (amount: number, CA: string, ownerAddress: string) => {
        const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: CA, contractABI: ERC20ABI });

        const allowance: number = await contract?.allowance(ownerAddress, addresses.CofferCityVault[97]);

        const assetDecimals: number = await contract?.decimals();
        // console.log(assetDecimals);

        const value = new BigNumber(Number(amount)).times(new BigNumber(10).pow(Number(assetDecimals))).toFixed();

        const status = (new BigNumber(allowance).gte(value)) ? true : false;

        setIsApproved(status);

        return status;
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>Overview ID {`${depositId}`} | Coffer City</title>
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
                <div className="grid gap-10 px-10 md:px-32 pt-[38%] md:pt-[13%] h-[120%] md:h-[130%] w-full">

                    {
                        withdrawn && (
                            <small className='mx-auto font-semibold text-lg'>This deposit has been withdrawn!</small>
                        )
                    }

                    <div className='grid gap-5 grid-cols-1 md:grid-cols-2 w-full'>
                        <div className='p-2 rounded-l-full rounded-r-full bg-slate-200 gap-3 flex'>
                            <div className='text-3xl my-auto rounded-full bg-slate-50 p-5 w-24 h-24'>
                                <svg fill='#ffd700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg>
                            </div>
                            <div className='my-auto'>
                                <div className='font-extrabold text-lg'>Owner</div>
                                <Link title='Owner Address' target='_blank' to={`${blockExplorerUrl ? (blockExplorerUrl+'/address/'+depositDetails?.owner) : ('#')}`} className='hover:underline underline-offset-2'>
                                    {shortenAddress(String(depositDetails?.owner))}
                                </Link>
                            </div>
                        </div>
                        <div className='p-2 rounded-l-full rounded-r-full bg-slate-200 gap-3 grid-cols-1 md:grid-cols-2 flex w-full'>
                            <div className='text-3xl my-auto rounded-full bg-slate-50 p-5 w-24 h-24'>
                                <img src={assetDetails?.logo} />
                            </div>
                            <div className='my-auto'>
                                <div className='font-extrabold text-lg'>Asset</div>
                                <div>{assetDetails?.symbol}</div>
                            </div>
                        </div>
                        <div className='p-2 rounded-l-full rounded-r-full bg-slate-200 gap-3 grid-cols-1 md:grid-cols-2 flex w-full'>
                            <div className='text-3xl my-auto rounded-full bg-slate-50 p-5 w-24 h-24'>
                                <svg fill='#ff7700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M232 120C232 106.7 242.7 96 256 96C269.3 96 280 106.7 280 120V243.2L365.3 300C376.3 307.4 379.3 322.3 371.1 333.3C364.6 344.3 349.7 347.3 338.7 339.1L242.7 275.1C236 271.5 232 264 232 255.1L232 120zM256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48C141.1 48 48 141.1 48 256z"/></svg>
                            </div>
                            <div className='my-auto'>
                                <div className='font-extrabold text-lg'>Duration</div>
                                <div>{useDateFromTimestamp(Number(depositDetails?.startTime))}&nbsp; to &nbsp;{useDateFromTimestamp(Number(Number(depositDetails?.startTime) + Number(depositDetails?.duration)))}</div>
                            </div>
                        </div>
                        <div className='p-2 rounded-l-full rounded-r-full bg-slate-200 gap-3 grid-cols-1 md:grid-cols-2 flex w-full'>
                            <div className='text-3xl my-auto rounded-full bg-slate-50 p-5 w-24 h-24'>
                                <svg fill='#5f3502' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 112.5V422.3c0 18 10.1 35 27 41.3c87 32.5 174 10.3 261-11.9c79.8-20.3 159.6-40.7 239.3-18.9c23 6.3 48.7-9.5 48.7-33.4V89.7c0-18-10.1-35-27-41.3C462 15.9 375 38.1 288 60.3C208.2 80.6 128.4 100.9 48.7 79.1C25.6 72.8 0 88.6 0 112.5zM288 352c-44.2 0-80-43-80-96s35.8-96 80-96s80 43 80 96s-35.8 96-80 96zM64 352c35.3 0 64 28.7 64 64H64V352zm64-208c0 35.3-28.7 64-64 64V144h64zM512 304v64H448c0-35.3 28.7-64 64-64zM448 96h64v64c-35.3 0-64-28.7-64-64z"/></svg>
                            </div>
                            <div className='my-auto'>
                                <div className='font-extrabold text-lg'>Balance</div>
                                <div>{assetBalance} {assetDetails?.symbol}</div>
                            </div>
                        </div>
                    </div>

                    {
                        depositDetails && (
                            <div className='grid gap-2'>
                                <div className='text-xl font-bold'>
                                    Progress
                                </div>
                                <ProgressBar percentage={progress} decimalPlaces={3} />
                            </div>
                        )
                    }

                    <div className='grid gap-5 grid-cols-1 md:grid-cols-2'>
                        <div className='p-2 rounded-l-full rounded-r-full bg-slate-200 gap-3 grid-cols-1 md:grid-cols-2 flex w-full'>
                            <div className='text-3xl my-auto rounded-full bg-slate-50 p-5 w-24 h-24'>
                                <svg fill='#87CEEB' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M448 160H320V128H448v32zM48 64C21.5 64 0 85.5 0 112v64c0 26.5 21.5 48 48 48H464c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zM448 352v32H192V352H448zM48 288c-26.5 0-48 21.5-48 48v64c0 26.5 21.5 48 48 48H464c26.5 0 48-21.5 48-48V336c0-26.5-21.5-48-48-48H48z"/></svg>
                            </div>
                            <div className='my-auto'>
                                <div className='font-extrabold text-lg'>Weekly Amount</div>
                                <div>{amountWeekly} {assetDetails?.symbol}</div>
                            </div>
                        </div>
                        <div className='p-2 rounded-l-full rounded-r-full bg-slate-200 gap-3 grid-cols-1 md:grid-cols-2 flex w-full'>
                            <div className='text-3xl my-auto rounded-full bg-slate-50 p-5 w-24 h-24'>
                                <svg opacity={0.75} fill='red' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M184.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L39 113c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L39 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM256 96c0-17.7 14.3-32 32-32H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H288c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H288c-17.7 0-32-14.3-32-32zM192 416c0-17.7 14.3-32 32-32H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32zM80 464c-26.5 0-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48z"/></svg>
                            </div>
                            <div className='my-auto'>
                                <div className='font-extrabold text-lg'>Outstanding</div>
                                <div>{outstanding} {assetDetails?.symbol}</div>
                            </div>
                        </div>
                    </div>

                    {
                        String(address) === String(depositDetails?.owner) && (
                            <div className='mx-auto flex gap-2'>
                                <button 
                                onClick={ async () => {

                                    if (outstanding > 0 && progress < 100) await handleTopUp();

                                    if (withdrawn == false && outstanding == 0 && progress == 100 ) await handleWithdraw();

                                }} 
                                disabled={(progress < 100 && outstanding === 0 || !isApproved && outstanding > 0 || withdrawn == true)} 
                                    className={`px-3 py-2 rounded-lg border hover:bg-green-700 hover:text-slate-50 duration-300 text-xs font-bold text-slate-500 bg-green-700/5 ${(progress < 100 && outstanding === 0 || !isApproved && outstanding > 0 || withdrawn == true) && 'opacity-30 hover:bg-green-700/5 hover:text-slate-500'}`}>
                                    {
                                        progress < 100 ? "Top-up" : "Withdraw"
                                    }
                                </button>
                                {
                                    (!isApproved && outstanding > 0) && (
                                        <button
                                            onClick={ async () => await handleApprove() }
                                            className={`px-3 py-2 rounded-lg border hover:bg-green-700 hover:text-slate-50 duration-300 text-xs font-bold text-slate-500 bg-green-700/5`}>
                                            Approve
                                        </button>
                                    )
                                }
                            </div>
                        )
                    }

                </div>
            </Layout>
        </React.Fragment>
    )
}

export default DepositInfo