// ChangePasswordForm.jsx

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const ChangePasswordForm = () => {
  const { token } = useParams();
  const initialValues = {
    newPassword: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('New Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm Password is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/user/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: values.newPassword }),
      });

      if (response.ok) {
        toast.success("Password Changed Successfully");
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      console.log(error);
    }

    setSubmitting(false);
  };

  return (
    <div className="forgot-password-form-container">
      <h2>Change Password</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="newPassword">New Password:</label>
              <Field type="password" id="newPassword" name="newPassword" />
              <ErrorMessage name="newPassword" component="div" className="error-message" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <Field type="password" id="confirmPassword" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" className="error-message" />
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

export default ChangePasswordForm;
