import { ReactNode, HTMLAttributes } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

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
