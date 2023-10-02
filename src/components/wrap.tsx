import React, { ReactNode, HTMLAttributes, useReducer } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAccount } from "wagmi"

type State = {
    upline: string;
    // add more keys and values as needed
};

type Action = {
    type: string;
    key: string;
    value: string;
};

const initialState: State = {
    upline: '0x0000000000000000000000000000000000000000',
    // add more keys and values as needed
};

export const AppContext = React.createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
}>({
    state: initialState,
    dispatch: () => { },
});

const reducer = (state: State = initialState, action: Action) => {
    switch (action.type) {
        case 'UPDATE_KEY':
            return {
                ...state,
                [action.key]: action.value,
            };
        // add more cases as needed
        default:
            return state;
    }
};

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useWagmiDetails = () => {
    const { address, isConnected } = useAccount();
    return { address, isConnected };
}

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    navbar?: ReactNode;
    footer?: ReactNode;
}

const Layout = ({ children, navbar, footer, ...props }: LayoutProps) => {
    return (
        <div className="font-manrope text-sm" {...props}>
            <div className='absolute top-5 w-full text-slate-50'>
                {navbar && <Navbar />}
            </div>

            <main className="">
                {children}
            </main>

            <div className='py-10'>
                {footer && <Footer />}
            </div>
        </div>
    );
};

export default Layout;
