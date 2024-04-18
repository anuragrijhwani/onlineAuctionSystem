import "./profile.css";
import {useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from 'react-toastify';
import { useAuth } from "../store/auth";
import { useEffect} from "react";
import { AdminUpdateSchema } from "../validation/adminUpdate-validation.jsx";
import { passwordSchema } from "../validation/passwordUpdate-vaidation.jsx";


export const Profile = () => {
    const Navigate = useNavigate();
    const { authorizationToken,user } = useAuth();

    const ProfileData = async () => {
        const Response = await fetch(
            "http://localhost:5000/api/auth/userData",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify( {_id:user?._id} ),
            }
          );
          if (Response.ok) {
            const data = await Response.json();
            console.log(data);
            formik.setFieldValue("username",data?.data?.username);
            formik.setFieldValue("email",data?.data?.email);
            formik.setFieldValue("phone",data?.data?.phone)
        }
        else
        console.error("Show  error")
    }
    useEffect(()=>{
        ProfileData();
    },[])

    const handleSubmit1 = async (e) => {
      const params = {
        _id: user?._id,
        username: e.username,
        email: e.email,
        phone: e.phone,
      };
      try {
        const response = await fetch(
          `http://localhost:5000/api/admin/user/update`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authorizationToken,
            },
            body: JSON.stringify(params),
          }
        );
  
        const data = await response.json();
        if (response.ok) {
          toast.success("User Update Successful");
          // Navigate("/admin/user");
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
      },
      validationSchema: AdminUpdateSchema,
      onSubmit: handleSubmit1,
    });


    const handleSubmitPass = async (e) => {
      const params = {
        _id: user?._id,
        oldPassword:e.oldPassword,
        newPassword:e.newPassword
      };
      console.log(params);
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/user/password`,
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
          formikPass.resetForm();
          toast.success("password Update Successful");
        }
        else{
          formikPass.setFieldError("oldPassword",data.message,false)
        }
      } catch (error) {
        console.log(error);
      }

    }



    const formikPass = useFormik({
      initialValues: {
        oldPassword:"",
        newPassword:"",
        confirmPassword:"",
      },
      validationSchema: passwordSchema,
      onSubmit: handleSubmitPass,
    });

    return (
        <>
          <section>
            <main>
              <div className="section-update">
                <div className="container grid grid-two-cols">
                  <div className="update-form">
                    <h1 className="heading">Update profile</h1>
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
                      <br />
                      <button type="submit" className="btn btn-submit">
                        Update User
                      </button>
                    </form>
                  </div>
                          {/*  Updating password */}
                    <div className="update-form">
                    <h1 className="heading">Update password</h1>
                    <br />
                    <form onSubmit={formikPass.handleSubmit}>
                    <div>
                    <label htmlFor="oldPassword">Old Password</label>
                    <br />
                    <input
                      type="password"
                      name="oldPassword"
                      placeholder="Password"
                      id="oldPassword"
                      autoComplete="off"
                      value={formikPass.values.oldPassword}
                      onChange={formikPass.handleChange}
                      onBlur={formikPass.handleBlur}
                    />
                    {formikPass.errors.oldPassword && formikPass.touched.oldPassword ? (
                    <p className="validation-error">{formikPass.errors.oldPassword}</p>
                  ) : null}
                  </div>
                  <div>
                    <label htmlFor="newPassword">New Password</label>
                    <br />
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Password"
                      id="newPassword"
                      autoComplete="off"
                      value={formikPass.values.newPassword}
                      onChange={formikPass.handleChange}
                      onBlur={formikPass.handleBlur}
                    />
                    {formikPass.errors.newPassword && formikPass.touched.newPassword ? (
                    <p className="validation-error">{formikPass.errors.newPassword}</p>
                  ) : null}
                  </div>
                  <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <br />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      id="confirmPassword"
                      autoComplete="off"
                      value={formikPass.values.confirmPassword}
                      onChange={formikPass.handleChange}
                      onBlur={formikPass.handleBlur}
                    />
                    {formikPass.errors.confirmPassword && formikPass.touched.confirmPassword ? (
                    <p className="validation-error">{formikPass.errors.confirmPassword}</p>
                  ) : null}
                  </div>
                  <br />
                  <button type="submit" className="btn btn-submit">
                    Update password
                  </button>
                    </form>
                  </div>

                </div>
              </div>
            </main>
          </section>
        </>
      );   
}