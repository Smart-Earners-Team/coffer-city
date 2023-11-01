import React, { useCallback, useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/wrap"
import { Link } from "react-router-dom";
import { getDepositIds, getProgressPercentage, getUserDetails } from '../hooks/getUserDetails'
import { useAccount, useNetwork } from 'wagmi'
import { useDateFromTimestamp } from "../hooks/getDuration";
import ProgressBar from "../components/ProgressBar";
import usePreloader, { Preloader } from "../hooks/usePreloader";
import { WalletConnectButton } from "../components/ConnectWallet";
import { addresses } from "../hooks/addresses";

interface ICofferCityDeposits {
    owner: string;
    asset: string;
    startTime: number;
    amountPerWeek: number;
    duration: number;
    balance: number;
    topUps: number;
    withdrawn: boolean;
}

// Adding ID to the interface
interface ICofferCityDepositsWithID extends ICofferCityDeposits {
    id: number;
}

// Define table headings
const headings = ['ID', 'Start Date', 'Maturity', 'Progress'];

const OverView = () => {

    const [userDetails, setUserDetails] = useState<any | {}>({});
    const [userDeposits, setUserDeposits] = useState<ICofferCityDepositsWithID[]>([]);
    const [progressArray, setProgressArray] = useState<number[]>([]);
    const { address, isConnected, isConnecting } = useAccount();
    const { chain } = useNetwork();
    const cID = Number(chain?.id);
    const rpcUrl = chain?.rpcUrls.public.http[0];

    useEffect(() => {
        const fetchData = async () => {
            const details = await getUserDetails(String(address), String(rpcUrl), addresses.CofferCityVault[cID]);
            const depositIdArray = await getDepositIds(String(address), String(rpcUrl), addresses.CofferCityVault[cID]);
            // console.log(depositIdArray);
            // console.log(Number(depositIdArray[0]));
            setUserDetails(details);
            // console.log(details?.userDeposits);

            if (details?.userDeposits) {
                const newUDep: ICofferCityDepositsWithID[] = details.userDeposits.map((deposit: ICofferCityDeposits, index: number) => {
                    const { owner, asset, startTime, amountPerWeek, duration, balance, topUps, withdrawn } = deposit;
                    return {
                        id: Number(depositIdArray[index]),
                        owner,
                        asset,
                        startTime: Number(startTime),
                        amountPerWeek: Number(amountPerWeek),
                        duration: Number(duration),
                        balance: Number(balance),
                        topUps: Number(topUps),
                        withdrawn
                    };
                });

                // console.log(newUDep);
                setUserDeposits(newUDep);  // updating the state
            }
        };

        fetchData();
    }, [address, userDetails, cID]); // An empty dependencies array ensures this runs once after initial render.

    useEffect(() => {
        const fetchProgress = async () => {
            // const dataP = await getProgressPercentage(userDeposits[0]?.startTime, userDeposits[0]?.duration);
            // console.log(dataP);
            if (userDeposits.length > 0) {
                let uIDP: number[] = [];
                for (let i=0; i < userDeposits.length; i++) {
                    const dp = getProgressPercentage(userDeposits[i]?.startTime, userDeposits[i].duration);
                    uIDP.push(dp);
                };
                // console.log(uIDP);
                setProgressArray(uIDP);
            }
        }

        fetchProgress();

        // Then set up the interval
        const intervalId = setInterval(fetchProgress, 3000); // every 3 seconds

        // Be sure to clear your interval when the component unmounts
        return () => clearInterval(intervalId);

    }, [address, userDeposits]);

    // console.log(userDetails);
    // console.log(userDeposits);

    // Define your text conditionally
    let loadingText = 'Fetching data . . .';
    if (!isConnected) loadingText = "Please connect your wallet!"
    if (isConnecting) loadingText = "Connecting to your wallet. Please wait!"

    const checks = useCallback(async () => {
        // Perform your checks here. For example:
        const loaded = isConnected && userDeposits ? true : false;
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
                <title>Savings Progress | Coffer City</title>
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
                    <div className="text-4xl font-dynapuff font-bold">My Savings</div>
                    <div className="overflow-auto w-full">
                        <div className="mx-auto">
                            <table className="table-auto w-[500px] md:w-[90%]">
                                <thead>
                                    <tr>
                                        {headings.map((heading, index) => (
                                            <th key={index} className="px-4 py-2">
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                {
                                    userDetails.numberOfDeposits !== 0 && userDeposits && (
                                        <tbody className="">
                                            {userDeposits.map((row, index) => (
                                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : ''}>
                                                    <td className="border px-4 py-2 text-center">{row.id}</td>
                                                    <td className="border px-4 py-2 text-center">{useDateFromTimestamp(row.startTime)}</td>
                                                    <td className="border px-4 py-2 text-center">{useDateFromTimestamp(Number(row.duration + row.startTime))}</td>
                                                    <td className="border text-center">
                                                        {
                                                            progressArray && (
                                                                <ProgressBar percentage={progressArray[index]} />
                                                            )
                                                        }
                                                    </td>
                                                    <td className="border bg-red-600/90 hover:bg-red-600 duration-300 text-slate-50 p-2 w-fit my-auto text-center text-xs cursor-pointer">
                                                        <Link to={`/overview/${row.id}`}>Manage</Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    )
                                }
                            </table>
                            {
                                userDetails.numberOfDeposits === 0 && (
                                    <div className="italic text-center text-xs my-5 grid gap-3">
                                        <span>You don't have any savings yet!</span>
                                        <Link to={'/deposit'} className="w-fit mx-auto px-3 py-2 rounded-lg bg-[#27A844] text-white hover:bg-[#27A844]/90 duration-300">Start Saving</Link>
                                    </div>
                                )
                            }
                        </div>
                        {
                            !userDeposits && (
                                <div className="mx-auto border-blue-500 rounded-full border-x-[1px] border-y-[2px] w-8 h-8 animate-spin" />
                            )
                        }
                        {
                            userDetails.numberOfDeposits !== 0 && (
                                <div className="italic text-center text-xs my-5 grid gap-3">
                                    <Link to={'/deposit'} className="w-fit mx-auto px-3 py-2 rounded-lg bg-[#27A844] text-white hover:bg-[#27A844]/90 duration-300">Create a new Savings</Link>
                                </div>
                            )
                        }
                    </div>
                </div>
            </Layout>
        </React.Fragment>
    )
}

export default OverView
