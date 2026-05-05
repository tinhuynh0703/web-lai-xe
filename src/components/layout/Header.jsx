import { Link, useLocation } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import {
  BarChart3,
  BookText,
  ChevronDown,
  CreditCard,
  History,
  Home,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
  UserPlus,
} from "lucide-react";
import { ROUTES } from "../../constants";
import { Button } from "../ui";
import { useAuth } from "../../providers/AuthProvider";
import { useTheme } from "../../providers";
import { useClickOutside } from "../../hooks/useClickOutside";
import { cn } from "../../lib/utils";
import logoImage from "../../assets/logo/logo_sonhung.png";

export function Header() {
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const closeNav = useCallback(() => setIsNavOpen(false), []);
  const closeUserMenu = useCallback(() => setIsUserMenuOpen(false), []);
  const navDropdownRef = useClickOutside(closeNav);
  const userMenuRef = useClickOutside(closeUserMenu);

  const navLinks = useMemo(
    () => [
      { to: ROUTES.HOME, label: "Trang Chủ", icon: Home },
      // { to: ROUTES.COURSES, label: "Khóa Đào Tạo", activePrefix: "/khoa-hoc" },
      {
        to: ROUTES.STUDENTS,
        label: "Học Viên",
        activePrefix: "/hoc-vien",
        icon: UserPlus,
      },
      {
        to: ROUTES.TUITION_PROFILES,
        label: "Hồ Sơ Học Phí",
        activePrefix: "/ke-toan/ho-so-hoc-phi",
        icon: CreditCard,
      },
      {
        to: ROUTES.LICH_SU_NOP_HOC_PHI,
        label: "Lịch Sử Nộp Học Phí",
        activePrefix: "/ke-toan/lich-su-nop-hoc-phi",
        icon: History,
      },
      {
        to: ROUTES.NHAT_KY_CHUNG_TU,
        label: "Nhật Ký Chứng Từ",
        icon: BookText,
      },
      {
        to: ROUTES.CAN_DOI_TAI_KHOAN,
        label: "Bảng cân đối tài khoản",
        activePrefix: "/ke-toan/can-doi-tai-khoan",
        icon: BarChart3,
      },
    ],
    [],
  );

  const isLinkActive = useCallback(
    (link) => {
      const path = location.pathname;
      if (link.to === ROUTES.HOME) {
        return path === ROUTES.HOME || path === "";
      }
      const prefix = link.activePrefix ?? link.to;
      return path === link.to || path.startsWith(`${prefix}/`);
    },
    [location.pathname],
  );

  const activeNavLink = useMemo(
    () => navLinks.find((link) => isLinkActive(link)),
    [navLinks, isLinkActive],
  );

  const NavMenuIcon = activeNavLink?.icon ?? Home;

  return (
    <header className="fixed top-0 z-100 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-3">
          <Link
            to={ROUTES.HOME}
            className="hover:opacity-80 transition-opacity shrink-0"
            onClick={() => {
              closeNav();
              closeUserMenu();
            }}
          >
            <img
              src={logoImage}
              alt="Trung Tâm Đào Tạo Lái Xe"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-3 min-w-0 flex-1">
            <div ref={navDropdownRef} className="relative shrink-0">
              <button
                type="button"
                aria-expanded={isNavOpen}
                aria-haspopup="true"
                aria-controls="main-nav-menu"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  setIsNavOpen((prev) => !prev);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-2.5 py-2 sm:px-3 text-sm font-medium transition-colors",
                  "border-gray-300 bg-white hover:bg-gray-50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500",
                  isNavOpen && "border-blue-300 bg-blue-50/60",
                )}
              >
                <NavMenuIcon className="h-4 w-4 shrink-0 text-gray-600" />
                <span className="hidden sm:inline truncate max-w-[11rem] text-left">
                  {activeNavLink?.label ?? "Trang Chủ"}
                </span>
                <ChevronDown
                  className={cn(
                    "hidden sm:block h-4 w-4 shrink-0 text-gray-500 transition-transform",
                    isNavOpen && "rotate-180",
                  )}
                />
              </button>

              {isNavOpen && (
                <div
                  id="main-nav-menu"
                  role="menu"
                  className={cn(
                    "absolute right-0 mt-1 w-[min(18rem,calc(100vw-2rem))] max-h-[min(24rem,70vh)] overflow-y-auto",
                    "rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-[200]",
                  )}
                >
                  {navLinks.map((link) => {
                    const ItemIcon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        role="menuitem"
                        to={link.to}
                        onClick={() => {
                          closeNav();
                          closeUserMenu();
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                          isLinkActive(link)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-800 hover:bg-gray-50",
                        )}
                      >
                        <ItemIcon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isLinkActive(link)
                              ? "text-blue-700"
                              : "text-gray-500",
                          )}
                          aria-hidden
                        />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0 pl-2 sm:pl-3 border-l border-gray-200">
              {/* Chỉ từ sm: hiện nút — tránh xung đột display với base Button (cn không merge Tailwind) */}
              <div className="hidden sm:flex shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="items-center gap-2 shrink-0 px-2.5 sm:px-3"
                  title={
                    isDark
                      ? "Chuyển sang chế độ sáng"
                      : "Chuyển sang chế độ tối"
                  }
                  aria-label={
                    isDark
                      ? "Chuyển sang chế độ sáng"
                      : "Chuyển sang chế độ tối"
                  }
                >
                  {isDark ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {user && (
                <div ref={userMenuRef} className="relative shrink-0">
                  <button
                    type="button"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-controls="user-account-menu"
                    id="user-account-button"
                    onClick={() => {
                      setIsNavOpen(false);
                      setIsUserMenuOpen((prev) => !prev);
                    }}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm font-medium transition-colors max-w-[min(14rem,calc(100vw-10rem))]",
                      "border-gray-300 bg-white hover:bg-gray-50 text-gray-800",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500",
                      isUserMenuOpen && "border-blue-300 bg-blue-50/60",
                    )}
                  >
                    <User className="h-4 w-4 shrink-0 text-gray-600" />
                    <span className="hidden sm:inline font-medium truncate">
                      {user.user_name || user.username || "User"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-gray-500 transition-transform",
                        isUserMenuOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      id="user-account-menu"
                      role="menu"
                      aria-labelledby="user-account-button"
                      className={cn(
                        "absolute right-0 mt-1 w-[min(14rem,calc(100vw-2rem))]",
                        "rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-[200]",
                      )}
                    >
                      <button
                        type="button"
                        role="menuitem"
                        className="sm:hidden flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
                        onClick={() => {
                          toggleTheme();
                          closeUserMenu();
                        }}
                        aria-label={
                          isDark
                            ? "Chuyển sang chế độ sáng"
                            : "Chuyển sang chế độ tối"
                        }
                      >
                        {isDark ? (
                          <Sun className="h-4 w-4 shrink-0 text-gray-600" />
                        ) : (
                          <Moon className="h-4 w-4 shrink-0 text-gray-600" />
                        )}
                        {isDark ? "Giao diện sáng" : "Giao diện tối"}
                      </button>
                      <Link
                        role="menuitem"
                        to={ROUTES.SETTINGS}
                        onClick={closeUserMenu}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
                          location.pathname === ROUTES.SETTINGS
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-800 hover:bg-gray-50",
                        )}
                      >
                        <Settings className="h-4 w-4 shrink-0" />
                        Cài đặt
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          closeUserMenu();
                          logout();
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 shrink-0" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
