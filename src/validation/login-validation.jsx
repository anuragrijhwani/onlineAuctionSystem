import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string().email().required("Please Enter Email"),
  password: Yup.string().required("please Enter  Password"),
});
