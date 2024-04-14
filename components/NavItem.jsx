import Link from "next/link";

const NavItem = ({ href, text, onClick }) => (
  <Link href={href || "#"} className="text-gray-200 bg-[#06436B] hover:text-white px-4 py-2 block whitespace-nowrap" onClick={onClick}>
    {text}
  </Link>
);

export default NavItem;
