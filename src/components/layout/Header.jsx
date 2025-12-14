import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { ROUTES } from "../../constants";
import { Button } from "../ui";
import { useAuth } from "../../providers/AuthProvider";
import logoImage from "../../assets/logo/logo_sonhung.png";

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const isActive = (path) => {
    if (path === ROUTES.HOME) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { to: ROUTES.HOME, label: "Trang Chủ" },
    { to: ROUTES.COURSES, label: "Khóa Đào Tạo" },
    { to: ROUTES.STUDENTS, label: "Học Viên" },
  ];

  const renderLinks = (onClick) =>
    navLinks.map((link) => (
      <Link
        key={link.to}
        to={link.to}
        onClick={onClick}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive(link.to)
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {link.label}
      </Link>
    ));

  return (
    <header className="fixed top-0 z-100 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to={ROUTES.HOME}
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src={logoImage}
              alt="Trung Tâm Đào Tạo Lái Xe"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4">
            {renderLinks(() => setIsMenuOpen(false))}
            {/* User info and logout */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              {user && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  <span className="font-medium">
                    {user.user_name || user.username || "User"}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </Button>
            </div>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-3 border-t border-gray-200">
            <div className="flex flex-col gap-2 pt-3">
              {renderLinks(() => setIsMenuOpen(false))}
              {/* User info and logout for mobile */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 mt-2">
                {user && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 px-3 py-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">
                      {user.user_name || user.username || "User"}
                    </span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 mx-3"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
