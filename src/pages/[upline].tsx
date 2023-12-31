import React, { useEffect } from "react"
import { AppContext } from "../components/wrap"
// import usePreloader, { Preloader } from "../hooks/usePreloader";
// import { WalletConnectButton } from "../components/ConnectWallet";
// import { useAccount } from "wagmi";
import { Navigate, useParams } from "react-router-dom";

const Upline = () => {

    const context = React.useContext(AppContext);
    const { state, dispatch } = context || {};

    const { upline: uplineAddressFromParams } = useParams();

    useEffect(() => {
        const fetchAddressFromParams = async () => {

            // console.log(uplineAddressFromParams);

            uplineAddressFromParams && dispatch({
                type: 'UPDATE_KEY',
                key: 'upline',
                value: `${uplineAddressFromParams}`,
            })

        }

        fetchAddressFromParams();

    }, [uplineAddressFromParams]);

    // console.log(state);

    // const { address, isConnected, isConnecting } = useAccount();

    // Define your text conditionally
    // let loadingText = 'Fetching data . . .';
    // if (!isConnected) loadingText = "Please connect your wallet!"
    // if (isConnecting) loadingText = "Connecting to your wallet. Please wait!"

    // const checks = useCallback(async () => {
    //     // Perform your checks here. For example:
    //     const loaded = isConnected ? true : false;
    //     return loaded;
    // }, [address, isConnected]);

    // // Use the usePreloader hook, passing in the checks and the custom text
    // const { loading } = usePreloader({ checks, text: loadingText });

    // // Conditionally render the Preloader or your actual content based on the loading state
    // if (loading) {
    //     return <Preloader text={loadingText} children={
    //         <WalletConnectButton />
    //     } />;
    // };

    if (uplineAddressFromParams === state.upline) {
        return <Navigate to="/" replace={true} />
    }

    return <Navigate to="/" replace={true} />

}

export default Upline;