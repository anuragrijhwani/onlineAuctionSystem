import * as Yup from "yup";

export const signUpSchema = Yup.object({
  username: Yup.string().min(2).max(25).required("Please Enter User Name"),
  email: Yup.string().email().required("Please Enter Email"),
  phone: Yup.string()
    .min(10)
    .max(10)
    .required("Please Enter  Phone Number"),
  password: Yup.string().min(6).max(25).required("please Enter Password"),
  confirm_password: Yup.string()
    .required("please Enter confirm Password")
    .oneOf([Yup.ref("password"), null], "Password must match"),
});
