import "./adminContact.css";
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";

export const AdminContact = () => {
    const { authorizationToken } = useAuth();
    const [contactData,setContactData] = useState([])
    const getAllContact= async () => {
        try {
          const response = await fetch("http://localhost:5000/api/admin/contact", {
            method: "GET",
            headers: {
              Authorization: authorizationToken,
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setContactData(data?.data);
          }
        } catch (error) {
          console.log("error from fetching data in admin", error);
        }
      };

      useEffect(()=>{getAllContact()},[])
    return (
        <>
          <section className="admin-contact-section">
            <div className="container">
              <h1>Contact Us Data</h1>
            </div>
            <div className="container admin-contact">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {contactData.map((itm, index) => (
                    <tr key={index}>
                      <td>{itm.username}</td>
                      <td>{itm.email}</td>
                      <td>{itm.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      );
}