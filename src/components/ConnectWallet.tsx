import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';

export const WalletConnectButton = () => {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === 'authenticated');
                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'className': 'opacity-0 pointer-events-none select-none',
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button onClick={openConnectModal} type="button" className="bg-[#28a745]/40 hover:bg-[#28a745]/50 duration-300 text-white p-2 rounded-lg">
                                        Connect Wallet
                                    </button>
                                );
                            }
                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} type="button" className="bg-[#28a745]/40 hover:bg-[#28a745]/50 duration-300 p-2 rounded-lg">
                                        Wrong network!
                                    </button>
                                );
                            }
                            return (
                                <div className="flex gap-3">
                                    <button
                                        onClick={openChainModal}
                                        className="flex items-center bg-[#28a745]/40 hover:bg-[#28a745]/50 duration-300 text-white p-2 rounded-lg"
                                        type="button"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                className="bg-[#28a745]/40 hover:bg-[#28a745]/50 duration-300 w-3 h-3 rounded-full overflow-hidden mr-1"
                                            >
                                                {chain.iconUrl && (
                                                    <img
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        className="w-3 h-3"
                                                    />
                                                )}
                                            </div>
                                        )}
                                        {chain.name}
                                    </button>
                                    <Link to={'/dashboard'} className="bg-[#28a745]/40 hover:bg-[#28a745]/50 duration-300 rounded-lg p-2 overflow-hidden">Dashboard</Link>
                                    <button onClick={openAccountModal} type="button" className="bg-[#28a745]/40 hover:bg-[#28a745]/50 duration-300 p-2 rounded-lg">
                                        {account.displayName}
                                        {account.displayBalance
                                            ? ` (${account.displayBalance})`
                                            : ''}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    )
}