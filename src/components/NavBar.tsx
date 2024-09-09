// // export default Navbar;

// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import React, { useState } from "react";
// import Logo from "./Logo";
// import Link from "next/link";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <div className="w-full h-auto bg-blue-100">
//       <nav className="bg-blue-100 flex flex-col sm:flex-row justify-between items-center p-4 shadow-md">
//         {/* Logo and Menu Button */}
//         <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center">
//           {/* Logo */}
//           <div className="flex w-full sm:w-auto mt-4 justify-between items-center">
//             {/* On small screens, the logo acts as a toggle button */}
//             <button
//               onClick={toggleMenu}
//               className="text-blue-800 focus:outline-none sm:hidden"
//             >
//               <Logo />
//             </button>

//             {/* Display Logo normally on larger screens */}
// <div className="hidden sm:block">
//   <Logo />
// </div>
//           </div>

//           {/* Menu Items (hidden on mobile screens) */}
//           <div
//             className={`${
//               isMenuOpen ? "flex" : "hidden"
//             } hidden sm:flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0`}
//           >
//             <a href="transact" className="hover:text-blue-600">
//               Transact
//             </a>
//             <a href="history" className="hover:text-blue-600">
//               History
//             </a>
//             <a href="setting" className="hover:text-blue-600">
//               Settings
//             </a>
//           </div>
//         </div>

//         {/* Connect Button */}
//         <div className="w-full flex justify-end mb-4">
//           <ConnectButton />
//         </div>

//         {/* Menu Items (hidden on larger screens) */}
// <div
//   className={`${
//     isMenuOpen ? "flex" : "hidden"
//   } flex sm:hidden flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0`}
// >
//   <a href="transact" className="hover:text-blue-600">
//     Transact
//   </a>
//   <a href="history" className="hover:text-blue-600">
//     History
//   </a>
//   <a href="setting" className="hover:text-blue-600">
//     Settings
//   </a>
// </div>
//         {/* {mobileMenuOpen && (
//           <div className="sm:hidden bg-[#19485F]">
//             <div className="pt-2 pb-3 space-y-1">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
//                     pathname === item.href
//                       ? "bg-[#D9E0A4] border-[#D9E0A4] text-[#19485F]"
//                       : "border-transparent text-[#D9E0A4] hover:bg-[#D9E0A4] hover:border-[#D9E0A4] hover:text-[#19485F]"
//                   }`}
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </div>
//             <div className="pt-4 pb-3 border-t border-[#D9E0A4]">
//               <div className="flex justify-center px-4">
//                 <ConnectButton />
//               </div>
//             </div>
//           </div>
//         )} */}
//       </nav>
//     </div>
//   );
// };

// export default Navbar;

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Logo from "./Logo";

const navigation = [
  { name: "Transact", href: "/transact" },
  { name: "History", href: "/history" },
  { name: "Settings", href: "/setting" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-[#F9F9F9] shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-xs sm:text-sm md:text-base font-medium ${
                    pathname === item.href
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-black hover:border-blue-500 hover:text-blue-500"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:flex sm:items-center">
              <ConnectButton />
            </div>
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-500 hover:text-[#19485F] hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-blue-500 transition duration-150 ease-in-out"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#F9F9F9]">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  pathname === item.href
                    ? "bg-blue-300 border-blue-500 text-gray-600"
                    : "border-transparent text-black hover:bg-gray-50 hover:border-gray-300 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex justify-center px-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
