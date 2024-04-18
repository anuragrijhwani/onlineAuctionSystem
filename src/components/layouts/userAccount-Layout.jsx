import { NavLink, Outlet } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { FaRectangleList } from "react-icons/fa6";
import { RiFileList3Fill } from "react-icons/ri";

export const Account = () =>{
    return (
        <>
          <header>
            <div className="container">
              <nav>
                <ul>
                  <li>
                    <NavLink to="/account/profile">
                      <FaUser color='rgb(0, 255, 255)'   /> Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/product">
                      <FaRectangleList color='rgb(0, 255, 255)' /> My Products
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/account/bids">
                    <RiFileList3Fill color='rgb(0, 255, 255)' /> My Bids
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/account/winner">
                    <RiFileList3Fill color='rgb(0, 255, 255)' /> Winning Products
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <Outlet />
        </>
      );
}