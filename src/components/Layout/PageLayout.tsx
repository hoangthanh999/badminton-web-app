// Page Layout wrapper with Header
import React from 'react';
import Header from '@/components/Layout/Header';

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    return (
        <div className="page-wrapper">
            <Header />
            <main className="page-content">
                {children}
            </main>
        </div>
    );
};

export default PageLayout;
