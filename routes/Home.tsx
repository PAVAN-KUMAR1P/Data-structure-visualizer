
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    const FeatureCard = ({ title, icon, color, path, desc, delay }: { title: string, icon: string, color: string, path: string, desc: string, delay: string }) => {
        // Soft Mint Learning Theme - calming and approachable
        return (
            <div
                className={`group relative p-1 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer ${delay}`}
                onMouseEnter={() => setHoveredCard(title)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(path)}
            >
                {/* Card Background with Soft Shadow */}
                <div className="absolute inset-0 bg-white rounded-3xl border border-mint-200 shadow-soft-lg transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(45,212,191,0.15)] group-hover:border-mint-300"></div>

                {/* Content */}
                <div className="relative h-full bg-white rounded-[1.4rem] p-8 flex flex-col items-start gap-4 overflow-hidden z-10">
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(45,212,191,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.5)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                    {/* Icon Box */}
                    <div className="w-16 h-16 rounded-2xl bg-mint-50 border border-mint-200 flex items-center justify-center text-3xl shadow-soft group-hover:scale-110 group-hover:bg-mint-100 transition-all duration-500 text-mint-500">
                        <i className={`fa-solid ${icon}`}></i>
                    </div>

                    <div className="mt-2 text-left">
                        <h3 className="text-2xl font-bold text-deep-green mb-2 group-hover:text-mint-600 transition-colors">{title}</h3>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed">{desc}</p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto w-full pt-6 flex justify-between items-center border-t border-mint-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-mint-500 transition-colors">Ready to Learn</span>
                        <div className="w-10 h-10 rounded-full bg-mint-50 border border-mint-200 flex items-center justify-center text-slate-400 group-hover:bg-mint-400 group-hover:border-mint-400 group-hover:text-white transition-all shadow-soft">
                            <i className="fa-solid fa-arrow-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-mint-50 text-deep-green font-sans selection:bg-mint-200 overflow-x-hidden">
            {/* Navbar - Soft Mint Learning */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-mint-200 shadow-soft">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-mint-100 rounded-xl flex items-center justify-center border border-mint-300 shadow-soft">
                            <i className="fa-solid fa-layer-group text-mint-500 text-xl"></i>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-deep-green">
                            DSA<span className="text-mint-500">Voice</span><span className="text-sky-active">.</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
                        <span className="cursor-pointer hover:text-mint-600 transition-colors">Modules</span>
                        <span className="cursor-pointer hover:text-mint-600 transition-colors">Docs</span>
                        <span className="w-px h-4 bg-mint-200"></span>
                        <div className="flex items-center gap-2 text-mint-600 bg-mint-50 px-3 py-1.5 rounded-full border border-mint-200">
                            <i className="fa-solid fa-microphone text-sm"></i>
                            <span className="font-semibold text-xs">Voice Ready</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Calming and Inviting */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                {/* Soft Background FX */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-mint-200/30 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-mint-200 text-mint-600 text-xs font-bold mb-8 animate-fade-in-up shadow-soft">
                        <span className="w-2 h-2 rounded-full bg-soft-green"></span>
                        🌿 SOFT MINT LEARNING MODE
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-deep-green mb-8 tracking-tight leading-tight animate-fade-in-up animation-delay-100">
                        <span>Learn Algorithms</span> <br className="hidden md:block" />
                        <span className="relative">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-mint-500 via-sky-active to-mint-500">Without the Stress</span>
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
                        Experience data structures in a <span className="text-mint-600 font-semibold">calm, visual environment</span>.
                        Control with your voice. Learn at your own pace.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-in-up animation-delay-300">
                        <button
                            onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-8 py-4 bg-mint-400 hover:bg-mint-500 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-soft-lg hover:shadow-[0_10px_30px_rgba(45,212,191,0.3)]"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Start Learning <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                            </span>
                        </button>

                        <button className="group px-8 py-4 bg-white border border-mint-200 hover:border-mint-400 text-slate-600 rounded-xl font-bold transition-all hover:bg-mint-50 hover:text-mint-600 shadow-soft">
                            <i className="fa-solid fa-microphone mr-2 text-mint-500"></i> Enable Voice
                        </button>
                    </div>
                </div>
            </section>

            {/* Subtle Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.08]" style={{
                backgroundImage: 'linear-gradient(rgba(45, 212, 191, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(45, 212, 191, 0.2) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
            }}></div>

            {/* Modules Grid */}
            <section id="modules" className="relative py-24 px-6 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-16 px-4 border-b border-mint-200 pb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-deep-green mb-2">Learning Modules</h2>
                            <p className="text-slate-500 text-sm font-medium">Choose a data structure to explore</p>
                        </div>
                        <div className="hidden md:flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-mint-400"></span>
                            <span className="w-3 h-3 rounded-full bg-mint-200"></span>
                            <span className="w-3 h-3 rounded-full bg-mint-100"></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            title="Linked List"
                            icon="fa-link"
                            color="mint"
                            path="/linked-list"
                            desc="Linear data structure visualization. Manipulate pointers, traverse nodes, and detect loops."
                            delay="animate-fade-in-up animation-delay-100"
                        />
                        <FeatureCard
                            title="Binary Tree"
                            icon="fa-sitemap"
                            color="mint"
                            path="/tree"
                            desc="Hierarchical data structures. Visualize BST, AVL balancing, and Heap operations instantly."
                            delay="animate-fade-in-up animation-delay-200"
                        />
                        <FeatureCard
                            title="Graph Network"
                            icon="fa-share-nodes"
                            color="mint"
                            path="/graph"
                            desc="Complex node relationships. Run BFS, DFS, and Shortest Path algorithms on custom networks."
                            delay="animate-fade-in-up animation-delay-300"
                        />
                    </div>
                </div>
            </section>

            {/* Voice Commands Hint Strip */}
            <section className="py-12 border-t border-mint-200 bg-white/60 backdrop-blur-lg">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <p className="text-sm font-semibold text-slate-400 mb-6">AVAILABLE VOICE COMMANDS</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['"Insert 42"', '"Delete Head"', '"Find Middle"', '"Start BFS"', '"Explain This"'].map((cmd, i) => (
                            <span key={i} className="px-4 py-2 bg-mint-50 border border-mint-200 rounded-lg text-mint-700 font-medium text-xs hover:bg-mint-100 hover:border-mint-300 transition-all cursor-default shadow-soft">
                                {cmd}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="py-8 bg-white text-center text-slate-400 text-xs font-medium border-t border-mint-200">
                <p>🌿 DSA Voice • Learning Without Stress • v2.0</p>
            </footer>

            <style>{`
                 @keyframes pulse-soft {
                    0%, 100% { opacity: 0.7; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.02); }
                 }
                 .animate-pulse-soft {
                    animation: pulse-soft 3s infinite ease-in-out;
                 }
                 .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 4s ease infinite;
                 }
                 @keyframes gradient-x {
                    0% { background-position: 0% 50% }
                    50% { background-position: 100% 50% }
                    100% { background-position: 0% 50% }
                 }
            `}</style>
        </div>
    );
};

export default Home;
