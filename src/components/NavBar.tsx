// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import React, { useState } from "react";
// import Logo from "./Logo";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     console.log("Toggle clicked");
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <div className="w-full h-auto bg-blue-100">
//       <nav className="bg-blue-100 flex flex-row justify-between items-center p-4 shadow-md">
//         {/* Logo and Connect Button Row */}
//         <div className="flex items-center w-full sm:w-auto">
//           {/* Logo (also acts as the menu button on small screens) */}
//           <button
//             onClick={toggleMenu}
//             className="text-blue-800 focus:outline-none sm:hidden"
//           >
//             <Logo />
//           </button>

//           {/* Always visible on larger screens, conditionally rendered on smaller screens */}
//           <div className="hidden sm:block">
//             <Logo />
//           </div>
//         </div>

//         {/* Connect Button */}
//         <div className="mt-4 sm:mt-0 w-7/12 sm:w-auto sm:ml-auto sm:order-last text-xs sm:text-base">
//           <ConnectButton />
//         </div>
//       </nav>

//       {/* Stacked Menu Items
//       <div
//         className={`${
//           isMenuOpen ? "block" : "hidden"
//         } sm:hidden bg-blue-100 p-4 absolute top-full left-0 w-full`}
//       >
//         <a href="transact" className="block py-2 text-left hover:text-blue-600">
//           Transact
//         </a>
//         <a href="history" className="block py-2 text-left hover:text-blue-600">
//           History
//         </a>
//         <a href="setting" className="block py-2 text-left hover:text-blue-600">
//           Settings
//         </a>
//       </div> */}

//       <div
//         className={`${
//           isMenuOpen ? "block" : "hidden"
//         } sm:hidden bg-blue-100 p-4 absolute top-full left-0 w-full z-50`}
//       >
//         <a href="transact" className="block py-2 text-left hover:text-blue-600">
//           Transact
//         </a>
//         <a href="history" className="block py-2 text-left hover:text-blue-600">
//           History
//         </a>
//         <a href="setting" className="block py-2 text-left hover:text-blue-600">
//           Settings
//         </a>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

// // THIS WORKS

// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import React, { useState } from "react";
// import Logo from "./Logo";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <div className="w-full h-auto bg-blue-100">
//       <nav className="bg-blue-100 flex flex-row sm:flex-row justify-between items-center p-4 shadow-md">
//         {/* Logo and Connect Button Row */}
//         <div className="flex items-center w-full sm:w-auto">
//           {/* Logo (also acts as the menu button on small screens) */}
//           <button
//             onClick={toggleMenu}
//             className="text-blue-800 focus:outline-none sm:hidden"
//           >
//             <Logo />
//           </button>

//           {/* Always visible on larger screens, conditionally rendered on smaller screens */}
//           <div className="hidden sm:block">
//             <Logo />
//           </div>

//           {/* Menu Items */}
//           <div
//             className={`${
//               isMenuOpen ? "flex" : "hidden"
//             } flex-col sm:flex sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6 text-xs md:text-md lg:text-lg font-sm md:font-medium lg:font-lg w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4`}
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
//         <div className="mt-4 sm:mt-0 w-6/12 sm:w-auto sm:ml-auto sm:order-last text-xs sm:text-base">
//           <ConnectButton />
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;

// CLOSE ENOUGH TO GO
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import React, { useState } from "react";
// import Logo from "./Logo";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <div className="w-full h-auto bg-blue-100">
//       <nav className="bg-blue-100 flex flex-col sm:flex-row justify-between items-center p-4 shadow-md">
//         {/* Logo and Menu Button */}
//         <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center">
//           {/* Logo */}
//           <div className="flex w-full sm:w-auto justify-between items-center">
//             <Logo />
//             {/* Toggle button visible only on small screens */}
//             <button
//               onClick={toggleMenu}
//               className="text-blue-800 focus:outline-none sm:hidden"
//             >
//               {/* Icon or text for the menu toggle */}
//               <Logo />
//             </button>
//           </div>

//           {/* Menu Items (stacked under logo on small screens) */}
//           <div
//             className={`${
//               isMenuOpen ? "flex" : "hidden"
//             } flex-col sm:flex sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0`}
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
//         <div className="mt-4 sm:mt-0 w-full sm:w-auto sm:ml-auto text-xs sm:text-base flex justify-center sm:justify-end">
//           <ConnectButton />
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;

// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import React, { useState } from "react";
// import Logo from "./Logo";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

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
//             <div className="hidden sm:block">
//               <Logo />
//             </div>
//           </div>

//           {/* Menu Items (stacked under logo on small screens) */}
//           <div
//             className={`${
//               isMenuOpen ? "flex" : "hidden"
//             } flex-col sm:flex sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0`}
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
//         {/* Menu Items (stacked under logo on small screens) */}
//         <div
//           className={`${
//             isMenuOpen ? "flex" : "hidden"
//           } flex-col sm:flex sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0`}
//         >
//           <a href="transact" className="hover:text-blue-600">
//             Transact
//           </a>
//           <a href="history" className="hover:text-blue-600">
//             History
//           </a>
//           <a href="setting" className="hover:text-blue-600">
//             Settings
//           </a>
//         </div>
//       </nav>
//     </div>
//   );
// };

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
