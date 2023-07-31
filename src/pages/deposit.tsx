import React, { useCallback, useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/wrap"
import cmc from './../utils/extras/cmc.json'
import EarnersDropdown from "../components/EarnersDropdown"
import { FaCheck } from "react-icons/fa"
import CofferCityVaultABI from './../utils/ABIs/CofferVaultABI.json'
import ERC20ABI from './../utils/ABIs/ERC20ABI.json'
import { useContractInitializer } from "../hooks/useEthers"
import { getAmountForAssets } from "../hooks/getAmountForAssets"
import { ethers } from "ethers"
import { addresses } from "../hooks/addresses"
import { getDuration } from "../hooks/getDuration"
import { useEthersSigner } from "../hooks/wagmiSigner"
import { useAccount, useNetwork } from "wagmi"
import BigNumber from 'bignumber.js'
import { useNavigate } from 'react-router-dom';
import usePreloader, { Preloader } from "../hooks/usePreloader"
import { WalletConnectButton } from "../components/ConnectWallet"

const getAddressArray = async () => {
    const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: addresses.CofferCityVault[97], contractABI: CofferCityVaultABI });

    let addrArray: string[];

    addrArray = await contract?.getSupportedTokens();
    // console.log(addrArray);

    return addrArray;
}

const getFeePercent = async (value: number) => {
    const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: addresses.CofferCityVault[97], contractABI: CofferCityVaultABI });

    const feePercent = await contract?.feePercent();
    const base = await contract?.base();

    const result = value * Number(feePercent) / Number(base);

    // console.log(result);

    return result;
}

export const getTokenData = async (tokenAddr: string) => {

    let tokenData = {
        address: tokenAddr,
        symbol: '',
        logo: ''
    };

    // Search the tokens array
    const token = cmc.tokens.find(token => token.address === tokenAddr);
    tokenData.logo = String(token?.logoURI);
    tokenData.symbol = String(token?.symbol);
    return tokenData;
}

const populateAssets = async () => {
    const addressArray: string[] = await getAddressArray();
    // console.log(addressArray);

    let assets = [];

    try {
        for (let i = 0; i < addressArray.length; i++) {
            const tk = await getTokenData(addressArray[i]);
            // console.log(tk);
            assets.push(tk);
        }
    } catch (error) {
        console.log(error);
    }

    // console.log(assets);
    return assets;
}

interface SP {
    address: string;
    symbol: string;
    logo: string;
}

