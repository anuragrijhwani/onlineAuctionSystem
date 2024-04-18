import { NavLink, Outlet } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { FaRectangleList } from "react-icons/fa6";
export const AdminLayout = () => {
  return (
    <>
      <header>
        <div className="container">
          <nav>
            <ul>
              <li>
                <NavLink to="/admin/user">
                  <FaUser color='rgb(0, 255, 255)'/> Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/contact">
                  <FaMessage color='rgb(0, 255, 255)' /> Contacts
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/products">
                  <FaRectangleList  color='rgb(0, 255, 255)'/> Products
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
};
