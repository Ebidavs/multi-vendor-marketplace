import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Menu,
  Search,
  ChevronDown,
  User,
  Store,
  Settings,
  LogOut,
} from "lucide-react";
import {
  vendorSearchData,
  adminSearchData,
} from "../../data/dashboardSearchData";

function DashboardHeader({ role = "vendor", onMenuClick }) {
  const isAdmin = role === "admin";

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const navigate = useNavigate();

  // ========================================
  // VENDOR SEARCH ITEMS
  // ========================================

  const searchItems = isAdmin ? adminSearchData : vendorSearchData;

  // ========================================
  // FILTER SEARCH RESULTS
  // ========================================

  const filteredSearchItems = searchItems
    .filter((item) => {
      const search = searchTerm.trim().toLowerCase();

      const searchableText = [
        item.title,
        item.subtitle,
        item.type,
        ...item.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search);
    })
    .slice(0, 8);

  // ========================================
  // CLOSE PROFILE WHEN CLICKING OUTSIDE
  // ========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ========================================
  // NAVIGATION
  // ========================================

  const goTo = (path) => {
    setProfileOpen(false);
    navigate(path);
  };

  const goToSearchResult = (path) => {
    navigate(path);

    setSearchTerm("");
    setSearchOpen(false);
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    setProfileOpen(false);

    alert("Logout will be connected when authentication is integrated.");
  };

  return (
    <header className="dashboard-header">
      {/* =====================================
          LEFT SIDE
      ====================================== */}

      <div className="header-left">
        <button
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open dashboard menu"
        >
          <Menu size={22} />
        </button>

        {/* ===================================
            DASHBOARD SEARCH
        ==================================== */}

        <div className="dashboard-search-wrapper" ref={searchRef}>
          {/* ORIGINAL SEARCH BAR */}

          <div className="dashboard-search">
            <Search size={19} />

            <input
              type="text"
              value={searchTerm}
              placeholder={
                isAdmin
                  ? "Search users, vendors, orders..."
                  : "Search products, orders..."
              }
              onChange={(event) => {
                setSearchTerm(event.target.value);

                setSearchOpen(true);
              }}
              onFocus={() => {
                if (searchTerm.trim()) {
                  setSearchOpen(true);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && filteredSearchItems.length > 0) {
                  goToSearchResult(filteredSearchItems[0].path);
                }

                if (event.key === "Escape") {
                  setSearchOpen(false);
                }
              }}
            />
          </div>

          {/* SEARCH RESULTS */}

          {searchOpen && searchTerm.trim() && (
            <div className="dashboard-search-results">
              {filteredSearchItems.length > 0 ? (
                filteredSearchItems.map((item) => (
                  <button
                    key={item.path}
                    className="dashboard-search-result"
                    onClick={() => goToSearchResult(item.path)}
                  >
                    <div className="search-result-icon">
                      <Search size={15} />
                    </div>

                    <div className="search-result-information">
                      <strong>{item.title}</strong>

                      <span>{item.subtitle}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="dashboard-search-empty">
                  <Search size={18} />

                  <div>
                    <strong>No results found</strong>

                    <span>Try searching for another dashboard section.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =====================================
          RIGHT SIDE
      ====================================== */}

      <div className="header-actions">
        {/* NOTIFICATION */}

        <button className="notification-button" aria-label="Notifications">
          <Bell size={21} />

          <span className="notification-dot"></span>
        </button>

        {/* ===================================
            PROFILE
        ==================================== */}

        <div className="profile-dropdown-wrapper" ref={profileRef}>
          {/* ORIGINAL PROFILE DESIGN */}

          <div
            className="dashboard-profile"
            onClick={() => setProfileOpen((previous) => !previous)}
          >
            <div className="profile-avatar">{isAdmin ? "AD" : "VD"}</div>

            <div className="profile-information">
              <span className="profile-name">
                {isAdmin ? "Administrator" : "MarketHub Vendor"}
              </span>

              <span className="profile-role">
                {isAdmin ? "Admin" : "Vendor"}
              </span>
            </div>

            <ChevronDown
              size={17}
              className={`profile-chevron ${
                profileOpen ? "profile-chevron-open" : ""
              }`}
            />
          </div>

          {/* ===================================
              PROFILE DROPDOWN
          ==================================== */}

          {profileOpen && (
            <div className="profile-dropdown-menu">
              <div className="profile-dropdown-header">
                <div className="profile-dropdown-avatar">
                  {isAdmin ? "AD" : "VD"}
                </div>

                <div>
                  <strong>
                    {isAdmin ? "Administrator" : "MarketHub Vendor"}
                  </strong>

                  <span>{isAdmin ? "Admin Account" : "Vendor Account"}</span>
                </div>
              </div>

              <div className="profile-dropdown-divider"></div>

              {/* MY PROFILE */}

              <button
                className="profile-dropdown-option"
                onClick={() => {
                  setProfileOpen(false);

                  alert(
                    "Profile page will be connected to the authenticated user.",
                  );
                }}
              >
                <User size={17} />

                <span>My Profile</span>
              </button>

              {/* VENDOR STORE PROFILE */}

              {!isAdmin && (
                <button
                  className="profile-dropdown-option"
                  onClick={() => goTo("/vendor/store")}
                >
                  <Store size={17} />

                  <span>Store Profile</span>
                </button>
              )}

              {/* SETTINGS */}

              <button
                className="profile-dropdown-option"
                onClick={() =>
                  goTo(isAdmin ? "/admin/settings" : "/vendor/settings")
                }
              >
                <Settings size={17} />

                <span>Settings</span>
              </button>

              <div className="profile-dropdown-divider"></div>

              {/* LOGOUT */}

              <button
                className="profile-dropdown-option logout-option"
                onClick={handleLogout}
              >
                <LogOut size={17} />

                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
