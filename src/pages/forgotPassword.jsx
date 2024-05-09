import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './forgotPassword.css';
import { toast } from 'react-toastify';

const ForgotPasswordForm = () => {
  const initialValues = {
    email: ''
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required')
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    console.log('Submitted email:', values.email);

    try {
        const Response = await fetch("http://localhost:5000/api/auth/user/forgotPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email:values.email}),
        });
        const data = await Response.json();
        if (Response.ok) {
            toast.success("Email SuccessFully sent");
        } else {
          setFieldError("email",data.message,false)
        }
        console.log(Response);
        
      } catch (error) {
        console.log(error);
      }

    setSubmitting(false);
  };

  return (
    <div className="forgot-password-form-container">
      <h2>Forgot Password</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <Field type="email" id="email" name="email" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPasswordForm;
