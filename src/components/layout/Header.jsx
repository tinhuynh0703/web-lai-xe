import { Link, useLocation } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { ChevronDown, LayoutGrid, LogOut, User } from "lucide-react";
import { ROUTES } from "../../constants";
import { Button } from "../ui";
import { useAuth } from "../../providers/AuthProvider";
import { useClickOutside } from "../../hooks/useClickOutside";
import { cn } from "../../lib/utils";
import logoImage from "../../assets/logo/logo_sonhung.png";

export function Header() {
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeNav = useCallback(() => setIsNavOpen(false), []);
  const navDropdownRef = useClickOutside(closeNav);

  const navLinks = useMemo(
    () => [
      { to: ROUTES.HOME, label: "Trang Chủ" },
      { to: ROUTES.COURSES, label: "Khóa Đào Tạo", activePrefix: "/khoa-hoc" },
      { to: ROUTES.STUDENTS, label: "Học Viên", activePrefix: "/hoc-vien" },
      {
        to: ROUTES.TUITION_PROFILES,
        label: "Hồ Sơ Học Phí",
        activePrefix: "/ke-toan/ho-so-hoc-phi",
      },
      { to: ROUTES.NHAT_KY_CHUNG_TU, label: "Nhật Ký CT" },
      { to: ROUTES.BANG_CAN_DOI_TAI_KHOAN, label: "Cân đối TK" },
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

  return (
    <header className="fixed top-0 z-100 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-3">
          <Link
            to={ROUTES.HOME}
            className="hover:opacity-80 transition-opacity shrink-0"
            onClick={closeNav}
          >
            <img
              src={logoImage}
              alt="Trung Tâm Đào Tạo Lái Xe"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-3 min-w-0 flex-1">
            <div ref={navDropdownRef} className="relative shrink-0">
              <button
                type="button"
                aria-expanded={isNavOpen}
                aria-haspopup="true"
                aria-controls="main-nav-menu"
                onClick={() => setIsNavOpen((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  "border-gray-300 bg-white hover:bg-gray-50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500",
                  isNavOpen && "border-blue-300 bg-blue-50/60",
                )}
              >
                <LayoutGrid className="h-4 w-4 shrink-0 text-gray-600" />
                <span className="truncate max-w-[7.5rem] sm:max-w-[11rem] text-left">
                  {activeNavLink?.label ?? "Trang chủ"}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-gray-500 transition-transform",
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
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      role="menuitem"
                      to={link.to}
                      onClick={closeNav}
                      className={cn(
                        "block px-4 py-2.5 text-sm font-medium transition-colors",
                        isLinkActive(link)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-800 hover:bg-gray-50",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user && (
                    <div className="sm:hidden border-t border-gray-100 px-4 py-2.5 mt-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <User className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate font-medium text-gray-800">
                          {user.user_name || user.username || "User"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 md:gap-3 shrink-0 pl-2 md:pl-3 border-l border-gray-200">
              {user && (
                <div className="flex items-center gap-2 text-sm text-gray-700 max-w-[8rem] md:max-w-[12rem]">
                  <User className="w-4 h-4 shrink-0" />
                  <span className="font-medium truncate">
                    {user.user_name || user.username || "User"}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2 shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Đăng xuất</span>
              </Button>
            </div>

            <div className="flex sm:hidden shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-1 px-2.5"
                aria-label="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
