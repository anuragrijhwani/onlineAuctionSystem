import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../store/auth";
import { FaRegUser } from "react-icons/fa";

export const Navbar = () => {
  const {isLoggedIn} = useAuth();

  return (
    <header>
      <div className="Container">
        <div className="logo-brand">
          <a href="/">BidLunchPad</a>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/contactus">ContactUs</NavLink>
            </li>
            <li>
              <NavLink to="/product">Product</NavLink>
            </li>
            { isLoggedIn == true ? (
              <>
              <li>
              <NavLink to="addProduct">AddProduct</NavLink>
            </li>
              <li>
                <NavLink to="logout">Logout</NavLink>
              </li>
              <li>
              <FaRegUser color='rgb(0, 255, 255)' /> <NavLink to="account/profile">My Account</NavLink>
              </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="signup">SignUp</NavLink>
                </li>
                <li>
                  <NavLink to="login">Login</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
