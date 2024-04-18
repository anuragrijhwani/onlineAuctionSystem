import "./adminUser.css";
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export const AdminUser = () => {

  const navigate = useNavigate();

  const [userData, setUserData] = useState([]);

  const { authorizationToken } = useAuth();
  const getAllUserData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/users", {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data?.data);
      }
    } catch (error) {
      console.log("error from fetching data in admin", error);
    }
  };

  const deleteUser = async (id) =>{
    try {
      const response = await fetch("http://localhost:5000/api/admin/user/delete", {
        method: "POST", 
        headers:{
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ _id: id }),
      });
      
      if(response.ok) {
        // const data = await response.json();
        toast.success("User successfully deleted")
        getAllUserData();
      } else {
        console.log("data is not deleted");
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  const editUser = (id) =>{
    navigate('/admin/user/update',{state:{id}});
  }

  useEffect(() => {
    getAllUserData();
  }, []);

  return (
    <>
      <section className="admin-user-section">
        <div className="container">
          <h1>Admin Users Data</h1>
        </div>
        <div className="container admin-users">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((itm, index) => (
                <tr key={index}>
                  <td>{itm.username}</td>
                  <td>{itm.email}</td>
                  <td>{itm.phone}</td>
                  <td><button onClick={()=>{editUser(itm._id)}}>Edit</button></td>
                  <td><button onClick={()=>{deleteUser(itm._id)}}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
