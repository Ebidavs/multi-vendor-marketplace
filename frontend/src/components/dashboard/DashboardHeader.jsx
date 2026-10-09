
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

import { clearToken } from "../../services/api";

function DashboardHeader({ role = "vendor", onMenuClick }) {
  const isAdmin = role === "admin";

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const refreshUser = () => {
      try {
        setCurrentUser(
          JSON.parse(localStorage.getItem("user") || "null")
        );
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener("storage", refreshUser);
    window.addEventListener("user-updated", refreshUser);

    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("user-updated", refreshUser);
    };
  }, []);

  const displayName =
    currentUser?.name ||
    (isAdmin ? "Administrator" : "Vendor");

  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const searchItems = isAdmin
    ? adminSearchData
    : vendorSearchData;

  const filteredSearchItems = searchItems
    .filter((item) => {
      const search = searchTerm.trim().toLowerCase();

      const searchableText = [
        item.title,
        item.subtitle,
        item.type,
        ...(item.keywords || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search);
    })
    .slice(0, 8);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const goTo = (path) => {
    setProfileOpen(false);
    navigate(path);
  };

  const goToSearchResult = (path) => {
    navigate(path);
    setSearchTerm("");
    setSearchOpen(false);
  };

  const handleLogout = () => {
    setProfileOpen(false);

    clearToken();
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("user-updated"));

    navigate(isAdmin ? "/admin/login" : "/vendor/login", {
      replace: true,
    });
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open dashboard menu"
        >
          <Menu size={22} />
        </button>

        <div className="dashboard-search-wrapper" ref={searchRef}>
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
                if (
                  event.key === "Enter" &&
                  filteredSearchItems.length > 0
                ) {
                  goToSearchResult(
                    filteredSearchItems[0].path
                  );
                }

                if (event.key === "Escape") {
                  setSearchOpen(false);
                }
              }}
            />
          </div>

          {searchOpen && searchTerm.trim() && (
            <div className="dashboard-search-results">
              {filteredSearchItems.length > 0 ? (
                filteredSearchItems.map((item) => (
                  <button
                    type="button"
                    key={item.path}
                    className="dashboard-search-result"
                    onClick={() =>
                      goToSearchResult(item.path)
                    }
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
                    <span>
                      Try searching for another dashboard section.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
        >
          <Bell size={21} />
          <span className="notification-dot"></span>
        </button>

        <div
          className="profile-dropdown-wrapper"
          ref={profileRef}
        >
          <div
            className="dashboard-profile"
            role="button"
            tabIndex={0}
            onClick={() =>
              setProfileOpen((previous) => !previous)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault();
                setProfileOpen((previous) => !previous);
              }
            }}
          >
            <div className="profile-avatar">
              {initials}
            </div>

            <div className="profile-information">
              <span className="profile-name">
                {displayName}
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

          {profileOpen && (
            <div className="profile-dropdown-menu">
              <div className="profile-dropdown-header">
                <div className="profile-dropdown-avatar">
                  {initials}
                </div>

                <div>
                  <strong>{displayName}</strong>

                  <span>
                    {isAdmin
                      ? "Admin Account"
                      : "Vendor Account"}
                  </span>
                </div>
              </div>

              <div className="profile-dropdown-divider"></div>

              <button
                type="button"
                className="profile-dropdown-option"
                onClick={() =>
                  goTo(
                    isAdmin
                      ? "/admin/personal-profile"
                      : "/vendor/personal-profile"
                  )
                }
              >
                <User size={17} />
                <span>My Profile</span>
              </button>

              {!isAdmin && (
                <button
                  type="button"
                  className="profile-dropdown-option"
                  onClick={() => goTo("/vendor/profile")}
                >
                  <Store size={17} />
                  <span>Store Profile</span>
                </button>
              )}

              <button
                type="button"
                className="profile-dropdown-option"
                onClick={() =>
                  goTo(
                    isAdmin
                      ? "/admin/settings"
                      : "/vendor/settings"
                  )
                }
              >
                <Settings size={17} />
                <span>Settings</span>
              </button>

              <div className="profile-dropdown-divider"></div>

              <button
                type="button"
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
