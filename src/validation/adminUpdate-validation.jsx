import * as Yup from "yup";

export const AdminUpdateSchema = Yup.object({
  username: Yup.string().min(2).max(25).required("Please Enter User Name"),
  email: Yup.string().email().required("Please Enter Email"),
  phone: Yup.string()
    .min(10)
    .max(10)
    .required("Please Enter  Phone Number"),
});
