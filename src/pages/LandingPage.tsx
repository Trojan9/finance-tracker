import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import asset1 from "../assets/asset1.png";
import asset2 from "../assets/asset2.png";
import illustration1 from "../assets/landing1.jpg";
import illustration2 from "../assets/landing2.jpg";
import illustration3 from "../assets/landing3.jpg";
import navBarLogo from "../assets/navbar_logo.png";

// Sample data for charts
const spendingData = [
  { name: "Jan", spending: 300 },
  { name: "Feb", spending: 450 },
  { name: "Mar", spending: 200 },
  { name: "Apr", spending: 600 },
  { name: "May", spending: 350 },
  { name: "Jun", spending: 500 },
];

const investmentData = [
  { name: "Jan", investments: 150 },
  { name: "Feb", investments: 300 },
  { name: "Mar", investments: 500 },
  { name: "Apr", investments: 400 },
  { name: "May", investments: 700 },
  { name: "Jun", investments: 650 },
];

const LandingPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation Bar */}
     {/* Navigation Bar */}
     <nav className="bg-gray-800 py-4 px-6 fixed top-0 w-full z-50 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <img src={navBarLogo} alt="GEYNIUS" className="w-32" />
          
          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6">
            <li><Link to="/" className="text-gray-300 hover:text-white transition">Home</Link></li>
            <li><Link to="/about" className="text-gray-300 hover:text-white transition">About</Link></li>
            <li><Link to="/features" className="text-gray-300 hover:text-white transition">Features</Link></li>
            <li><Link to="/login" className="text-gray-300 hover:text-white transition">Get Started</Link></li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none">
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-gray-800 shadow-md">
            <ul className="flex flex-col items-center space-y-4 py-4">
              <li><Link to="/" className="text-gray-300 hover:text-white transition" onClick={() => setIsOpen(false)}>Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition" onClick={() => setIsOpen(false)}>About</Link></li>
              <li><Link to="/features" className="text-gray-300 hover:text-white transition" onClick={() => setIsOpen(false)}>Features</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-white transition" onClick={() => setIsOpen(false)}>Get Started</Link></li>
            </ul>
          </div>
        )}
      </nav>

      {/* Background Spheres */}
      <img
        src={asset1}
        alt="Decorative Sphere"
        className="absolute top-10 left-10 w-32 md:w-40 h-32 md:h-40 opacity-40"
      />
      <img
        src={asset2}
        alt="Decorative Sphere"
        className="absolute top-40 right-10 w-20 md:w-24 h-20 md:h-24 opacity-30"
      />

      {/* Hero Section */}
      <section className="relative py-28 flex flex-col items-center text-center">
        <div className="bg-gray-800 bg-opacity-60 backdrop-blur-md p-6 md:p-10 rounded-lg shadow-lg max-w-lg md:max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold">
            Take Control of Your Finances
          </h1>
          <p className="text-base md:text-lg mt-4 opacity-80">
            Track your spending, set goals, and get AI-powered financial
            insights.
          </p>
          <Link to="/login">
            <button className="mt-6 bg-gradient-to-r from-purple-600 to-blue-500 px-6 md:px-8 py-2 md:py-3 rounded-md font-semibold hover:opacity-90 transition">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Image with Text Sections */}
      <section className="py-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Section 1 */}
          <img
            src={illustration1}
            alt="Team Analysis"
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Collaborate and Achieve
            </h2>
            <p className="text-sm md:text-lg text-gray-400">
              Our tools help you work smarter, manage finances efficiently, and
              achieve your goals together.
            </p>
          </div>

          {/* Section 2 */}
          <div className="order-2 md:order-1 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              AI-Driven Financial Insights
            </h2>
            <p className="text-sm md:text-lg text-gray-400">
              Leverage the power of AI to identify opportunities, minimize
              risks, and stay ahead of your financial goals.
            </p>
          </div>
          <img
            src={illustration2}
            alt="AI Insights"
            className="rounded-lg shadow-lg max-w-full h-auto order-1 md:order-2"
          />
        </div>
      </section>

      {/* Financial Overview */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Monthly Spending</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={spendingData}>
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="spending"
                    stroke="#6366F1"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Investment Growth</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={investmentData}>
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Bar dataKey="investments" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
      {/* Additional Text Cards */}
      <section className="py-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Budget Planning</h3>
            <p className="opacity-75">
              Easily track and plan your monthly budgets.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Track Spending</h3>
            <p className="opacity-75">
              Visualize your spending habits with detailed graphs.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Secure Investments</h3>
            <p className="opacity-75">
              Receive tailored investment recommendations securely.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                1. Connect Your Accounts
              </h3>
              <p className="opacity-75">
                Securely upload your bank statements or link your accounts.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                2. AI-Driven Analysis
              </h3>
              <p className="opacity-75">
                Receive real-time insights on spending & investments.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                3. Achieve Your Goals
              </h3>
              <p className="opacity-75">
                Save smarter and invest wisely for your future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} GEYNIUS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
