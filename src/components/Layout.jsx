import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import NewsTicker from './NewsTicker';

const Layout = ({ children, onOpenAuth, showTicker }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar onOpenAuth={onOpenAuth} />
            {showTicker && <NewsTicker />}
            <main className={`flex-grow ${showTicker ? 'pt-[100px] lg:pt-[112px]' : 'pt-[72px] lg:pt-[72px]'}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
