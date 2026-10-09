
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import xiMarketLogo from "../assets/xi-market-logo.png";
import { useAuth } from "../hooks/useAuth";

export default function Navbar({ cartCount = 0, onCartClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCustomer, logout } = useAuth();

  const displayName = user?.name?.trim() || "My account";
  const displayEmail = user?.email || "";
  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  // Close menus whenever the route changes.
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname, location.search]);

  // Close the profile dropdown on outside clicks.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="relative z-30 bg-emerald-600 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 sm:py-4 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 whitespace-nowrap text-xl font-bold tracking-tight text-white transition-colors hover:text-emerald-100 sm:text-2xl"
        >
          <img
            src={xiMarketLogo}
            alt="Xi Market logo"
            className="h-8 w-16 shrink-0 object-contain sm:h-9 sm:w-[72px]"
          />
          
        </Link>

        {/* Navigation Links & Cart Icon */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <nav className="hidden items-center gap-4 text-sm font-medium md:flex lg:gap-6">
            <Link to="/" className="hover:text-emerald-200 transition-colors">
              Home
            </Link>
            <Link to="/products" className="hover:text-emerald-200 transition-colors">
              Products
            </Link>
            {isAuthenticated ? (
              isCustomer ? (
                <Link to="/orders" className="hover:text-emerald-200 transition-colors">
                  Orders
                </Link>
              ) : null
            ) : (
              <>
                <Link to="/login" className="hover:text-emerald-200 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="hover:text-emerald-200 transition-colors">
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* SVG Cart Button */}
          <Link
            to="/cart"
            onClick={onCartClick}
            aria-label="Shopping Cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-700 text-white transition-all hover:bg-emerald-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.023-.811 2.182-1.928l1.103-7.72A1.125 1.125 0 0020.25 3.75H5.108m2.392 10.5h11.25"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 20.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM9 20.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white ring-2 ring-emerald-700">
                {cartCount > 10 ? "10+" : cartCount}
              </span>
            )}
          </Link>
          {/* Profile / Account Dropdown */}
          {isAuthenticated && (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                aria-label="Open account menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-700 text-sm font-bold text-white transition-all hover:bg-emerald-800"
              >
                {initials}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-40 mt-2 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-gray-800 shadow-xl">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {displayName}
                    </p>
                    {displayEmail && (
                      <p className="truncate text-xs text-gray-500">
                        {displayEmail}
                      </p>
                    )}
                  </div>

                  {isCustomer && (
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        Settings
                      </Link>
                      <Link
                        to="/help"
                        className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        Help / Support
                      </Link>
                    </div>
                  )}

                  <div className="border-t border-gray-100 py-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg border border-emerald-400/50 text-white md:hidden"
          >
            <span className="h-0.5 w-5 rounded-full bg-current" />
            <span className="h-0.5 w-5 rounded-full bg-current" />
            <span className="h-0.5 w-5 rounded-full bg-current" />
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full grid gap-1 border-t border-emerald-500 bg-emerald-700 p-3 text-sm font-medium shadow-lg md:hidden"
        >
          <Link onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center rounded-md px-3 hover:bg-emerald-600" to="/">Home</Link>
          <Link onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center rounded-md px-3 hover:bg-emerald-600" to="/products">Products</Link>

          {isAuthenticated ? (
            isCustomer ? (
              <>
                <Link onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center rounded-md px-3 hover:bg-emerald-600" to="/orders">Orders</Link>
                <Link onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center rounded-md px-3 hover:bg-emerald-600" to="/profile">My Profile</Link>
                <Link onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center rounded-md px-3 hover:bg-emerald-600" to="/settings">Settings</Link>
                <Link onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center rounded-md px-3 hover:bg-emerald-600" to="/help">Help / Support</Link>
              </>
            ) : null
          ) : (
            <>
              <Link onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center rounded-md px-3 hover:bg-emerald-600" to="/login">Login</Link>
              <Link onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center rounded-md px-3 hover:bg-emerald-600" to="/register">Register</Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <div className="border-t border-emerald-500 px-3 py-2 text-xs font-normal text-emerald-100">
                <p className="truncate font-semibold text-white">{displayName}</p>
                {displayEmail && (
                  <p className="truncate">{displayEmail}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-11 items-center rounded-md px-3 text-left text-red-100 hover:bg-emerald-600"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}