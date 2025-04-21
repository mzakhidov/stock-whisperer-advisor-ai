
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode;
  to: string;
}

const ProtectedLink = React.forwardRef<HTMLAnchorElement, ProtectedLinkProps>(
  ({ to, children, ...props }, ref) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (!isAuthenticated) {
        e.preventDefault();
        navigate("/login");
      }
      // else default navigation allowed
    };

    return (
      <Link
        to={isAuthenticated ? to : "/login"}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

ProtectedLink.displayName = "ProtectedLink";

export default ProtectedLink;
