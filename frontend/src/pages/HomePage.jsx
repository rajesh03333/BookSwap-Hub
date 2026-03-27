// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Shared button styling (ensure matches Navbar button if desired)
const buttonClasses = "inline-block font-sans text-base font-semibold text-button-text bg-button-bg hover:bg-button-bg-hover border-none rounded-md py-3 px-8 cursor-pointer transition-colors duration-200 no-underline";

const HomePage = () => {
  return (
    <div
 className="flex flex-col items-center justify-center text-center min-h-screen w-full bg-cover bg-center"
  style={{
    backgroundImage: "url('./bg.jpg')",
  }}
>
      <h1 className="mt-10 mb-6 text-5xl md:text-6xl font-bold font-serif text-red-500 leading-tight">
        Swap Books.<br />
        Save Money.<br />
        Share Knowledge.
      </h1>

      <p className="mb-10 text-lg md:text-xl text-red-500 max-w-2xl">
        Join our community of book lovers and discover your next favorite read while saving money and sharing stories.
      </p>

      <div>
        <Link to="/browse" className={buttonClasses}>
          Browse Books
        </Link>
      </div>

      {/* Optional: Add illustration or image here */}
      {/* <img src="/path/to/your/hero-image.svg" alt="BookSwap illustration" className="mt-12 max-w-sm md:max-w-md" /> */}

      {/* Optional: Add sections for How it Works, Featured Books etc. */}

    </div>
  );
};

export default HomePage;