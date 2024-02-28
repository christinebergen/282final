import Link from "next/link";

const NavItem = ({ text, href, onClick }) => {
  if (href) {
    return (
      <Link href={href}>
        <div className="nav__link" onClick={onClick}>
          {text}
        </div>
      </Link>
    );
  } else {
    return (
      <div className="nav__link" onClick={onClick}>
        {text}
      </div>
    );
  }
};

export default NavItem;
