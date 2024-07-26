import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <div className="w-full h-11 bg-blue-100">
      <nav className="bg-blue-100 flex justify-between items-center p-4 shadow-md">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Logo />
        </div>

        {/* Middle Text Items */}
        <div className="flex space-x-4 text-xs md:text-md lg:text-lg font-sm md:font-medium lg:font-lg">
          <a href="#home" className="hover:text-blue-600">
            Transact
          </a>
          <a href="#about" className="hover:text-blue-600">
            History
          </a>
          <a href="#contact" className="hover:text-blue-600">
            Settings
          </a>
        </div>
        <div className=" w-4/12 text-xs md:text-md lg:text-lg ">
          <ConnectButton />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
