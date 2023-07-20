import React from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/wrap"

// Define table headings
const headings = ['ID', 'Start Date', 'Maturity', 'Unpaid', 'Progress'];

// Define table content
const rows = [
    {
        id: 1,
        startDate: '01-07-23',
        maturity: '01-07-24',
        unpaid: '',
        progress: '',
        action: 'Action'
    },
    // Add as many objects as you have rows
];

const OverView = () => {

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
                                <tbody className="">
                                    {rows.map((row, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : ''}>
                                            <td className="border px-4 py-2 text-center">{row.id}</td>
                                            <td className="border px-4 py-2 text-center">{row.startDate}</td>
                                            <td className="border px-4 py-2 text-center">{row.maturity}</td>
                                            <td className="border px-4 py-2 text-center">{row.unpaid}</td>
                                            <td className="border px-4 py-2 text-center">{row.progress}</td>
                                            <button className="border rounded-lg bg-red-600/90 hover:bg-red-600 duration-300 text-slate-50 p-2 w-full m-auto text-center">{row.action}</button>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Layout>
        </React.Fragment>
    )
}

export default OverView
