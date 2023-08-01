import React, { useEffect, useState } from 'react'
import Layout from '../components/wrap'
import { Helmet } from 'react-helmet'
import { Link, useParams } from 'react-router-dom'
import { getDepositDetails, getProgressPercentage } from '../hooks/getUserDetails'
import { useAccount, useNetwork } from 'wagmi'
import { getTokenData } from './deposit'
import { useDateFromTimestamp } from '../hooks/getDuration'
import { getAmountForAssets } from '../hooks/getAmountForAssets'
import BigNumber from 'bignumber.js'
import ProgressBar from '../components/ProgressBar'

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
    const blockExplorerUrl = chain?.blockExplorers?.default.url;
    
    const [ depositDetails, setDepositDetails ] = useState<DepositDetails | null>(null);
    const [assetDetails, setAssetDetails] = useState<SP | null>(null);
    const [assetBalance, setAssetBalance] = useState<number>(0);

    useEffect(() => {
        const fetchPageData = async () => {
            const res = await getDepositDetails(Number(depositId));
            // console.log(res);
            setDepositDetails(res);
            const tk = await getTokenData(res.asset);
            // console.log(tk);
            const { assetDecimals } = await getAmountForAssets(tk.address);
            const assetBal = new BigNumber(res.balance).div(new BigNumber(10).pow(Number(assetDecimals))).toNumber();
            // console.log(assetBal);
            setAssetDetails(tk);
            setAssetBalance(assetBal);
        }

        fetchPageData();
    }, [address]);

    // console.log(depositDetails);
    // console.log(assetDetails);

    return (
        <React.Fragment>
            <Helmet>
                <title>Overview ID {`${depositId}`} | Coffer City</title>
            </Helmet>
            <Layout navbar footer>
                <div className="grid gap-10 px-10 md:px-32 pt-[38%] md:pt-[13%] h-[120%] md:h-[130%]">

                    <div className='grid gap-10 grid-cols-1 md:grid-cols-2'>
                        <div className='p-3 rounded-l-full rounded-r-full bg-slate-200 gap-3 grid-cols-1 md:grid-cols-2 flex'>
                            <div className='text-3xl my-auto rounded-full bg-slate-50 p-5 w-24 h-24'>
                                <svg fill='#ffd700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 96H192L144.6 24.9C137.5 14.2 145.1 0 157.9 0H354.1c12.8 0 20.4 14.2 13.3 24.9L320 96zM192 128H320c3.8 2.5 8.1 5.3 13 8.4C389.7 172.7 512 250.9 512 416c0 53-43 96-96 96H96c-53 0-96-43-96-96C0 250.9 122.3 172.7 179 136.4l0 0 0 0c4.8-3.1 9.2-5.9 13-8.4zm84.1 96c0-11.1-9-20.1-20.1-20.1s-20.1 9-20.1 20.1v6c-5.6 1.2-10.9 2.9-15.9 5.1c-15 6.8-27.9 19.4-31.1 37.7c-1.8 10.2-.8 20 3.4 29c4.2 8.8 10.7 15 17.3 19.5c11.6 7.9 26.9 12.5 38.6 16l2.2 .7c13.9 4.2 23.4 7.4 29.3 11.7c2.5 1.8 3.4 3.2 3.8 4.1c.3 .8 .9 2.6 .2 6.7c-.6 3.5-2.5 6.4-8 8.8c-6.1 2.6-16 3.9-28.8 1.9c-6-1-16.7-4.6-26.2-7.9l0 0 0 0 0 0 0 0c-2.2-.8-4.3-1.5-6.3-2.1c-10.5-3.5-21.8 2.2-25.3 12.7s2.2 21.8 12.7 25.3c1.2 .4 2.7 .9 4.4 1.5c7.9 2.7 20.3 6.9 29.8 9.1V416c0 11.1 9 20.1 20.1 20.1s20.1-9 20.1-20.1v-5.5c5.4-1 10.5-2.5 15.4-4.6c15.7-6.7 28.4-19.7 31.6-38.7c1.8-10.4 1-20.3-3-29.4c-3.9-9-10.2-15.6-16.9-20.5c-12.2-8.8-28.3-13.7-40.4-17.4l-.8-.2c-14.2-4.3-23.8-7.3-29.9-11.4c-2.6-1.8-3.4-3-3.6-3.5c-.2-.3-.7-1.6-.1-5c.3-1.9 1.9-5.2 8.2-8.1c6.4-2.9 16.4-4.5 28.6-2.6c4.3 .7 17.9 3.3 21.7 4.3c10.7 2.8 21.6-3.5 24.5-14.2s-3.5-21.6-14.2-24.5c-4.4-1.2-14.4-3.2-21-4.4V224z"/></svg>
                            </div>
                            <div className='my-auto'>
                                <div className='font-extrabold text-lg'>Unique Savings ID</div>
                                <div className='font-semibold text-[17px]'>{depositId}</div>
                            </div>
                        </div>
                        <div className='p-3 rounded-l-full rounded-r-full bg-slate-200 gap-3 grid-cols-1 md:grid-cols-2 flex'>
                            <div className='text-3xl my-auto rounded-full bg-slate-50 p-5 w-24 h-24'>
                                <img src={assetDetails?.logo} />
                            </div>
                            <div className='my-auto'>
                                <div className='font-extrabold text-lg'>Asset</div>
                                <div>{assetDetails?.symbol}</div>
                            </div>
                        </div>
                        <div className='p-3 rounded-l-full rounded-r-full bg-slate-200 gap-3 grid-cols-1 md:grid-cols-2 flex'>
                            <div className='text-3xl my-auto rounded-full bg-slate-50 p-5 w-24 h-24'>
                                <svg fill='#ff7700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M232 120C232 106.7 242.7 96 256 96C269.3 96 280 106.7 280 120V243.2L365.3 300C376.3 307.4 379.3 322.3 371.1 333.3C364.6 344.3 349.7 347.3 338.7 339.1L242.7 275.1C236 271.5 232 264 232 255.1L232 120zM256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0zM48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48C141.1 48 48 141.1 48 256z"/></svg>
                            </div>
                            <div className='my-auto'>
                                <div className='font-extrabold text-lg'>Duration</div>
                                <div>{useDateFromTimestamp(Number(depositDetails?.startTime))}&nbsp; to &nbsp;{useDateFromTimestamp(Number(Number(depositDetails?.startTime) + Number(depositDetails?.duration)))}</div>
                            </div>
                        </div>
                        <div className='p-3 rounded-l-full rounded-r-full bg-slate-200 gap-3 grid-cols-1 md:grid-cols-2 flex'>
                            <div className='text-3xl my-auto rounded-full bg-slate-50 p-5 w-24 h-24'>
                                <svg fill='#5f3502' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 112.5V422.3c0 18 10.1 35 27 41.3c87 32.5 174 10.3 261-11.9c79.8-20.3 159.6-40.7 239.3-18.9c23 6.3 48.7-9.5 48.7-33.4V89.7c0-18-10.1-35-27-41.3C462 15.9 375 38.1 288 60.3C208.2 80.6 128.4 100.9 48.7 79.1C25.6 72.8 0 88.6 0 112.5zM288 352c-44.2 0-80-43-80-96s35.8-96 80-96s80 43 80 96s-35.8 96-80 96zM64 352c35.3 0 64 28.7 64 64H64V352zm64-208c0 35.3-28.7 64-64 64V144h64zM512 304v64H448c0-35.3 28.7-64 64-64zM448 96h64v64c-35.3 0-64-28.7-64-64z"/></svg>
                            </div>
                            <div className='my-auto'>
                                <div className='font-extrabold text-lg'>Balance</div>
                                <div>{assetBalance} {assetDetails?.symbol}</div>
                            </div>
                        </div>
                    </div>

                    <Link target='_blank' to={`${blockExplorerUrl}/address/${address}`} className='p-3 rounded-l-full rounded-r-full bg-slate-200 gap-3 grid-cols-1 md:grid-cols-2 flex'>
                        <div className='text-3xl my-auto rounded-full bg-slate-50 p-5 w-24 h-24'>
                            <svg fill='#ffd700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
                        </div>
                        <div className='my-auto'>
                            <div className='font-extrabold text-lg'>Owner</div>
                            <div>{depositDetails?.owner}</div>
                        </div>
                    </Link>

                    {
                        depositDetails && (
                            <div className='grid gap-2'>
                                <div className='text-xl font-bold'>
                                    Progress
                                </div>
                                <ProgressBar percentage={getProgressPercentage(Number(depositDetails?.startTime), Number(depositDetails?.duration))} />
                            </div>
                        )
                    }

                    {
                        String(address) === String(depositDetails?.owner) && (
                            <div className='mx-auto'>
                                <button className='px-3 py-2 rounded-lg border'>
                                    {
                                        getProgressPercentage(Number(depositDetails?.startTime), Number(depositDetails?.duration)) < 100 ? "Top-up" : "Withdraw"
                                    }
                                </button>
                            </div>
                        )
                    }

                </div>
            </Layout>
        </React.Fragment>
    )
}

export default DepositInfo