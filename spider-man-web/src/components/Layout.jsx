import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, onOpenAuth }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar onOpenAuth={onOpenAuth} />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
