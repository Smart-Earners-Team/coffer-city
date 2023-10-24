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
    const rpcUrl = chain?.rpcUrls.public.http[0];
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
            const res = await getDepositDetails(Number(depositId), String(rpcUrl), addresses.CofferCityVault[cID]);
            // console.log(res);
            setDepositDetails(res);

            const tk = await getTokenData(res.asset);
            // console.log(tk);
            
            const { assetDecimals } = await getAmountForAssets(tk.address, String(rpcUrl), addresses.CofferCityVault[cID]);

            const debtWeeks = await getDebtWeeks(Number(depositId), String(rpcUrl), addresses.CofferCityVault[cID]);
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
        const contract = new ethers.Contract(addresses.CofferCityVault[cID], CofferCityVaultABI, signer);

        const res = await contract?.topup(Number(depositId));
        await res.wait();

        if (res) window.location.reload();
    };

    const handleWithdraw = async () => {
        setWithdrawn(true);
        const contract = new ethers.Contract(addresses.CofferCityVault[cID], CofferCityVaultABI, signer);

        const res = await contract?.withdraw(Number(depositId));
        await res.wait();

        if (res) window.location.reload();
    };

    const handleApprove = async () => {
        const contract = new ethers.Contract(String(assetDetails?.address), ERC20ABI, signer);

        const approve = await contract?.approve(addresses.CofferCityVault[cID], ethers.MaxUint256);
        await approve.wait();

        await checkApproval(Number(amountWeekly), String(assetDetails?.address), String(depositDetails?.owner));
    };

    const checkApproval = async (amount: number, CA: string, ownerAddress: string) => {
        const contract = useContractInitializer({ rpc: String(rpcUrl), contractAddress: CA, contractABI: ERC20ABI });

        const allowance: number = await contract?.allowance(ownerAddress, addresses.CofferCityVault[cID]);

        let assetDecimals: number;
        try {
            assetDecimals = await contract?.decimals();
        } catch (error) {
            assetDecimals = 18;
            // console.log(error)
        }
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
                                <svg fill="#ff7700" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 23c-3.7 0-7.4.1-11.1.27l.8 17.98c3.4-.16 6.8-.25 10.3-.25 118.8 0 215 96.2 215 215s-96.2 215-215 215c-89.6 0-166.35-54.7-198.65-132.6l27.63-8.3-48.43-34.3-19.05 54.5 22.55-6.7C74.68 428.8 158.4 489 256 489c128.6 0 233-104.4 233-233S384.6 23 256 23zm-30.8 2.04c-13.3 1.75-26.1 4.6-38.6 8.48l5.6 17.09c11.4-3.54 23.3-6.15 35.4-7.75l-2.4-17.82zm-57 15.12c-12.4 5.05-24.2 11.12-35.4 18.12l9.5 15.21c10.3-6.44 21.2-12.03 32.6-16.67l-6.7-16.66zM116.4 69.5a234.139 234.139 0 0 0-29.35 26.12l13.05 12.28c8.3-8.77 17.4-16.81 27-24.06l-4.8-6.57-5.9-7.77zm69.5 8.58-4.4 17.44 217 55.48 4.4-17.4-217-55.52zM74.07 110.5c-8.19 10.2-15.54 21.2-21.94 32.7l15.65 8.8c5.91-10.7 12.69-20.8 20.26-30.3l-13.97-11.2zm127.63 8.8c-3.9 26 2.8 55.2 14.2 79.2 6.4 13.4 14.2 25.2 21.9 33.8 4.2 4.7 8.4 8.3 12.2 10.9l-5.4 21.2c-4.6.4-10 1.6-16 3.7-10.9 3.8-23.4 10.4-35.4 19.1-21.6 15.6-41.4 37.9-50.4 62.6l167.5 42.9c3.9-26-2.8-55.2-14.2-79.2-6.4-13.4-14.2-25.2-21.9-33.8-4.2-4.7-8.4-8.3-12.2-10.9l5.4-21.2c4.5-.5 10-1.6 16-3.7 10.9-3.8 23.4-10.4 35.4-19.1 21.6-15.6 41.4-37.9 50.4-62.6l-167.5-42.9zM43.24 160.9c-5.33 12-9.7 24.4-13 37.3l17.48 4.2c3.03-11.8 7.04-23.2 11.95-34.2l-16.43-7.3zM26.2 217.5C24.11 230 23 242.9 23 256v.9l18-.2v-.7c0-12.1 1.02-24 2.95-35.6l-17.75-2.9zM113.5 361l-4.4 17.4 217 55.5 4.4-17.4-217-55.5z"></path></svg>
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