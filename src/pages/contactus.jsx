import { useState } from "react";
import "./contactus.css";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const ContactUs = () => {
  const [contact, setContact] = useState({
    username: "",
    email: "",
    message: "",
  });

  const [UserData, setUserData] = useState(true);

  const { user } = useAuth();

  if (UserData && user) {
    setContact({
      username: user.username,
      email: user.email,
      message: "",
    });

    setUserData(false);
  }

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setContact({
      ...contact,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(contact);
    try {
      const response = await fetch("http://localhost:5000/api/form/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });
      // console.log(response);

      if (response.ok) {
        setContact({ message: "" });
        toast.success("Product Added Successfully");
        // window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="section-contact">
        <div className="contact-content container">
          <h1 className="main-heading">Contact Us</h1>
        </div>
        <div className="container grid grid-two-cols">
          <div className="contact-img">
            <img src="/images/support.png" alt="ContactUs Img" />
          </div>
          <section className="section-form">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username">User Name</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={contact.username}
                  onChange={handleInput}
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={contact.email}
                  onChange={handleInput}
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label htmlFor="message">Message</label>
                <br />
                <textarea
                  name="message"
                  id="message"
                  value={contact.message}
                  onChange={handleInput}
                  cols="30"
                  rows="5"
                  required
                ></textarea>
              </div>

              <div>
                <button type="submit">Submit</button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </>
  );
};
