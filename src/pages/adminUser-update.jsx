import "./adminUser-update.css";
import { useLocation,useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from 'react-toastify';
import { useAuth } from "../store/auth";
import { useEffect} from "react";
import { AdminUpdateSchema } from "../validation/adminUpdate-validation.jsx";


export const AdminUserUpdate = () => {
    const location = useLocation();
    const Navigate = useNavigate();
    const { authorizationToken } = useAuth();

    const UserData = async () => {
        const Response = await fetch(
            "http://localhost:5000/api/admin/user/id",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: authorizationToken,
              },
              body: JSON.stringify({ _id: location?.state?.id }),
            }
          );
          if (Response.ok) {
            const data = await Response.json();
            formik.setFieldValue("username",data?.data?.username);
            formik.setFieldValue("email",data?.data?.email);
            formik.setFieldValue("phone",data?.data?.phone)
        }
    }
    useEffect(()=>{
        UserData();
    },[])

    const handleSubmit1 = async (e) => {
      const params = {
        _id:location?.state?.id,
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
          Navigate("/admin/user");
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


    return (
        <>
          <section>
            <main>
              <div className="section-update">
                <div className="container grid">
                  <div className="update-form">
                    <h1 className="main-heading mb-3">Update User Data</h1>
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
                        Update
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