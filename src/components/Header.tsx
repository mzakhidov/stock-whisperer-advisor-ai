
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import UserProfile from "@/components/UserProfile";
import { LogIn, BarChart, Book, DollarSign, Info } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React from "react";
import ProtectedLink from "./ProtectedLink";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold tracking-tight">
            AI Stock Whisperer
          </Link>
          {/* Main Navigation */}
          <NavigationMenu>
            <NavigationMenuList>
              {/* Markets nav as direct protected link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <ProtectedLink
                    to="/dashboard"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50"
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    Markets
                  </ProtectedLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Learn nav as regular Link (not protected) */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/guides"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50"
                  >
                    <Book className="h-4 w-4 mr-2" />
                    Learn
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* About nav as direct link (now before Pricing) */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/about"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Pricing nav as direct link (now after About) */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/plans"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pricing
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <UserProfile />
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
