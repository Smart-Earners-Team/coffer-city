import { useState, useEffect, useRef } from "react";
import { WalletConnectButton } from "./ConnectWallet";
import { FaBars, FaTimes } from "react-icons/fa";
import { CofferCityLogo } from "./Logo";
import { useSpring, animated } from "react-spring";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggleMobileMenu = (e: any) => {
        e.stopPropagation(); // Prevents the click event from reaching the document
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        // Add the listeners
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("mouseup", handleClickOutside);

        // Cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("mouseup", handleClickOutside);
        };
    }, []);

    const mobileMenuAnimation = useSpring({
        transform: isMobileMenuOpen ? 'scaleY(1)' : 'scaleY(0)',
        config: { tension: 150, friction: 16 }
    });

    return (
        <div className="bg-[#02075d]">
            <div className="flex flex-wrap justify-between text-sm px-5 md:px-28">
                <div>
                    <CofferCityLogo width={120} textClassName='text-slate-50 text-lg md:text-2xl font-bold font-dynapuff' />
                </div>
                <div className="my-auto hidden md:block">
                    <WalletConnectButton />
                </div>
            </div>

            <div className="" ref={menuRef}>
                {/* Hamburger and Mobile menu */}
                <div className="absolute top-0 right-0 mt-6 mr-8 z-10 md:hidden">
                    <button
                        className="p-2 rounded-md hover:bg-slate-100/10 transition-colors"
                        onClick={toggleMobileMenu}
                    >
                        {
                            !isMobileMenuOpen ? <FaBars size={20} /> : <FaTimes size={20} />
                        }
                    </button>
                </div>
                <animated.div
                    className={`${isMobileMenuOpen ? "block" : "hidden"
                        } md:hidden transition-transform transform duration-300 ease-in-out absolute origin-top w-full h-full`}
                    style={mobileMenuAnimation}
                >
                    {/* Mobile menu content */}
                    <div className="grid gap-2 bg-white backdrop-blur-xl text-slate-800 rounded-b-3xl p-5 my-2 mx-5 shadow-2xl h-full">
                        <div>
                            <WalletConnectButton />
                        </div>
                    </div>
                </animated.div>
            </div>
        </div>
    )
}

export default Navbar;
