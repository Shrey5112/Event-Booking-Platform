import { useState } from "react";
import { Button } from "./ui/button";
import { Link, NavLink, useNavigate } from "react-router-dom";
// import { Input } from "./ui/input";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { clearUser } from "../redux/userSlice";
import axios from "axios";
import { toast } from "sonner";
import { toggleTheme } from "@/redux/themeSlice";
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  // const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const { theme } = useSelector((store: RootState) => store.theme);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {}, { withCredentials: true });
      dispatch(clearUser());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-2 bg-white z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">
        {/* logo + search */}
        <div className="flex gap-4 items-center">
          <Link to={"/"}>
            <h1 className="font-bold text-2xl md:text-3xl">Logo</h1>
          </Link>
          {/* <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search"
              className="border border-gray-700 dark:bg-gray-900 bg-gray-300 w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className="absolute right-0 top-0">
              <Search />
            </Button>
          </div> */}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex sm:gap-7 items-center">
          <ul className="flex gap-7 items-center text-lg font-semibold">
            <NavLink to={"/"}><li>Home</li></NavLink>
            {user?.role === "user" && <NavLink to={"/user/booking"}><li>My Booking</li></NavLink>}
            {user?.role === "admin" && <NavLink to={"/all/booking"}><li>All Users Booking</li></NavLink>}
          </ul>

          <Button onClick={() => dispatch(toggleTheme())}>
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </Button>

          <div className="ml-5 flex gap-2 items-center">
            {isAuthenticated ? (
              <>
                <span className="font-medium">Hi, {user?.name}</span>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to={"/login"}><Button>Login</Button></Link>
                <Link to={"/signup"} className="hidden md:block"><Button>Signup</Button></Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 p-4 space-y-4">


          <ul className="flex flex-col gap-4 text-lg font-semibold">
            <NavLink to={"/"} onClick={() => setMobileOpen(false)}><li>Home</li></NavLink>
            {user?.role === "user" && (
              <NavLink to={"/user/booking"} onClick={() => setMobileOpen(false)}><li>My Booking</li></NavLink>
            )}
            {user?.role === "admin" && (
              <NavLink to={"/all/booking"} onClick={() => setMobileOpen(false)}><li>All Users Booking</li></NavLink>
            )}
          </ul>

          <div className="flex justify-between items-center">
            <Button onClick={() => dispatch(toggleTheme())}>
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>

            {isAuthenticated ? (
              <Button onClick={handleLogout}>Logout</Button>
            ) : (
              <div className="flex gap-2">
                <Link to={"/login"} onClick={() => setMobileOpen(false)}><Button>Login</Button></Link>
                <Link to={"/signup"} onClick={() => setMobileOpen(false)}><Button>Signup</Button></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
