import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import NavItem from "./NavItem";
import useAuth from "../hooks/useAuth";
import { logout, signInWithGoogle } from "../firebase/auth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const MENU_ITEMS = [
    user && { text: "All Campaigns", href: "/all-campaigns" },
    user && { text: "Add Campaign", href: "/add-campaign" },
  ].filter(Boolean);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        isMenuOpen
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-30 bg-[#06436B] shadow">
      <nav className="flex justify-between items-center p-4">
        <Image
          priority
          src="/images/profile.jpg"
          className="rounded-full"
          height={48}
          width={48}
          alt="Profile Image"
        />
        <Link
          href="/"
          className="text-lg md:text-xl lg:text-4xl text-gray-200 hover:text-white"
        >
          Imperial Assault Campaign Tracker
        </Link>
        <div
          className="md:hidden flex flex-col space-y-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="block w-8 h-0.5 bg-gray-200"></span>
          <span className="block w-8 h-0.5 bg-gray-200"></span>
          <span className="block w-8 h-0.5 bg-gray-200"></span>
        </div>
        <div
          ref={menuRef}
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } flex-col md:flex md:flex-row md:items-center absolute md:relative top-14 md:top-0 right-0 md:w-auto w-full bg-[#06436B] p-4 md:p-0`}
        >
          {MENU_ITEMS.map((item, idx) => (
            <NavItem key={idx} {...item} onClick={() => setIsMenuOpen(false)} />
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="text-gray-200 hover:text-white px-4 py-2 block whitespace-nowrap"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="text-gray-200 hover:text-white px-4 py-2 block whitespace-nowrap"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
