import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="bg-blue-600 text-white py-20">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">Take Control of Your Finances</h1>
                    <p className="text-lg mb-8">
                        Track your spending, set goals, and get personalized insights with our AI-powered dashboard.
                    </p>
                    <Link to="/dashboard">
                        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
                            Get Started
                        </button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-4">
                            <h3 className="text-xl font-bold mb-2">Spending Analysis</h3>
                            <p>Understand your spending patterns with detailed charts and insights.</p>
                        </div>
                        <div className="text-center p-4">
                            <h3 className="text-xl font-bold mb-2">Saving Goals</h3>
                            <p>Set and track your savings goals effortlessly.</p>
                        </div>
                        <div className="text-center p-4">
                            <h3 className="text-xl font-bold mb-2">Investment Advice</h3>
                            <p>Receive personalized investment recommendations based on your goals.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-gray-100 py-16">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-4">
                            <div className="text-4xl mb-4">1</div>
                            <h3 className="text-xl font-bold mb-2">Connect Your Accounts</h3>
                            <p>Securely upload your bank statements or connect your accounts.</p>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-4xl mb-4">2</div>
                            <h3 className="text-xl font-bold mb-2">Analyze Your Data</h3>
                            <p>Get detailed insights and spending patterns automatically.</p>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-4xl mb-4">3</div>
                            <h3 className="text-xl font-bold mb-2">Achieve Your Goals</h3>
                            <p>Set goals, plan investments, and take charge of your finances.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-blue-600 text-white py-6">
                <div className="container mx-auto text-center">
                    <p>&copy; 2025 Personal Finance Dashboard. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
