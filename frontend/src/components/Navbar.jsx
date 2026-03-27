// src/components/Navbar.jsx
import React, { useState } from "react"; // Added useState
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // <-- Import useAuth
import { userAvatarPlaceholder } from "../assets/placeholders"; // Import placeholder image

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth(); // <-- Get auth state and logout function
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- Style Definitions ---
  const navLinkBaseClasses =
    "font-sans text-base font-medium text-link-text no-underline hover:text-brand-brown py-2 transition-colors duration-200";
  const navLinkActiveClasses = "font-bold text-brand-brown";
  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? `${navLinkBaseClasses} ${navLinkActiveClasses}`
      : navLinkBaseClasses;
  const getLoginLinkClass = ({ isActive }) =>
    `${navLinkBaseClasses} px-3 ${isActive ? navLinkActiveClasses : ""}`;
  const buttonClasses =
    "font-sans text-sm font-semibold text-button-text bg-button-bg hover:bg-button-bg-hover border-none rounded-xl py-2 px-5 cursor-pointer transition-colors duration-200 whitespace-nowrap"; // Adjusted padding slightly
  const signupButtonClasses = `${buttonClasses} inline-block text-center no-underline`;

  // Construct profile picture URL - Use the deployed API URL in production
  const baseUrl = import.meta.env.PROD
    ? "https://bookswap-xmle.onrender.com"
    : "http://localhost:3000";
  const profilePicUrl = user?.profilePic
    ? `${baseUrl}${user.profilePic}` // Assuming backend serves uploads at root /uploads/ path
    : userAvatarPlaceholder;

  return (
    <nav
      aria-label="Main navigation"
      className="w-full flex justify-between items-center py-3 px-6 md:px-10 bg-navbar-bg border-b-2 border-border-blue"
    >
      {" "}
      {/* Adjusted padding */}
      {/* Brand Logo */}
      <div className="flex-shrink-0">
        <Link
          to="/"
          className="font-serif text-2xl md:text-3xl font-bold text-brand-brown no-underline mr-4 md:mr-8"
        >
          BookSwapHub
        </Link>
      </div>
      {/* Navigation Links */}
      <ul className="list-none hidden sm:flex items-center gap-x-6 md:gap-x-8 m-0 p-0 flex-grow justify-start pl-4">
        {" "}
        {/* Adjusted gap/padding */}
        <li>
          <NavLink to="/" className={getNavLinkClass} end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/browse" className={getNavLinkClass}>
            Browse
          </NavLink>
        </li>
        {/* Show Dashboard/Add Book only when authenticated */}
        {isAuthenticated && (
          <>
            <li>
              <NavLink to="/dashboard" className={getNavLinkClass}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/add-book" className={getNavLinkClass}>
                Add Book
              </NavLink>
            </li>
            <li>
              <NavLink to="/wishlist" className={getNavLinkClass}>
                Wishlist
              </NavLink>
            </li>
            <li>
                <NavLink to="/chats">Chats</NavLink>
            </li>
          </>
        )}
      </ul>
      {/* Auth Section & Profile */}
      <ul className="list-none flex items-center gap-x-3 md:gap-x-4 m-0 p-0 flex-shrink-0">
        {isAuthenticated && user ? (
          // Logged In View
          <>
            {/* Display User Name and Profile Picture */}
            <li className="hidden md:flex items-center gap-x-2">
              {user?.profilePic ? (
                <img
                  src={profilePicUrl}
                  alt={user.name || "User Avatar"}
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = userAvatarPlaceholder;
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-brown text-white flex items-center justify-center font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <span className="text-sm font-medium text-link-text hidden lg:inline">
                {user.name}
              </span>
            </li>
            <li>
              <button type="button" onClick={logout} className={buttonClasses}>
                Logout
              </button>
            </li>
          </>
        ) : (
          // Logged Out View
          <>
            <li>
              {" "}
              <NavLink to="/login" className={getLoginLinkClass}>
                {" "}
                Login{" "}
              </NavLink>{" "}
            </li>
            <li>
              {" "}
              <NavLink to="/signup" className={signupButtonClasses}>
                {" "}
                Signup{" "}
              </NavLink>{" "}
            </li>
          </>
        )}
      </ul>
      {/* TODO: Add mobile menu toggle button here */}
    </nav>
    // TODO: Add mobile menu structure here (conditionally rendered)
  );
};

export default Navbar;
