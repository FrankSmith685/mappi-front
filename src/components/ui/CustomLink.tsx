import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface CustomLinkProps {
  href: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const CustomLink = ({ href, children, onClick, className }: CustomLinkProps) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`text-sm sm:text-[17px] cursor-pointer text-custom-primary hover:underline ${className}`}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
