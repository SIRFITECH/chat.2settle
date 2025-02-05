import Image from "next/image";

const Logo = () => (
  <div className="relative h-8 w-16 md:w-24 lg:w-36">
    <Image
      src="/simple_logo.png"
      alt="Logo"
      fill // Fill the parent element
      objectFit="contain" // Maintain aspect ratio
      priority
    />
  </div>
);

export default Logo;
