
import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
    icon: string;
    themeColor: 'indigo' | 'emerald' | 'violet'; // kept for compat
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle, icon }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // 🌿 Soft Mint Learning Theme - Active link styles
    const activeLinkClass = (path: string) =>
        location.pathname === path
            ? 'text-deep-green bg-mint-100 border-mint-400 shadow-soft'
            : 'text-slate-500 hover:text-deep-green hover:bg-mint-50 border-transparent';

    return (
        <div className="h-screen w-full bg-mint-50 overflow-hidden font-sans flex flex-col text-deep-green selection:bg-mint-200">
            {/* Top Navigation Bar - Light & Clean */}
            <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-mint-200 px-6 flex items-center justify-between shrink-0 z-30 shadow-soft">

                {/* Left: App Logo & Title */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="w-9 h-9 bg-mint-100 rounded-lg flex items-center justify-center text-mint-600 border border-mint-300 group-hover:bg-mint-200 group-hover:scale-105 transition-all duration-300">
                        <i className={`fa-solid ${icon} text-lg`}></i>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-deep-green tracking-wide leading-tight group-hover:text-mint-700 transition-colors">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-[10px] font-medium text-mint-600 uppercase tracking-widest group-hover:text-mint-500 transition-colors">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Center: Module Navigation Tabs */}
                <div className="hidden md:flex items-center p-1 bg-mint-50 rounded-xl space-x-1 border border-mint-200">
                    <button
                        onClick={() => navigate('/linked-list')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all duration-300 ${activeLinkClass('/linked-list')}`}
                    >
                        Linked List
                    </button>
                    <button
                        onClick={() => navigate('/tree')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all duration-300 ${activeLinkClass('/tree')}`}
                    >
                        Tree
                    </button>
                    <button
                        onClick={() => navigate('/graph')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all duration-300 ${activeLinkClass('/graph')}`}
                    >
                        Graph
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-mint-50 rounded-full border border-mint-200 text-xs text-mint-700">
                        <span className="w-2 h-2 rounded-full bg-soft-green animate-pulse"></span>
                        <span className="font-mono font-semibold">ONLINE</span>
                    </div>

                    <button
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-mint-50 border border-mint-200 text-mint-600 hover:bg-mint-100 hover:border-mint-400 hover:text-mint-700 transition-all"
                        title="Voice Active"
                    >
                        <i className="fa-solid fa-microphone-lines"></i>
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-soft-red hover:border-red-200 hover:bg-red-50 transition-all"
                        title="Exit"
                    >
                        <i className="fa-solid fa-power-off text-sm"></i>
                    </button>
                </div>
            </nav>

            {/* Main Content Area - Clean white canvas */}
            <div className="flex-1 overflow-hidden relative bg-mint-50">
                {/* Subtle top accent line */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-mint-300 to-transparent"></div>

                {children}
            </div>
        </div>
    );
};

export default Layout;
