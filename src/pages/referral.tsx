import React, { useCallback, useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/wrap"
import { Link } from "react-router-dom"
import { FaCheckCircle, FaCopy, FaCloudDownloadAlt, FaReddit, FaTelegram, FaWhatsapp } from "react-icons/fa"
import { BiLogoGmail } from "react-icons/bi"
import piggyBank from './../assets/svgs/piggybank.svg'
import cofferchest from './../assets/svgs/coffer-chest.svg'
import { useContractInitializer } from "../hooks/useEthers"
import { addresses } from "../hooks/addresses"
import CofferCityVaultABI from './../utils/ABIs/CofferVaultABI.json'
import CofferNftABI from './../utils/ABIs/CofferNftABI.json'
import usePreloader, { Preloader } from "../hooks/usePreloader"
import { WalletConnectButton } from "../components/ConnectWallet"
import { useAccount, useBlockNumber } from "wagmi"
import { useDialogBox } from "../hooks/useDialogBox"
import { useToastBox } from "../hooks/useToast"
import { shortenAddress } from "../hooks/shortenAddress"
import { useReferralLogs } from "../hooks/useReferralLogs"
import { parseTokenUri } from "../hooks/getUserDetails"
// import axios from 'axios';

interface MyRewardsType {
    nftCA: string
    nftID: number,
    nftName: string,
    nftImage: string
};

export function copyToClipboard(value: string) {
    try {
        navigator.clipboard.writeText(value);
        // console.log('Copied to clipboard');
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
};

const getUserTeamData = async (address: string) => {
    const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: addresses.CofferCityVault[97], contractABI: CofferCityVaultABI });

    const res = await contract?.userTeamData(address);
    // console.log(res);
    return res;
};

const getNftData = async (address: string, id: number) => {
    const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: address, contractABI: CofferNftABI });

    const res = await contract?.tokenURI(id);
    // console.log(res);
    const result = await parseTokenUri(res)
    // console.log(result);
    return result;
};

