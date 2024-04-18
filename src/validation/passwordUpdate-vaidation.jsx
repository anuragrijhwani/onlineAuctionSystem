import * as Yup from "yup";

export const passwordSchema = Yup.object({
  oldPassword: Yup.string().min(6).max(25).required("please Enter Old-Password"),  
  newPassword: Yup.string().min(6).max(25).required("please Enter New-Password"),
  confirmPassword: Yup.string()
    .required("please Enter confirm Password")
    .oneOf([Yup.ref("newPassword"), null], "New Password and confirm password must match"),
});
