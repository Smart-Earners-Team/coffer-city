import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/wrap"
import { Link } from "react-router-dom";
import { getUserDetails } from '../hooks/getUserDetails'
import { useAccount } from 'wagmi'

// Define table headings
const headings = ['ID', 'Start Date', 'Maturity', 'Unpaid', 'Progress'];

// Define table content
const rows = [
    {
        id: 1,
        startDate: '01-07-23',
        maturity: '01-07-24',
        unpaid: '',
        progress: ''
    },
    // Add as many objects as you have rows
];

const OverView = () => {

    const [userDetails, setUserDetails] = useState<any | {}>({});
    const { address } = useAccount();

    useEffect(() => {
        const fetchData = async () => {
            const details = await getUserDetails(String(address));
            // console.log(details);
            setUserDetails(details);
            // console.log(typeof details);
        };

        fetchData();
    }, []); // An empty dependencies array ensures this runs once after initial render.

    // console.log(userDetails);
    // console.log(userDetails.userDeposits);

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
                            <table className="table-auto w-[500px] md:w-[80%]">
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
                                    userDetails.numberOfDeposits !== 0 && (
                                        <tbody className="">
                                            {rows.map((row, index) => (
                                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : ''}>
                                                    <td className="border px-4 py-2 text-center">{row.id}</td>
                                                    <td className="border px-4 py-2 text-center">{row.startDate}</td>
                                                    <td className="border px-4 py-2 text-center">{row.maturity}</td>
                                                    <td className="border px-4 py-2 text-center">{row.unpaid}</td>
                                                    <td className="border px-4 py-2 text-center">{row.progress}</td>
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
                    </div>
                </div>
            </Layout>
        </React.Fragment>
    )
}

export default OverView
