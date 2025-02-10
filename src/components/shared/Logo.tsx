import Image from "next/image";

const Logo = () => (
  <div className="relative h-8 w-16 text-2xl md:w-24 lg:w-36">
    <Image
      src="/simple_logo.png"
      alt="Logo"
      fill
      objectFit="contain"
      priority
    />
  </div>
);

export default Logo;
