import { NAV_ITEMS } from "@/config/navigation";
import { NavLink } from "./NavLink";

export function DesktopNav() {
  return (
    <div className="hidden sm:flex space-x-4 md:space-x-8">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.label} href={item.href}>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}
