import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-emerald-600 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-white transition-colors hover:text-emerald-100"
        >
          Marketplace
        </Link>

        {/* Navigation Links & Cart Icon */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-emerald-200 transition-colors">
              Home
            </Link>
            <Link to="/products" className="hover:text-emerald-200 transition-colors">
              Products
            </Link>
            <Link to="/login" className="hover:text-emerald-200 transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-emerald-200 transition-colors">
              Register
            </Link>
          </nav>

          {/* SVG Cart Button */}
          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="relative flex items-center justify-center rounded-lg bg-emerald-700 p-2.5 text-white transition-all hover:bg-emerald-800"
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
          </Link>
        </div>
      </div>
    </header>
  );
}