import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <div className="w-full h-11 bg-blue-100">
      <nav className="bg-blue-100 flex flex-col sm:flex-row justify-between items-center p-4 shadow-md">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Logo />
        </div>

        {/* Middle Text Items */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 text-xs md:text-md lg:text-lg font-sm md:font-medium lg:font-lg">
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

        {/* Connect Button */}
        <div className="mt-4 sm:mt-0 w-3/12 sm:w-auto text-xs md:text-md lg:text-lg">
          <ConnectButton />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
