import React from "react";

const Footer = () => {
  return (
    <div className="w-full h-11 bg-blue-100 flex flex-col justify-end">
      <footer className=" bg-blue-100 p-8 shadow-inner">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Left Section */}
          <div className="text-xs md:text-md lg:text-lg font-semibold mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} Sirfitech</p>
          </div>

          {/* Middle Section */}
          <div className="flex space-x-8 text-xs md:text-md lg:text-lg font-medium mb-4 md:mb-0 lg: ml-4">
            <a href="#privacy" className="hover:text-blue-600">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-blue-600">
              Terms of Service
            </a>
            <a href="#contact" className="hover:text-blue-600">
              Contact Us
            </a>
          </div>

          {/* Right Section */}
          <div className="text-center md:text-right w-full md:w-auto pl-4 text-xs md:text-md lg:text-lg font-medium md:ml-6">
            <p>Follow Us:</p>
            <div className="flex justify-center md:justify-end space-x-4 mt-2">
              <a href="#facebook" className="hover:text-blue-600">
                Facebook
              </a>
              <a href="#twitter" className="hover:text-blue-600">
                Twitter
              </a>
              <a href="#instagram" className="hover:text-blue-600">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
