import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/wrap"
import { Link } from "react-router-dom";
import { getDepositIds, getProgressPercentage, getUserDetails } from '../hooks/getUserDetails'
import { useAccount } from 'wagmi'
import { useDateFromTimestamp } from "../hooks/getDuration";
import ProgressBar from "../components/ProgressBar";

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
    const { address } = useAccount();

    useEffect(() => {
        const fetchData = async () => {
            const details = await getUserDetails(String(address));
            const depositIdArray = await getDepositIds(String(address));
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
    }, [address, userDetails]); // An empty dependencies array ensures this runs once after initial render.

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

    return (
        <React.Fragment>
            <Helmet>
                <title>Savings Progress | Coffer City</title>
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
