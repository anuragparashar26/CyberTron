import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full">
      <h1 className="text-5xl text-primary-green font-bold mb-4 animate-pulse">Welcome to CyberTron</h1>
      <p className="text-lg mb-8">Your interactive cybersecurity learning environment.</p>
      <Link to="/terminal" className="bg-primary-green text-dark-bg font-bold py-2 px-6 border-2 border-primary-green rounded hover:bg-dark-bg hover:text-primary-green transition-all">
        Launch Terminal
      </Link>
    </div>
  );
};

export default Home;