const Referral = () => {

    const [Toast, showSuccess] = useToastBox({
        title: 'Success!',
        subtitle: 'Referral link copied successfully!',
        icon: <FaCheckCircle className='text-3xl text-green-800' />, // You can replace this with any React node
    });

    // const { address } = useWagmiDetails();
    const { address, isConnected, isConnecting } = useAccount();
    const { data } = useBlockNumber();

    const ownerReferral = `coffer-city.vercel.app/rewards/${address}`;
    const [userQR, setUserQR] = useState<string>('')

    const handleQR = async () => {
        if (ownerReferral) {
            const url = `https://apis.coffer.city/qr/qrcode.php?type=json&dest=${ownerReferral}`

            // try {
            //     axios.get(url)
            //         .then(response => {
            //             // console.log(response.data);
            //             setUserQR(response.data);
            //         })
            //         .catch(err => {
            //             console.log(err);
            //         });
            // } catch (error) {
            //     console.error("An error occurred while fetching the data:", error);
            // }

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    return response.json(); // This returns a promise
                })
                .then(jsonData => {
                    // console.log(jsonData);
                    setUserQR(jsonData.data);
                })
                .catch(err => {
                    console.log(err.message);
                });
        }
    };

    useEffect(() => {
        const fetchQRCodes = async () => {
            await handleQR();
        };

        fetchQRCodes();
    }, [ownerReferral])

    const [ShareDialog, toggleShareDialog] = useDialogBox({
        title: "Share",
        subtitle: "",
        children: (
            <div className="w-full grid gap-6 my-2">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-5 md:gap-10">
                    <Link to={`mailto:?subject=Coffer%20City%3A%20Saving%20Made%20Simple%2C%20Smart%20and%20Secure&body=Coffer%20City%20is%20your%20one-stop%20digital%20Piggy%20Bank%21%20Save%20crypto%20for%20a%20fixed%20duration%20with%20a%20specified%20weekly%20amount%2C%20and%20watch%20your%20savings%20skyrocket%21%0A%0Ahttps://${ownerReferral}`} className="grid gap-2">
                        <BiLogoGmail className='mx-auto rounded-full bg-slate-100 hover:text-red-600 text-red-600/90 p-4 hover:p-3 w-16 h-16 duration-300' />
                        <div className="text-center text-xs">Email</div>
                    </Link>
                    <Link target="_blank" to={`https://api.whatsapp.com/send?text=Coffer%20City%20is%20your%20one-stop%20digital%20Piggy%20Bank%21%20Save%20crypto%20for%20a%20fixed%20duration%20with%20a%20specified%20weekly%20amount%2C%20and%20watch%20your%20savings%20skyrocket%21%0A%0Ahttps://${ownerReferral}`} className="grid gap-2">
                        <FaWhatsapp className='mx-auto rounded-full bg-slate-100 hover:text-green-600 text-green-600/90 p-4 hover:p-3 w-16 h-16 duration-300' />
                        <div className="text-center text-xs">Whatsapp</div>
                    </Link>
                    <Link target="_blank" to={`https://www.reddit.com/submit?url=Coffer%20City%20is%20your%20one-stop%20digital%20Piggy%20Bank%21%20Save%20crypto%20for%20a%20fixed%20duration%20with%20a%20specified%20weekly%20amount%2C%20and%20watch%20your%20savings%20skyrocket%21%0A%0Ahttps://${ownerReferral}&title=Coffer%20City%3A%20Saving%20Made%20Simple%2C%20Smart%20and%20Secure`} className="grid gap-2">
                        <FaReddit className='mx-auto rounded-full bg-slate-100 hover:text-orange-600 text-orange-600/90 p-4 hover:p-3 w-16 h-16 duration-300' />
                        <div className="text-center text-xs">Reddit</div>
                    </Link>
                    <Link target="_blank" to={`https://t.me/share/url?text=Coffer%20City%20is%20your%20one-stop%20digital%20Piggy%20Bank%21%20Save%20crypto%20for%20a%20fixed%20duration%20with%20a%20specified%20weekly%20amount%2C%20and%20watch%20your%20savings%20skyrocket%21%0A%0Ahttps://${ownerReferral}&url=https://${ownerReferral}`} className="grid gap-2">
                        <FaTelegram className='mx-auto rounded-full bg-slate-100 hover:text-blue-600 text-blue-600/90 p-4 hover:p-3 w-16 h-16 duration-300' />
                        <div className="text-center text-xs">Telegram</div>
                    </Link>
                </div>
                <div className="grid text-center">
                    <small>Or Share your QR code</small>
                    <img src={userQR} className="mx-auto" />
                    <a className='flex gap-2 w-fit mx-auto' href={userQR} download={`${shortenAddress(String(address), 6)}.png`}>
                        <FaCloudDownloadAlt className='text-3xl m-auto' />
                        <span className="text-xs m-auto select-none font-semibold">Download QR</span>
                    </a>
                </div>
            </div>
        ),
    });

    const [activeTab, setActiveTab] = useState("activeRewards");

    const [level1Referrals, setLevel1Referrals] = useState<number>(0)
    const [level2Referrals, setLevel2Referrals] = useState<number>(0)
    const [level3Referrals, setLevel3Referrals] = useState<number>(0)

    const [myRewards, setMyRewards] = useState<MyRewardsType[]>([]);

    const tabs = [
        { name: "Active Rewards", id: "activeRewards" },
        { name: "My Rewards", id: "myRewards" },
        // Add more tabs here as needed
    ];

    useEffect(() => {
        const fetchReferral = async () => {
            const dt = await useReferralLogs(String(address), addresses.CofferCityVault[97], String(data));
            // console.log(dt);
            // Later in your code, you can update myRewards like this:
            // dt && setMyRewards(dt);

            const nftArr: MyRewardsType[] = [];

            if (dt) {
                for (let i = 0; i < dt.length; i++) {
                    // console.log(typeof dt[i].nftCA)
                    // console.log(typeof dt[i].nftID)
                    const res = await getNftData(dt[i].nftCA, dt[i].nftID);
                    nftArr.push({
                        nftCA: dt[i].nftCA,
                        nftID: dt[i].nftID,
                        nftName: res.name,
                        nftImage: res.image
                    })
                }
            }
            setMyRewards(nftArr);
        }
        fetchReferral();
        // console.log(myRewards);
    }, [address])

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
    }, [address]);

    // Define your text conditionally
    let loadingText = 'Fetching data . . .';
    if (!isConnected) loadingText = "Please connect your wallet!"
    if (isConnecting) loadingText = "Connecting to your wallet. Please wait!"

    const checks = useCallback(async () => {
        // Perform your checks here. For example:
        const loaded = isConnected ? true : false;
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
                <title>Refer and Earn | Coffer City</title>
            </Helmet>
            <Layout navbar footer>
                <div className="grid gap-10 px-10 md:px-32 pt-[38%] md:pt-[13%] h-[120%] md:h-[130%]">

                    <div className="grid gap-5 bg-blue-900/5 px-5 md:px-10 py-10 md:py-12 rounded-2xl">
                        <div className='text-4xl font-bold'>Refer and Earn Rewards.</div>
                        <div className="">
                            Invite a new user to sign up using your link and earn unique rewards - per referral.
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-slate-50 rounded-3xl ring-1 ring-slate-800 p-1 px-5 flex gap-3 justify-between">
                                <div className="opacity-90 text-xs md:text-sm select-none overflow-hidden overflow-ellipsis whitespace-nowrap my-auto">{ownerReferral}</div>
                                <button onClick={() => {
                                    copyToClipboard(`https://${ownerReferral}`);
                                    showSuccess(3000);
                                }} className="float-right flex w-fit gap-1">
                                    <FaCopy className='text-lg' />
                                    <small className="whitespace-nowrap">Copy Link</small>
                                </button>
                                {Toast}
                            </div>
                            <div className="grid justify-between grid-cols-3 md:grid-cols-3 gap-2">
                                <Link target="_blank" to={`https://twitter.com/intent/tweet?text=Coffer%20City%20is%20your%20one-stop%20digital%20Piggy%20Bank%21%20Save%20crypto%20for%20a%20fixed%20duration%20with%20a%20specified%20weekly%20amount%2C%20and%20watch%20your%20savings%20skyrocket%21%0A%0Ahttps://${ownerReferral}%0A%0A%23DeFiSavings%20%23DecentralizedBanking%20%23BlockchainBanking%20%23CofferCity`} className="bg-slate-50 rounded-3xl ring-1 ring-slate-800 p-1">
                                    <div className="text-center justify-center flex gap-1 px-2">
                                        <img className="w-5" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tISBGb250IEF3ZXNvbWUgRnJlZSA2LjIuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIChJY29uczogQ0MgQlkgNC4wLCBGb250czogU0lMIE9GTCAxLjEsIENvZGU6IE1JVCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMiBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD0iTTQ1OS4zNyAxNTEuNzE2Yy4zMjUgNC41NDguMzI1IDkuMDk3LjMyNSAxMy42NDUgMCAxMzguNzItMTA1LjU4MyAyOTguNTU4LTI5OC41NTggMjk4LjU1OC01OS40NTIgMC0xMTQuNjgtMTcuMjE5LTE2MS4xMzctNDcuMTA2IDguNDQ3Ljk3NCAxNi41NjggMS4yOTkgMjUuMzQgMS4yOTkgNDkuMDU1IDAgOTQuMjEzLTE2LjU2OCAxMzAuMjc0LTQ0LjgzMi00Ni4xMzItLjk3NS04NC43OTItMzEuMTg4LTk4LjExMi03Mi43NzIgNi40OTguOTc0IDEyLjk5NSAxLjYyNCAxOS44MTggMS42MjQgOS40MjEgMCAxOC44NDMtMS4zIDI3LjYxNC0zLjU3My00OC4wODEtOS43NDctODQuMTQzLTUxLjk4LTg0LjE0My0xMDIuOTg1di0xLjI5OWMxMy45NjkgNy43OTcgMzAuMjE0IDEyLjY3IDQ3LjQzMSAxMy4zMTktMjguMjY0LTE4Ljg0My00Ni43ODEtNTEuMDA1LTQ2Ljc4MS04Ny4zOTEgMC0xOS40OTIgNS4xOTctMzcuMzYgMTQuMjk0LTUyLjk1NCA1MS42NTUgNjMuNjc1IDEyOS4zIDEwNS4yNTggMjE2LjM2NSAxMDkuODA3LTEuNjI0LTcuNzk3LTIuNTk5LTE1LjkxOC0yLjU5OS0yNC4wNCAwLTU3LjgyOCA0Ni43ODItMTA0LjkzNCAxMDQuOTM0LTEwNC45MzQgMzAuMjEzIDAgNTcuNTAyIDEyLjY3IDc2LjY3IDMzLjEzNyAyMy43MTUtNC41NDggNDYuNDU2LTEzLjMyIDY2LjU5OS0yNS4zNC03Ljc5OCAyNC4zNjYtMjQuMzY2IDQ0LjgzMy00Ni4xMzIgNTcuODI3IDIxLjExNy0yLjI3MyA0MS41ODQtOC4xMjIgNjAuNDI2LTE2LjI0My0xNC4yOTIgMjAuNzkxLTMyLjE2MSAzOS4zMDgtNTIuNjI4IDU0LjI1M3oiLz48L3N2Zz4=" />
                                        <span className="my-auto text-xs">Twitter</span>
                                    </div>
                                </Link>
                                <Link target="_blank" to={`https://www.facebook.com/sharer/sharer.php?t=&u=text=Coffer%20City%20is%20your%20one-stop%20digital%20Piggy%20Bank%21%20Save%20crypto%20for%20a%20fixed%20duration%20with%20a%20specified%20weekly%20amount%2C%20and%20watch%20your%20savings%20skyrocket%21%0A%0Ahttps://${ownerReferral}`} className="bg-slate-50 rounded-3xl ring-1 ring-slate-800 p-1">
                                    <div className="text-center justify-center flex gap-1 px-2">
                                        <img className="w-5" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tISBGb250IEF3ZXNvbWUgRnJlZSA2LjIuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIChJY29uczogQ0MgQlkgNC4wLCBGb250czogU0lMIE9GTCAxLjEsIENvZGU6IE1JVCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMiBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD0iTTUwNCAyNTZDNTA0IDExOSAzOTMgOCAyNTYgOFM4IDExOSA4IDI1NmMwIDEyMy43OCA5MC42OSAyMjYuMzggMjA5LjI1IDI0NVYzMjcuNjloLTYzVjI1Nmg2M3YtNTQuNjRjMC02Mi4xNSAzNy05Ni40OCA5My42Ny05Ni40OCAyNy4xNCAwIDU1LjUyIDQuODQgNTUuNTIgNC44NHY2MWgtMzEuMjhjLTMwLjggMC00MC40MSAxOS4xMi00MC40MSAzOC43M1YyNTZoNjguNzhsLTExIDcxLjY5aC01Ny43OFY1MDFDNDEzLjMxIDQ4Mi4zOCA1MDQgMzc5Ljc4IDUwNCAyNTZ6Ii8+PC9zdmc+" />
                                        <span className="my-auto text-xs">Facebook</span>
                                    </div>
                                </Link>
                                <button onClick={toggleShareDialog} className="bg-slate-50 rounded-3xl ring-1 ring-slate-800 p-1">
                                    <div className="text-center justify-center flex gap-1 px-2">
                                        <img className="w-5" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tISBGb250IEF3ZXNvbWUgRnJlZSA2LjIuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIChJY29uczogQ0MgQlkgNC4wLCBGb250czogU0lMIE9GTCAxLjEsIENvZGU6IE1JVCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMiBGb250aWNvbnMsIEluYy4gLS0+PHBhdGggZD0iTTM1MiAyMjRjNTMgMCA5Ni00MyA5Ni05NnMtNDMtOTYtOTYtOTZzLTk2IDQzLTk2IDk2YzAgNCAuMiA4IC43IDExLjlsLTk0LjEgNDdDMTQ1LjQgMTcwLjIgMTIxLjkgMTYwIDk2IDE2MGMtNTMgMC05NiA0My05NiA5NnM0MyA5NiA5NiA5NmMyNS45IDAgNDkuNC0xMC4yIDY2LjYtMjYuOWw5NC4xIDQ3Yy0uNSAzLjktLjcgNy44LS43IDExLjljMCA1MyA0MyA5NiA5NiA5NnM5Ni00MyA5Ni05NnMtNDMtOTYtOTYtOTZjLTI1LjkgMC00OS40IDEwLjItNjYuNiAyNi45bC05NC4xLTQ3Yy41LTMuOSAuNy03LjggLjctMTEuOXMtLjItOC0uNy0xMS45bDk0LjEtNDdDMzAyLjYgMjEzLjggMzI2LjEgMjI0IDM1MiAyMjR6Ii8+PC9zdmc+" />
                                        <span className="my-auto text-xs">Share</span>
                                    </div>
                                </button>
                                {ShareDialog}
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
                                <div className="grid gap-5">
                                    <div className="grid gap-8 grid-cols-1 md:grid-cols-3" >
                                        {
                                            myRewards && myRewards.map((reward, i) => (

                                                <div className="grid gap-5" key={i}>
                                                    <div className="grid gap-5 p-5 rounded-xl shadow-lg bg-slate-50/30 pointer-events-none">
                                                        <img src={reward.nftImage} className="m-auto w-52 rounded-3xl shadow-lg border-b-0 border-lime-500 hover:border-b-2 duration-500 hover:scale-105" />
                                                        <div className="m-auto text-xs text-justify grid gap-2">
                                                            <div className="font-dynapuff text-xl">
                                                                {reward.nftName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            ))
                                        }
                                    </div>

                                    {
                                        (myRewards.length === 0) && (
                                            <div className="text-center text-xs italic grid gap-2">
                                                <div>You have no referral rewards at the moment!</div>
                                            </div>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </Layout>
        </React.Fragment>
    )
}

export default Referral