const Deposits = () => {

    const dropdownOptions: string[] = [`weeks`, `months`, `years`];
    const { chain } = useNetwork();
    const { address, isConnected, isConnecting } = useAccount();
    // console.log(address);
    // console.log(typeof address);
    const cID = Number(chain?.id);
    const signer = useEthersSigner({ chainId: cID });
    const history = useNavigate();

    const [supportedAssets, setSupportedAssets] = useState<SP[]>([{
        address: '',
        symbol: '',
        logo: '',
    }]);

    const [tokenAmounts, setTokenAmounts] = useState<number[]>([]);
    const [tokenDurations, setTokenDurations] = useState<number[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<SP | null>(null);
    const [selectedAmount, setSelectedAmount] = useState<string>('');
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
    const [amountValid, setAmountValid] = useState<boolean>(false);
    const [durationValid, setDurationValid] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>(dropdownOptions[0]);
    const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [isBalanceSufficient, setIsBalanceSufficient] = useState<boolean>(false);

    // Create a function that will be called when an option is selected in the dropdown
    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
        // Check if the input value is valid
        if (Number(selectedDuration) > maxDuration && option === 'weeks' || option !== 'weeks' && Number(selectedDuration) !== 0 || tokenDurations.includes(Number(selectedDuration))) {
            setDurationValid(true);
        }
        else {
            setDurationValid(false);
        }
    };

    // Create the action handlers
    const actionHandlers = {
        'weeks': () => handleOptionChange('weeks'),
        'months': () => handleOptionChange('months'),
        'years': () => handleOptionChange('years'),
    };

    useEffect(() => {
        const fetchAssets = async () => {
            const res = await populateAssets();
            setSupportedAssets(res);
        }

        fetchAssets();
    }, [])

    useEffect(() => {
        const calculateOutput = async () => {
            let output: number = 0;
            let amt: number = 0;

            if (selectedOption === 'weeks') {
                amt = Number(selectedAmount) * Number(selectedDuration);
                output = amt - await getFeePercent(amt);
            }
            if (selectedOption === 'months') {
                amt = Number(selectedAmount) * Number(selectedDuration) * 4;
                output = amt - await getFeePercent(amt);
            }
            else {
                amt = Number(selectedAmount) * Number(selectedDuration) * 52;
                output = amt - await getFeePercent(amt);
            }

            // console.log(output)
            setWithdrawalAmount(output);
            await checkApproval();
        }

        if (amountValid && durationValid) {
            calculateOutput();
        };

    }, [address, selectedAmount, selectedDuration, selectedOption])

    const maxTokenAmount = tokenAmounts ? Math.max(...tokenAmounts) : 0;
    const maxDuration = tokenDurations ? Math.max(...tokenDurations) : 0;

    const selectAsset = async (val: SP) => {
        if (supportedAssets) setSelectedAsset(val);

        try {
            const res = await getAmountForAssets(val.address);
            // console.log(res);
            const tRes: bigint[] = res.amountTiersByToken;
            // console.log(tRes);

            const dRes: bigint[] = res.durationTiers;
            // console.log(dRes);

            // Convert each item in the array to a parseFloat value
            const tokenTiers = tRes.map(item => parseFloat(ethers.formatUnits(item, res.assetDecimals)));

            // Convert each item in the array to a number
            const durationTiers = dRes.map(item => Number(getDuration(ethers.toNumber(item))));

            // console.log(tokenTiers);
            // console.log(durationTiers);

            setTokenAmounts(tokenTiers);
            setTokenDurations(durationTiers);

        } catch (error) {
            console.log(error)
        }        
    }

    const selectAmount = async (amt: string) => {
        const amount = Number(amt);
        // console.log(amount);
        setSelectedAmount(amt);

        // Check if the input value is valid
        if (amount > maxTokenAmount || tokenAmounts.includes(amount)) {
            await handleBalance(amount);
            setAmountValid(true);
            await checkApproval();
        }
        else {
            setAmountValid(false);
        }
        return amount;
    }

    const handleAmountChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSelectedAmount(value);

        // Convert the input value to a number
        const numericValue = Number(value);

        // Check if the input value is valid
        if (numericValue > maxTokenAmount || tokenAmounts.includes(numericValue)) {
            await handleBalance(numericValue);
            setAmountValid(true);
            await checkApproval();
        }
        else {
            setAmountValid(false);
        }
    }

    const selectDuration = async (amt: number) => {

        const dur = amt;

        setSelectedDuration(dur);

        setSelectedOption('weeks');
        handleOptionChange('weeks');

        // Check if the input value is valid
        if (dur > maxDuration || tokenDurations.includes(dur) || dur < maxDuration && selectedOption !== 'weeks' && dur !== 0) {
            setDurationValid(true);
        }
        else {
            setDurationValid(false);
        }
    }

    const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = Number(event.target.value);

        setSelectedDuration(numericValue);

        // Check if the input value is valid
        if (numericValue > maxDuration || tokenDurations.includes(numericValue) || numericValue < maxDuration && selectedOption !== 'weeks' && numericValue !== 0) {
            setDurationValid(true);
        }
        else {
            setDurationValid(false);
        }
    }

    const handleApprove = async () => {
        // selectedAmount && console.log(`${selectedAmount} ${selectedAsset?.symbol}`);
        // console.log(`${selectedDuration} ${selectedOption}`);

        const contract = new ethers.Contract(String(selectedAsset?.address), ERC20ABI, signer);

        const approve = await contract?.approve(addresses.CofferCityVault[97], ethers.MaxUint256);
        await approve.wait();
        await checkApproval();
    }

    const handleConfirm = async () => {
        setAmountValid(false);
        const ref: string = "0xBD8F7209033bA6BA81e122C3070C4F613c252269";
        const contract = new ethers.Contract(addresses.CofferCityVault[97], CofferCityVaultABI, signer);

        let amt: string = '0';
        let dur: number = 0;
        let assetIndex: number = (selectedAsset) ? supportedAssets.findIndex(asset => asset.address === selectedAsset.address && asset.symbol === selectedAsset.symbol && asset.logo === selectedAsset.logo) : -1;
        // console.log(assetIndex);

        let durTier: number = (tokenDurations.includes(Number(selectedDuration))) ? tokenDurations.indexOf(Number(selectedDuration)) : tokenDurations.indexOf(maxDuration);
        //(tokenDurations.indexOf(Number(selectedDuration)) !== -1) ? tokenDurations.indexOf(Number(selectedDuration) : tokenDurations.indexOf(maxDuration);
        let amtTier: number = (tokenAmounts.includes(Number(selectedAmount))) ? tokenAmounts.indexOf(Number(selectedAmount)) : 255;
        // console.log(amtTier);
        //(tokenAmounts.indexOf(selectedAmount) !== -1) ? tokenAmounts.indexOf(selectedAmount): 255;

        if (selectedOption === 'weeks') {
            dur = Number(selectedDuration) * 604800;
        } else if (selectedOption === 'months') {
            dur = Number(selectedDuration) * 2628000;
        } else {
            dur = Number(selectedDuration) * 31536000;
        }

        if (amtTier == 255) {
            const assetContract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: String(selectedAsset?.address), contractABI: ERC20ABI });
            const assetDecimals: number = await assetContract?.decimals();

            amt = new BigNumber(Number(selectedAmount)).times(new BigNumber(10).pow(Number(assetDecimals))).toFixed();
        }

        const newDeposit = await contract.newDeposit(amt, dur, assetIndex, durTier, amtTier, ref);
        await newDeposit.wait();
        // console.log(newDeposit);
        if (newDeposit) {
            await checkApproval();
            history('/overview');
        };
    }

    const checkApproval = async () => {
        if (selectedAmount) {
            const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: String(selectedAsset?.address), contractABI: ERC20ABI });

            const allowance: number = await contract?.allowance(address, addresses.CofferCityVault[97]);

            const assetDecimals: number = await contract?.decimals();
            // console.log(assetDecimals);

            // const value = (Number(selectedAmount) * assetDecimals);
            const value = new BigNumber(Number(selectedAmount)).times(new BigNumber(10).pow(Number(assetDecimals))).toFixed();

            // console.log(allowance);
            // console.log(value);

            // const status = (Number(allowance) >= Number(selectedAmount)) ? true : false;

            const status = (new BigNumber(allowance).gte(value)) ? true : false;

            // const balance = await contract?.balanceOf(address);
            // console.log(balance);

            // const balSuf = (new BigNumber(balance).gte(value)) ? true : false;

            // console.log(status);
            // console.log(balSuf);
            setIsApproved(status);
        }
    }

    const handleBalance = async (amt: number) => {
        const contract = useContractInitializer({ rpc: 'https://bsc-testnet.publicnode.com', contractAddress: String(selectedAsset?.address), contractABI: ERC20ABI });

        const assetDecimals: number = await contract?.decimals();
        // console.log(assetDecimals);

        const value = new BigNumber(amt).times(new BigNumber(10).pow(Number(assetDecimals))).toFixed();

        const balance = await contract?.balanceOf(address);
        // console.log(balance);

        const balSuf = (new BigNumber(balance).gte(value)) ? true : false;

        setIsBalanceSufficient(balSuf);
    }

    // Define your text conditionally
    let loadingText = 'Fetching data . . .';
    if (!isConnected) loadingText = "Please connect your wallet!"
    if (isConnecting) loadingText = "Connecting to your wallet. Please wait!"

    const checks = useCallback(async () => {
        // Perform your checks here. For example:
        const loaded = isConnected && supportedAssets ? true : false;
        return loaded;
    }, [address, isConnected]);

    // Use the usePreloader hook, passing in the checks and the custom text
    const { loading } = usePreloader({ checks, text: loadingText });

    // Conditionally render the Preloader or your actual content based on the loading state
    if (loading) {
        return <Preloader text={loadingText} children={
            <WalletConnectButton/>
        }/>;
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>New Deposits | Coffer City</title>
            </Helmet>
            <Layout navbar footer>
                <div className="grid gap-10 px-10 md:px-32 pt-[38%] md:pt-[13%] h-[120%] md:h-[130%]">
                    <div className="grid gap-8">

                        <div>
                            <div className="text-4xl font-dynapuff font-bold">Pick An Asset</div>
                            <div className="grid gap-5 grid-cols-2 md:grid-cols-5">
                                {
                                    supportedAssets && supportedAssets.map((val) => (
                                        <div
                                            key={val.address}
                                            className={`grid gap-2 rounded-xl p-5 relative cursor-pointer transform transition-transform duration-300 ease-in-out ${val.address === selectedAsset?.address ? 'bg-[#27A844]/40' : 'bg-slate-300/30'}`}
                                            onClick={async () => (
                                                await selectAsset(val)
                                            )}
                                            style={{ transform: val.address === selectedAsset?.address ? 'scale(0.9)' : 'scale(1)' }}
                                        >
                                            <div className="absolute top-0 left-0">
                                                {val.address === selectedAsset?.address && (
                                                    <div className="bg-slate-50 p-2 m-2 rounded-lg">
                                                        <FaCheck className="text-[#27A844]" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2 font-semibold flex-col items-center justify-center">
                                                <img src={val.logo} className="mx-auto select-none" />
                                                <div className="mx-auto">{val.symbol}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        {
                            selectedAsset && (
                                <div>
                                    <div className="text-2xl font-dynapuff font-bold">Pick Weekly Amount</div>
                                    <div className="md:flex md:flex-wrap grid gap-2">
                                        {
                                            selectedAsset && tokenAmounts && (
                                                <div key={selectedAsset.address} className="flex flex-wrap gap-2" >
                                                    {
                                                        tokenAmounts.map((tk) => (
                                                            <button
                                                                key={tk} className={`my-auto rounded-lg border p-2 duration-300 
                                                                ${Number(selectedAmount) === tk ? 'bg-[#27A844] text-white' : 'hover:bg-[#27A844]/40'}`}
                                                                onClick={() => selectAmount(String(tk))}>
                                                                {tk} {selectedAsset.symbol}
                                                            </button>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <input
                                                onChange={async (event: any) => await handleAmountChange(event)}
                                                value={selectedAmount}
                                                min={maxTokenAmount}
                                                autoFocus={false}
                                                type="number"
                                                id="wAmount"
                                                name="wAmount"
                                                className={`bg-transparent p-2 px-3 rounded-lg ring-2 ${amountValid ? 'ring-[#27A844]/90 focus:ring-[#27A844]/' : 'ring-red-500/90 focus:ring-red-500'} outline-none duration-300 w-fit`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            selectedAsset && (
                                <div>
                                    <div className="text-2xl font-dynapuff font-bold">Pick a duration</div>
                                    <div className="md:flex grid gap-3">
                                        {
                                            selectedAsset && tokenDurations && (
                                                <div key={selectedAsset.address} className="flex flex-wrap gap-2" >
                                                    {
                                                        tokenDurations.map((td) => (
                                                            <button
                                                                key={td} className={`my-auto rounded-lg border p-2 duration-300 
                                                                ${selectedOption === 'weeks' && selectedDuration === td ? 'bg-[#27A844] text-white' : 'hover:bg-[#27A844]/40'}`}
                                                                onClick={async () => {
                                                                    await selectDuration(td);
                                                                }}>
                                                                {td} weeks
                                                            </button>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                        <div className="grid md:flex gap-2 text-xs">
                                            <input
                                                onChange={handleDurationChange}
                                                value={Number(selectedDuration)}
                                                min={maxDuration}
                                                autoFocus={false}
                                                type="number"
                                                id="duration"
                                                name="duration"
                                                className={`bg-transparent p-2 px-3 rounded-lg ring-2 ${durationValid ? 'ring-[#27A844]/90 focus:ring-[#27A844]/' : 'ring-red-500/90 focus:ring-red-500'} outline-none duration-300 w-fit`}
                                            />
                                        </div>
                                        <div className="my-auto">
                                            <EarnersDropdown
                                                className="w-fit"
                                                options={dropdownOptions}
                                                actionHandlers={actionHandlers}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                    </div>
                    <div className='grid gap-3'>

                        {
                            selectedAsset && (
                                <div className='grid gap-3'>
                                    <div className='text-2xl font-bold font-dynapuff'>Summary</div>
                                    <div>
                                        You'll save {amountValid ? selectedAmount : '0'} {selectedAsset?.symbol} weekly and withdraw {withdrawalAmount} {selectedAsset?.symbol} after {durationValid ? selectedDuration : '0'} {selectedOption}
                                    </div>
                                    <div className='w-full'>
                                        <button className={`my-auto rounded-lg border p-2 duration-300 
                                            ${amountValid && durationValid ? 'bg-[#27A844] hover:bg-[#27A844]/90 text-white' : 'opacity-30 bg-red-500 text-white'}`}
                                            onClick={async () => {
                                                isApproved ? await handleConfirm() : await handleApprove()
                                            }}
                                            disabled={!(amountValid && durationValid)}>
                                            {
                                                isApproved ? 'Confirm' : 'Approve'
                                            }
                                        </button>
                                        {
                                            (!isBalanceSufficient && amountValid) && (
                                            <div className='italic text-xs text-red-500 py-2'>
                                                Insufficient {selectedAsset.symbol} balance.
                                            </div>
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </Layout>
        </React.Fragment>
    )
}

export default Deposits
