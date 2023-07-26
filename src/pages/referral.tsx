import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Layout, { useWagmiDetails } from "../components/wrap"
import { Link } from "react-router-dom"
import { FaCopy, FaEnvelope, FaLinkedin, FaTwitter } from "react-icons/fa"
import piggyBank from './../assets/svgs/piggybank.svg'
import cofferchest from './../assets/svgs/coffer-chest.svg'
import { useContractInitializer } from "../hooks/useEthers"
import { addresses } from "../hooks/addresses"
import CofferCityVaultABI from './../utils/ABIs/CofferVaultABI.json'

export function copyToClipboard(value: string) {
    try {
        navigator.clipboard.writeText(value);
        // console.log('Copied to clipboard');
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

const getUserTeamData = async (address: string) => {
    const contract = await useContractInitializer({ contractType: 'read', rpc: 'https://bsc-testnet.publicnode.com', contractAddress: addresses.CofferCityVault[97], contractABI: CofferCityVaultABI });

    const res = await contract?.userTeamData(address);
    // console.log(res);
    return res;
}

const Referral = () => {

    const { address } = useWagmiDetails();

    const [activeTab, setActiveTab] = useState("activeRewards");

    const [level1Referrals, setLevel1Referrals] = useState<number>(0)
    const [level2Referrals, setLevel2Referrals] = useState<number>(0)
    const [level3Referrals, setLevel3Referrals] = useState<number>(0)

    const tabs = [
        { name: "Active Rewards", id: "activeRewards" },
        { name: "My Rewards", id: "myRewards" },
        // Add more tabs here as needed
    ];

    useEffect(() => {
        const fetchData = async () => {
            const res = await getUserTeamData(String(address));
            const multilevel = res[1];
            // console.log(multilevel);
            const lv1 = multilevel[0];
            const lv2 = multilevel[1];
            const lv3 = multilevel[2];
            // console.log(lv1, lv2, lv3);
            setLevel1Referrals(Number(lv1));
            setLevel2Referrals(Number(lv2));
            setLevel3Referrals(Number(lv3));
            // console.log(level1Referrals, level2Referrals, level3Referrals);
        }

        fetchData();
    }, [])

    const ownerReferral = `coffer.city/rewards/${address}`

    return (
        <React.Fragment>
            <Helmet>
                <title>Refer and Earn | Coffer City</title>
            </Helmet>
            <Layout navbar footer>
                <div className="grid gap-10 px-10 md:px-32 pt-[38%] md:pt-[13%] h-[120%] md:h-[130%]">

                    <div className="grid gap-5 bg-blue-900/5 px-5 md:px-10 py-10 md:py-12 rounded-2xl">
                        <div className='text-4xl font-bold'>Refer and Earn Rewards.</div>
                        <div className="">
                            Invite a new user to sign up using your link and earn unique rewards - per referral.
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-slate-50 rounded-3xl ring-1 ring-slate-800 p-1 px-5 flex gap-3 justify-between">
                                <div className="opacity-90 text-xs md:text-sm select-none overflow-hidden overflow-ellipsis whitespace-nowrap my-auto">{ownerReferral}</div>
                                <button onClick={() => copyToClipboard(`https://${ownerReferral}`)} className="float-right flex w-fit gap-1">
                                    <FaCopy className='text-lg'/>
                                    <small className="whitespace-nowrap">Copy Link</small>
                                </button>
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                <Link to='' className="bg-slate-50 rounded-3xl ring-1 ring-slate-800 p-1">
                                    <div className="text-center flex gap-1 align-middle justify-center">
                                        <FaEnvelope className='text-lg'/>
                                        <span className="">Email</span>
                                    </div>
                                </Link>
                                <Link to='' className="bg-slate-50 rounded-3xl ring-1 ring-slate-800 p-1">
                                    <div className="text-center flex gap-1 align-middle justify-center">
                                        <FaLinkedin className='text-lg' />
                                        <span className="">LinkedIn</span>
                                    </div>
                                </Link>
                                <Link to='' className="bg-slate-50 rounded-3xl ring-1 ring-slate-800 p-1">
                                    <div className="text-center flex gap-1 align-middle justify-center">
                                        <FaTwitter className='text-lg' />
                                        <span className="">Twitter</span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <small className="-my-4 mx-5">
                            <span className="text-lg text-[#eb435c]">*</span>
                            <span className="">Referral must sign up using your link.</span>
                        </small>
                    </div>

                    <div className="grid gap-5 bg-blue-900/5 px-5 md:px-10 py-10 md:py-12 rounded-2xl">
                        <div className="text-3xl font-bold">Total Referrals</div>
                        <div className="grid gap-5 grid-cols-2 md:grid-cols-3">
                            <div className="grid gap-2 shadow-lg rounded-xl bg-[#02075d]/5 p-5">
                                <div className="text-lg font-bold">Level 1 <span className="text-xs font-normal">(Direct Referral)</span></div>
                                <div className="mx-2">
                                    <span className="font-bold">{level1Referrals}</span>
                                    <small className="uppercase mx-1">users</small>
                                </div>
                            </div>
                            <div className="grid gap-2 shadow-lg rounded-xl bg-[#02075d]/10 p-5">
                                <div className="text-lg font-bold">Level 2</div>
                                <div className="mx-2">
                                    <span className="font-bold">{level2Referrals}</span>
                                    <small className="uppercase mx-1">users</small>
                                </div>
                            </div>
                            <div className="grid gap-2 shadow-lg rounded-xl bg-[#02075d]/30 p-5">
                                <div className="text-lg font-bold">Level 3</div>
                                <div className="mx-2">
                                    <span className="font-bold">{level3Referrals}</span>
                                    <small className="uppercase mx-1">users</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-5 bg-pink-900/5 px-5 md:px-10 py-10 md:py-12 rounded-2xl">
                        <div className="text-3xl font-bold">Rewards</div>
                        {/* <div>
                            <div className="text-xs font-semibold">Total Rewards Earned</div>
                            <div className="text-3xl font-bold">
                                3 NFTs
                            </div>
                        </div> */}
                        <div className="flex space-x-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 font-medium rounded-md ${activeTab === tab.id
                                            ? "text-white bg-[#02075D]"
                                            : "text-[#02075D] bg-white"
                                        }`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                        <div>
                            {activeTab === "activeRewards" && (
                                <div className="grid gap-5">
                                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2">

                                        <div className="grid gap-5">
                                            <span className="text-xs mx-auto">You get this for Direct Referrals</span>
                                            <div className="grid md:grid-flow-col gap-3 p-5 rounded-xl shadow-lg bg-slate-50">
                                                <img src={piggyBank} className="m-auto w-full border-r-2 border-lime-400/30 rounded-3xl" />
                                                <div className="m-auto text-xs text-justify grid gap-2">
                                                    <div className="font-dynapuff text-xl">
                                                        PiggyBank NFT
                                                    </div>
                                                    <div>
                                                        This Piggybank collection serves as a vivid, digital testament to the various aspects of financial journey and personal growth. This limited-edition piggy bank pays homage to the traditional idea of saving and financial growth and embodies a symbol of old-world thriftiness and smart money management. Each NFT in this collection is a unique piece of digital art with a distinct story, style, and personality.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-5">
                                            <span className="text-xs mx-auto">You get this for Level 2 Referrals</span>
                                            <div className="grid md:grid-flow-col gap-3 p-5 rounded-xl shadow-lg bg-slate-50">
                                                <img src={cofferchest} className="m-auto w-full border-r-2 border-lime-400/30 rounded-3xl p-2" />
                                                <div className="m-auto text-xs text-justify grid gap-2">
                                                    <div className="font-dynapuff text-xl">
                                                        Coffer Chest NFT
                                                    </div>
                                                    <div>
                                                        Each Coffer Chest NFT is a unique digital asset, offering an immersive, value-driven experience. Representing a virtual treasure chest, it encapsulates the thrill of discovery and the promise of rewards. With an intrinsic value and rarity, each Coffer Chest NFT serves as a key to unlock exclusive opportunities. Collect, trade, or hold Coffer Chest, and let your wealth grow.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                            {activeTab === "myRewards" && (
                                <div>null</div>
                            )}
                        </div>
                    </div>

                </div>
            </Layout>
        </React.Fragment>
    )
}

export default Referral
