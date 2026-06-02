// src/components/Navbar.jsx
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userAvatarPlaceholder } from "../assets/placeholders";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navLinkBaseClasses =
    "font-sans text-base font-medium no-underline py-2 px-3 rounded-lg transition-colors duration-200";

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? `${navLinkBaseClasses} bg-brand-brown text-white`
      : `${navLinkBaseClasses} text-link-text hover:bg-brand-brown hover:bg-opacity-10 hover:text-brand-brown`;

  const getLoginLinkClass = ({ isActive }) =>
    isActive
      ? `${navLinkBaseClasses} bg-brand-brown text-white`
      : `${navLinkBaseClasses} text-link-text hover:bg-brand-brown hover:bg-opacity-10 hover:text-brand-brown`;

  const buttonClasses =
    "font-sans text-sm font-semibold text-button-text bg-button-bg hover:bg-button-bg-hover border-none rounded-xl py-2 px-5 cursor-pointer transition-colors duration-200 whitespace-nowrap";
  const signupButtonClasses = `${buttonClasses} inline-block text-center no-underline`;

  const baseUrl = import.meta.env.PROD
    ? "https://bookswap-xmle.onrender.com"
    : "http://localhost:3000";
  const profilePicUrl = user?.profilePic
    ? `${baseUrl}${user.profilePic}`
    : userAvatarPlaceholder;

  return (
    <nav
      aria-label="Main navigation"
      className="w-full flex justify-between items-center py-3 px-6 md:px-10 bg-navbar-bg border-b-2 border-border-blue"
    >
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
      <ul className="list-none hidden sm:flex items-center gap-x-1 m-0 p-0 flex-grow justify-start pl-4">
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
              <NavLink to="/chats" className={getNavLinkClass}>
                Chats
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* Auth Section & Profile */}
      <ul className="list-none flex items-center gap-x-3 md:gap-x-4 m-0 p-0 flex-shrink-0">
        {isAuthenticated && user ? (
          <>
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
          <>
            <li>
              <NavLink to="/login" className={getLoginLinkClass}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" className={signupButtonClasses}>
                Signup
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;