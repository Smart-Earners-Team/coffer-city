import React, { useState } from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/wrap"
import { BsShieldFillCheck } from 'react-icons/bs'
import { FaChartLine, FaChartPie, FaEye, FaEyeSlash, FaGift, FaPlusCircle } from "react-icons/fa"
import { Link } from "react-router-dom"

const Dashboard = () => {
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    
    const handleValueVisibility = () => {
        setIsVisible(!isVisible);
    }
    return (
        <React.Fragment>
            <Helmet>
                <title>Dashboard | Coffer City</title>
            </Helmet>
            <Layout navbar footer>
                <div className="grid gap-10 px-10 md:px-32 pt-[30%] md:pt-[13%] h-[120%] md:h-[130%]">
                    <div>
                        <div className="md:flex w-full gap-5 relative justify-center">
                            <div className="p-5 relative w-full md:w-[30%] rounded-xl bg-[#02075d] text-slate-50">
                                <div className='text-xs'>Total Savings</div>
                                <div className="text-lg font-bold">
                                    {
                                        isVisible ? '$25,000.21' : '*******'
                                    }
                                </div>
                                <button onClick={handleValueVisibility} className="absolute text-lg right-5 h-full py-5 top-0">
                                    {
                                        isVisible ? <FaEye/> : <FaEyeSlash/>
                                    }
                                </button>
                            </div>
                            <div className="grid gap-3 text-xs py-3 md:py-0">
                                <button className='font-bold p-2 rounded-lg bg-[#02075d] text-slate-50 hover:bg-[#02075d]/90 duration-300'>
                                    <FaPlusCircle className='inline m-1 -ml-1'/>
                                    Top-Up
                                </button>
                                <button className="p-2 rounded-lg bg-gray-300 text-slate-800 hover:bg-gray-300/90 duration-300">$25,000.21</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>Quick Actions</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            <Link to='' className="rounded-lg bg-[#02075d]/10 p-5 grid gap-5 items-center">
                                <span className="rounded-full w-fit h-fit bg-slate-50 text-[#02075d]">
                                    <FaGift className='m-3 text-xl' />
                                </span>
                                <div className="flex flex-col justify-center">
                                    <div className="font-bold">Refer a friend</div>
                                    <div className="text-xs">Invite friends and earn $50</div>
                                </div>
                            </Link>

                            <Link to='https://google.com' className="rounded-lg bg-[#02075d]/10 p-5 grid gap-5 items-center">
                                <span className="rounded-full w-fit h-fit bg-slate-50 text-[#02075d]">
                                    <BsShieldFillCheck className='m-3 text-xl' />
                                </span>
                                <div className="flex flex-col justify-center">
                                    <div className="font-bold">Deposit Status</div>
                                    <div className="text-xs">Keeps track of your deposit status and activity</div>
                                </div>
                            </Link>

                            <Link to='https://google.com' className="rounded-lg bg-[#eb435c]/10 p-5 grid gap-5 items-center">
                                <span className="rounded-full w-fit h-fit bg-slate-50 text-[#eb435c]">
                                    <FaChartLine className='m-3 text-xl' />
                                </span>
                                <div className="flex flex-col justify-center">
                                    <div className="font-bold">Saving progress</div>
                                    <div className="text-xs">Check your saving progress</div>
                                </div>
                            </Link>

                            <Link to='https://google.com' className="rounded-lg bg-[#eb435c]/10 p-5 grid gap-5 items-center">
                                <span className="rounded-full w-fit h-fit bg-slate-50 text-[#eb435c]">
                                    <FaChartPie className='m-3 text-xl' />
                                </span>
                                <div className="flex flex-col justify-center">
                                    <div className="font-bold">Invest</div>
                                    <div className="text-xs">Invest your tokens and get good returns</div>
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
