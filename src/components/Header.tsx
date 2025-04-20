import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import UserProfile from "@/components/UserProfile";
import { LogIn, BarChart, Home, Book, ChartPieIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import React from "react";

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
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <BarChart className="h-4 w-4 mr-2" />
                  Markets
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link to="/dashboard" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                          <ChartPieIcon className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Dashboard
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            View your personalized stock dashboard and analytics
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/stocks" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Stocks</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Browse and analyze stock performance
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/watchlist" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Watchlist</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Track your favorite stocks
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Book className="h-4 w-4 mr-2" />
                  Learn
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/guides" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Guides</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Comprehensive guides to stock investing
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/tutorials" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Tutorials</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Step-by-step tutorials for beginners
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {/* PLANS NAV LINK */}
          <Link
            to="/plans"
            className={`text-sm font-semibold px-3 py-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors ${
              location.pathname === "/plans" ? "bg-accent text-accent-foreground" : ""
            } ml-4`}
            style={{ marginLeft: 24 }}
          >
            Plans
          </Link>
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
