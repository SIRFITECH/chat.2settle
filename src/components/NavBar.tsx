// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Menu, X } from "lucide-react";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import Logo from "./Logo";

// const navigation = [
//   { name: "Transact", href: "/transact" },
//   { name: "History", href: "/history" },
//   { name: "Reportly", href: "/reportly" },
//   { name: "Settings", href: "/setting" },
// ];

// export default function Navbar() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const pathname = usePathname();

//   return (
//     <nav className="bg-[#F9F9F9] shadow">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link href="/" className="flex-shrink-0">
//               <Logo />
//             </Link>
//             <div className="hidden sm:ml-6 sm:flex sm:space-x-4 md:space-x-8">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`inline-flex items-center px-1 pt-1 border-b-2 text-xs sm:text-sm md:text-base font-medium ${
//                     pathname === item.href
//                       ? "border-blue-500 text-blue-500"
//                       : "border-transparent text-black hover:border-blue-500 hover:text-blue-500"
//                   }`}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </div>
//           </div>
//           <div className="flex items-center">
//             <div className="hidden sm:flex sm:items-center">
//               <ConnectButton />
//             </div>
//             <div className="flex items-center sm:hidden">
//               <button
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="inline-flex items-center justify-center p-2 rounded-md text-blue-500 hover:text-[#19485F] hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-blue-500 transition duration-150 ease-in-out"
//               >
//                 <span className="sr-only">Open main menu</span>
//                 {mobileMenuOpen ? (
//                   <X className="block h-6 w-6" />
//                 ) : (
//                   <Menu className="block h-6 w-6" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {mobileMenuOpen && (
//         <div className="sm:hidden bg-[#F9F9F9]">
//           <div className="pt-2 pb-3 space-y-1">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
//                   pathname === item.href
//                     ? "bg-blue-300 border-blue-500 text-gray-600"
//                     : "border-transparent text-black hover:bg-blue-300 hover:border-blue-500 hover:text-gray-600"
//                 }`}
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 {item.name}
//               </Link>
//             ))}
//           </div>
//           <div className="pt-4 pb-3 border-t border-gray-200">
//             <div className="flex justify-center px-4">
//               <ConnectButton />
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Transact", href: "/transact" },
  { name: "History", href: "/history" },
  { name: "Reportly", href: "/reportly" },
  { name: "Settings", href: "/setting" },
] as const;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <nav className="bg-[#F9F9F9] shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-xs sm:text-sm md:text-base font-medium",
                    pathname === item.href
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-black hover:border-blue-500 hover:text-blue-500"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect Button & Mobile Menu */}
          <div className="flex items-center">
            <div className="hidden sm:flex sm:items-center">
              <ConnectButton />
            </div>
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-500 hover:text-[#19485F] hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-blue-500 transition duration-150 ease-in-out"
              >
                <span className="sr-only">
                  {mobileMenuOpen ? "Close menu" : "Open menu"}
                </span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#F9F9F9]">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                  pathname === item.href
                    ? "bg-blue-300 border-blue-500 text-gray-600"
                    : "border-transparent text-black hover:bg-blue-300 hover:border-blue-500 hover:text-gray-600"
                )}
                onClick={toggleMenu}
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
