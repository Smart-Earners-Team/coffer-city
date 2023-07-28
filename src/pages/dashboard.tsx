import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/wrap"
import { BsShieldFillCheck, BsShieldFillExclamation } from 'react-icons/bs'
import { FaChartLine, FaChartPie, FaEye, FaEyeSlash, FaGift, FaPlusCircle } from "react-icons/fa"
import { Link } from "react-router-dom"
import { getUserDetails } from "../hooks/getUserDetails"
import { useAccount } from "wagmi"

const Dashboard = () => {
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(true);
    const { address } = useAccount();

    const getActivityStatus = async () => {
        const data = await getUserDetails(String(address));
        // console.log(data);
        setIsActive(data.isActive);
    }

    useEffect(() => {
        const setPageData = async() => {
            await getActivityStatus();
        }

        setPageData();
    }, [address]);
    
    const handleValueVisibility = () => {
        setIsVisible(!isVisible);
    }
    
    return (
        <React.Fragment>
            <Helmet>
                <title>Dashboard | Coffer City</title>
            </Helmet>
            <Layout navbar footer>
                <div className="grid gap-10 px-10 md:px-32 pt-[38%] md:pt-[13%] h-[120%] md:h-[130%]">
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
