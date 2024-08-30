// export default Navbar;

import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";
import Logo from "./Logo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full h-auto bg-blue-100">
      <nav className="bg-blue-100 flex flex-col sm:flex-row justify-between items-center p-4 shadow-md">
        {/* Logo and Menu Button */}
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center">
          {/* Logo */}
          <div className="flex w-full sm:w-auto mt-4 justify-between items-center">
            {/* On small screens, the logo acts as a toggle button */}
            <button
              onClick={toggleMenu}
              className="text-blue-800 focus:outline-none sm:hidden"
            >
              <Logo />
            </button>

            {/* Display Logo normally on larger screens */}
            <div className="hidden sm:block">
              <Logo />
            </div>
          </div>

          {/* Menu Items (hidden on mobile screens) */}
          <div
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } hidden sm:flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0`}
          >
            <a href="transact" className="hover:text-blue-600">
              Transact
            </a>
            <a href="history" className="hover:text-blue-600">
              History
            </a>
            <a href="setting" className="hover:text-blue-600">
              Settings
            </a>
          </div>
        </div>

        {/* Connect Button */}
        <div className="w-full flex justify-end mb-4">
          <ConnectButton />
        </div>

        {/* Menu Items (hidden on larger screens) */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } flex sm:hidden flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0`}
        >
          <a href="transact" className="hover:text-blue-600">
            Transact
          </a>
          <a href="history" className="hover:text-blue-600">
            History
          </a>
          <a href="setting" className="hover:text-blue-600">
            Settings
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
