// // import React from "react";

// // const Footer = () => {
// //   return (
// //     <div className="w-full h-11 bg-blue-100 flex flex-col justify-end">
// //       <footer className=" bg-blue-100 p-8 shadow-inner">
// //         <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
// //           {/* Left Section */}
// //           <div className="text-xs md:text-md lg:text-lg font-semibold mb-4 md:mb-0">
// //             <p>&copy; {new Date().getFullYear()} Sirfitech</p>
// //           </div>

// //           {/* Middle Section */}
// //           <div className="flex space-x-8 text-xs md:text-md lg:text-lg font-medium mb-4 md:mb-0 lg: ml-4">
// //             <a href="#privacy" className="hover:text-blue-600">
// //               Privacy Policy
// //             </a>
// //             <a href="#terms" className="hover:text-blue-600">
// //               Terms of Service
// //             </a>
// //             <a href="#contact" className="hover:text-blue-600">
// //               Contact Us
// //             </a>
// //           </div>

// //           {/* Right Section */}
// //           <div className="text-center md:text-right w-full md:w-auto pl-4 text-xs md:text-md lg:text-lg font-medium md:ml-6">
// //             <p>Follow Us:</p>
// //             <div className="flex justify-center md:justify-end space-x-4 mt-2">
// //               <a href="#facebook" className="hover:text-blue-600">
// //                 LinkedIn
// //               </a>
// //               <a href="https://x.com/2SettleHQ" className="hover:text-blue-600">
// //                 Twitter
// //               </a>
// //               <a
// //                 href="https://www.instagram.com/2settlehq/"
// //                 className="hover:text-blue-600"
// //               >
// //                 Instagram
// //               </a>
// //             </div>
// //           </div>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // };

// // export default Footer;

import React from "react";
import { Twitter, Instagram, Camera, Hash } from "lucide-react";
import GestureIcon from "@mui/icons-material/Gesture";

const Footer = () => {
  return (
    <div className="w-full bg-blue-100">
      <footer className="bg-blue-100 p-8 shadow-inner">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Left Section */}
          <div className="text-xs md:text-sm lg:text-base font-semibold mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} Sirfitech</p>
          </div>

          {/* Middle Section */}
          <div className="flex space-x-4 md:space-x-8 text-xs md:text-sm lg:text-base font-medium mb-4 md:mb-0">
            <a
              href="#privacy"
              className="hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </a>
            <a
              href="#contact"
              className="hover:text-blue-600 transition-colors"
            >
              Contact Us
            </a>
          </div>

          {/* Right Section */}
          <div className="text-center md:text-right w-full md:w-auto md:ml-6">
            <p className="text-xs md:text-sm lg:text-base font-medium mb-2">
              Follow Us:
            </p>
            <div className="flex justify-center md:justify-end space-x-4">
              <a
                href="https://x.com/2SettleHQ"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://www.instagram.com/2settlehq/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://snapchat.com/t/chUlQmUr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors"
                aria-label="Snapchat"
              >
                <Camera size={16} />
              </a>
              <a
                href="https://www.threads.net/@2settlehq/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
                aria-label="Threads"
              >
                <Hash size={16} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;

// import React from "react";
// import Image from "next/image";

// const Footer = () => {
//   return (
//     <div className="w-full bg-blue-100">
//       <footer className="bg-blue-100 p-8 shadow-inner">
//         <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
//           {/* Left Section */}
//           <div className="text-xs md:text-sm lg:text-base font-semibold mb-4 md:mb-0">
//             <p>&copy; {new Date().getFullYear()} Sirfitech</p>
//           </div>

//           {/* Middle Section */}
//           <div className="flex space-x-4 md:space-x-8 text-xs md:text-sm lg:text-base font-medium mb-4 md:mb-0">
//             <a
//               href="#privacy"
//               className="hover:text-blue-600 transition-colors"
//             >
//               Privacy Policy
//             </a>
//             <a href="#terms" className="hover:text-blue-600 transition-colors">
//               Terms of Service
//             </a>
//             <a
//               href="#contact"
//               className="hover:text-blue-600 transition-colors"
//             >
//               Contact Us
//             </a>
//           </div>

//           {/* Right Section */}
//           <div className="text-center md:text-right w-full md:w-auto md:ml-6">
//             <p className="text-xs md:text-sm lg:text-base font-medium mb-2">
//               Follow Us:
//             </p>
//             <div className="flex justify-center md:justify-end space-x-4">
//               <a
//                 href="https://x.com/2SettleHQ"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-block rounded-full overflow-hidden hover:opacity-80 transition-opacity"
//                 aria-label="Twitter"
//               >
//                 <Image
//                   src="/placeholder.svg?height=32&width=32"
//                   alt="Twitter"
//                   width={32}
//                   height={32}
//                 />
//               </a>
//               <a
//                 href="https://www.instagram.com/2settlehq/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-block rounded-full overflow-hidden hover:opacity-80 transition-opacity"
//                 aria-label="Instagram"
//               >
//                 <Image
//                   src="/placeholder.svg?height=32&width=32"
//                   alt="Instagram"
//                   width={32}
//                   height={32}
//                 />
//               </a>
//               <a
//                 href="https://snapchat.com/t/chUlQmUr"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-block rounded-full overflow-hidden hover:opacity-80 transition-opacity"
//                 aria-label="Snapchat"
//               >
//                 <Image
//                   src="/placeholder.svg?height=32&width=32"
//                   alt="Snapchat"
//                   width={32}
//                   height={32}
//                 />
//               </a>
//               <a
//                 href="https://www.threads.net/@2settlehq/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-block rounded-full overflow-hidden hover:opacity-80 transition-opacity"
//                 aria-label="Threads"
//               >
//                 <Image
//                   src="/placeholder.svg?height=32&width=32"
//                   alt="Threads"
//                   width={32}
//                   height={32}
//                 />
//               </a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Footer;
