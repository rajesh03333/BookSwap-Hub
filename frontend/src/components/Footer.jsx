// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-red-800 text-navbar-bg py-6 "> {/* Use contrasting colors */}
      <div className="container mx-auto px-4 text-center text-sm">
        <p>© {currentYear} BookSwapHub All Rights Reserved.</p>
        {/* Optional: Add links to Terms, Privacy Policy etc. */}
        {/* <div className="mt-2">
          <a href="/terms" className="hover:underline mx-2">Terms of Service</a>
          <a href="/privacy" className="hover:underline mx-2">Privacy Policy</a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;