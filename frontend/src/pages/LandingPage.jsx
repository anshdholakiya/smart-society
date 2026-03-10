import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, CreditCard, Calendar, MessageSquare, Check } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

            {/* --- NAVBAR --- */}
            <nav className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer font-bold tracking-tight text-xl" onClick={() => navigate('/')}>
                    <Shield className="text-blue-600" size={26} fill="currentColor" strokeWidth={0} />
                    <span>SmartSociety</span>
                </div>
                <div className="flex gap-4 items-center">

                    <button
                        onClick={() => navigate('/login')}
                        className="px-5 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        Access Portal
                    </button>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="px-6 py-8 md:py-12 text-center max-w-4xl mx-auto">


                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                    Community Living, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Simplified.</span>
                </h1>

                <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
                    The all-in-one platform for bills, bookings, and complaints. <br className="hidden md:block" />
                    Everything you need to run your society smoothly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all flex items-center gap-2 shadow-xl shadow-blue-200 hover:translate-y-[-2px]"
                    >
                        Get Started <ArrowRight size={20} />
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center gap-8 text-sm font-semibold text-slate-400">
                    <div className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Instant Payments</div>
                    <div className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Secure Data</div>
                    <div className="flex items-center gap-2"><Check size={16} className="text-green-500" /> 24/7 Access</div>
                </div>
            </header>

            {/* --- FEATURES GRID --- */}
            <section className="bg-slate-50 py-12 border-y border-slate-100">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Core Features</h2>
                        <p className="text-slate-500">Essential tools designed for modern residents.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-left">

                        <FeatureCard
                            icon={<Calendar className="text-indigo-600" size={28} />}
                            title="Facility Booking"
                            desc="Reserve common areas like the Club House or Tennis Court with real-time conflict checking."
                        />
                        <FeatureCard
                            icon={<MessageSquare className="text-rose-600" size={28} />}
                            title="Digital Helpdesk"
                            desc="Raise complaints with photo attachments. track resolution status directly from the dashboard."
                        />
                    </div>
                </div>
            </section>

            {/* --- CTA BOTTOM --- */}
            <section className="py-16 px-6 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Ready to upgrade your experience?</h2>
                    <p className="text-slate-500 text-lg">Join the hundreds of communities that have switched to SmartSociety for a hassle-free living experience.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-10 py-5 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-2"
                    >
                        Login to Dashboard <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-white py-12 border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                        <Shield size={18} className="text-slate-900" />
                        <span className="text-slate-900 font-bold">SmartSociety © 2026</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>

        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
        <div className="mb-5 p-3 bg-slate-50 rounded-xl w-fit group-hover:bg-blue-50 transition-colors">{icon}</div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed font-medium text-sm">{desc}</p>
    </div>
);

export default LandingPage;
