import "./signup.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { useFormik } from "formik";
import {signUpSchema} from "../validation/signup-validation.jsx";
import { toast } from 'react-toastify';

export const SignUp = () => {


  const Navigate = useNavigate();
  const { storeToken } = useAuth();

  const handleSubmit1 = async (e,action) => {

    const params = {
      username: e.username,
      email: e.email,
      phone: e.phone,
      password: e.password,
    };
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        }
      );

      const data = await response.json();
      if (response.ok) {
        storeToken(data.Token);
        action.resetForm()
        toast.success("Registration Successful")
        Navigate("/");
      }
      else{
        formik.setFieldError("email",data.message,false)
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: signUpSchema,
    onSubmit: handleSubmit1,
  });

  return (
    <>
      <section>
        <main>
          <div className="section-registration">
            <div className="container grid grid-two-cols">
              <div className="registration-image">
                <img src="/images/register.png" alt="registrationImage" />
              </div>
              <div className="registration-form">
                <h1 className="main-heading mb-3">Registration Form</h1>
                <br />
                <form onSubmit={formik.handleSubmit}>
                  <div>
                    <label htmlFor="username">User Name</label>
                    <br />
                    <input
                      type="text"
                      name="username"
                      placeholder="User Name"
                      id="username"
                      autoComplete="off"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.username && formik.touched.username ? (
                    <p className="validation-error">{formik.errors.username}</p>
                  ) : null}
                  </div>
                  
                  <div>
                    <label htmlFor="email">Email</label>
                    <br />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      id="email"
                      autoComplete="off"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.email && formik.touched.email && 
                    <p className="validation-error">{formik.errors.email}</p>
                  }
                 
                  </div>
                  <div>
                    <label htmlFor="phone">Phone number</label>
                    <br />
                    <input
                      type="number"
                      name="phone"
                      placeholder="Phone number"
                      id="phone"
                      autoComplete="off"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.errors.phone && formik.touched.phone ? (
                    <p className="validation-error">{formik.errors.phone}</p>
                  ) : null}
                  </div>
                  <div>
                    <label htmlFor="password">Password</label>
                    <br />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      id="password"
                      autoComplete="off"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                      {formik.errors.password && formik.touched.password ? (
                    <p className="validation-error">{formik.errors.password}</p>
                  ) : null}
                  </div>
                  <div>
                    <label htmlFor="confirm_password">Confirm Password</label>
                    <br />
                    <input
                      type="password"
                      name="confirm_password"
                      placeholder="Confirm Password"
                      id="confirm_password"
                      autoComplete="off"
                      value={formik.values.confirm_password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                     {formik.errors.confirm_password && formik.touched.confirm_password ? (
                    <p className="validation-error">{formik.errors.confirm_password}</p>
                  ) : null}
                  </div>
                  <br />
                  <button type="submit" className="btn btn-submit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};
