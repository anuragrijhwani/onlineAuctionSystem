import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { FaRectangleList } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
export const AdminLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [token, setToken] = useState(localStorage.getItem("Token"));

  useEffect(() => {
    if ((!!user?._id && user?.isAdmin != true) || !token) {
      navigate("/")
    };
  }, [user]);
  return (
    <>
      <header>
        <div className="container">
          <nav>
            <ul>
              <li>
                <NavLink to="/admin/user">
                  <FaUser color="rgb(0, 255, 255)" /> Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/contact">
                  <FaMessage color="rgb(0, 255, 255)" /> Contacts
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/products">
                  <FaRectangleList color="rgb(0, 255, 255)" /> Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/order">
                  <FaRectangleList color="rgb(0, 255, 255)" /> Win & Order
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
