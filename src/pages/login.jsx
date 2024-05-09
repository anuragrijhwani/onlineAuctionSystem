import "./login.css";
import { useAuth } from "../store/auth";
import { useFormik } from "formik";
import { loginSchema } from "../validation/login-validation.jsx";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
export const Login = () => {

  const { storeToken } = useAuth();
  const Navigate = useNavigate();
  const handleSubmit1 = async (e) => {
    try {
      const Response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(e),
      });
      if (Response.ok) {

          const data = await Response.json();
          //storing token in local storage
          storeToken(data.Token);
          toast.success("Login SuccessFul");
          formik.resetForm();
          if(data?.data?.isAdmin == true)
          {
            Navigate("/admin/user");
          }
          else{
            Navigate("/");
          }
      } else {
        toast.error("email or password is invalid");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formik =  useFormik({
    initialValues:{
      email:"",
      password:""
    },
    validationSchema: loginSchema,
    onSubmit: handleSubmit1,
  }) 

  return (
    <>
      <section>
        <main>
          <div className="section-login">
            <div className="container grid grid-two-cols">
              <div className="login-image">
                <img src="/images/login.png" alt="registrationImage" />
              </div>
              <div className="login-Form">
                <h1 className="main-heading mb-3">Login Form</h1>
                <br />
                <form onSubmit={formik.handleSubmit}>
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
                     {formik.errors.email && formik.touched.email ? (
                    <p className="validation-error">{formik.errors.email}</p>
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
                  <br />
                  <button type="submit" className="btn btn-submit">
                    Submit
                  </button>
                  <br />
                  <br />
                  <Link className="forgotPassword" to="/forgotPassword"> Forgot Password </Link>
                </form>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};
