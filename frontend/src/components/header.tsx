import { LogOut, Menu, Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "./mode-toogle";

const menuItems = [
  { name: "Features", href: "#link" },
  { name: "Solution", href: "#link" },
  { name: "Pricing", href: "#link" },
  { name: "About", href: "#link" },
];

export const HeroHeader = () => {
  const navigate = useNavigate();

  const [menuState, setMenuState] = React.useState(false);
  const isAuthenticated = !!localStorage.getItem("accessToken");


  const handleLogout = () => {
    // call the backend here..
    localStorage.removeItem("accessToken");
    localStorage.removeItem("email");
    navigate("/?authMode=sign-in", { replace: true });
  };

  return (
    <header>
      <nav
        className={`fixed z-20 border-b bg-white dark:bg-background w-full px-2 `}
      >
        <div
          className={
            "mx-auto mt-2 max-w-8xl px-6 transition-all duration-300 lg:px-12"
          }
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Logo and Mobile Button */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                to="/"
                aria-label="home"
                className="flex items-center space-x-2 gap-2 text-xl"
              >
                <Timer size={30} /> Task-Management
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                {menuState ? (
                  <X className="m-auto size-6 duration-200" />
                ) : (
                  <Menu className="m-auto size-6 duration-200" />
                )}
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:block">
              <ul className="flex gap-8 text-sm">
                {/* {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))} */}
              </ul>
            </div>

            {/* Buttons */}
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut /> Logout
                </Button>
              ) : (
                <div className="flex gap-6">
                  <ModeToggle />
                  <Button size="sm">
                    <Link to="/?authMode=sign-in">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {menuState && (
            <div className="lg:hidden mt-4 w-full rounded-3xl bg-background border p-6 shadow-4xl shadow-zinc-300/20 dark:bg-dark">
              <ul className="space-y-6">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <div className="flex flex-col gap-3 mt-4">
                  {isAuthenticated ? (
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut /> Logout
                    </Button>
                  ) : (
                    <>
                      <Button size="sm">
                        <Link to="/?authMode=sign-in">Sign In</Link>
                      </Button>
                    </>
                  )}
                </div>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
