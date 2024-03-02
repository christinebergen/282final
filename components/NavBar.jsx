import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import utilStyles from "../styles/utils.module.css";
import NavItem from "./NavItem";
import useAuth from "../hooks/useAuth"; // Import useAuth
import { logout } from "../firebase/auth";
import { signInWithGoogle } from "../firebase/auth";
import { useRouter } from "next/router";

const Navbar = () => {
  const [navActive, setNavActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const { user } = useAuth();

  const MENU_LIST = [
    // Only show "Add Campaign" if user is logged in
    ...(user
      ? [
          { text: "All Campaigns", href: "/all-campaigns" },
          { text: "Add Campaign", href: "/add-campaign" },
          // {text: "View Campaigns", href: "/all-campaigns"},
        ]
      : []),
  ];
  const router = useRouter(); // Initialize useRouter
  const handleLogout = () => {
    logout()
      .then(() => {
        // After logging out, redirect to the home page
        router.push("/");
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Logout failed:", error);
      });
  };

  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setNavActive(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header>
      <nav className={`nav`}>
        <Image
          priority
          src="/images/profile.jpg"
          className={utilStyles.borderCircle}
          height={108}
          width={108}
          alt=""
        />
        <Link href={"/"}>
          <h1 className="pl-8 text-[#CCDCE4] text-xl md:text-3xl">
            Imperial Assault Campaign Tracker
          </h1>
        </Link>
        <div
          onClick={() => setNavActive(!navActive)}
          className={`nav__menu-bar`}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div>
          <div>
            <div
              ref={menuRef}
              className={`${navActive ? "active" : ""} nav__menu-list`}
            >
              {MENU_LIST.map((menu, idx) => (
                <div
                  onClick={() => {
                    setActiveIdx(idx);
                    setNavActive(false);
                  }}
                  key={menu.text}
                >
                  <NavItem active={activeIdx === idx} {...menu} />
                </div>
              ))}
              {user ? (
                <>
                  <NavItem text="Logout" onClick={handleLogout} />
                  <div className="text-[#CCDCE4] text-sm md:text-md">
                    You're logged in as: {user.email}
                  </div>
                </>
              ) : (
                <NavItem text="Login" onClick={signInWithGoogle} />
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
