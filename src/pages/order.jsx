import React, { useEffect, useState } from "react";
import "./order.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const Order = () => {
  const location = useLocation();
  const Navigate = useNavigate();
  const { authorizationToken } = useAuth();
  const [product, setProduct] = useState({
    productName: "",
    productPrice: "",
    currentBiddingPrice: "",
    productDesc: "",
  });

  const getData = async () => {
    try {
      const Response = await fetch(
        "http://localhost:5000/api/data/productDetails",
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
        setProduct(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);


  const handleOrderSubmit = async (values) => {
    const params = {
      product_id: product?._id,
      user_id: product?.bidBy_user_id,
      address: values.address,
      payment_data: values.upiId,
      status:"ordered"
    };

    try {
      const response = await fetch("http://localhost:5000/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success("Order Placed Successfully")
        Navigate('/account/winner');
      }
    } catch (error) {
      console.log("error in sending data", error);
    }
  };

  return (
    <Formik
      initialValues={{
        address: "",
        upiId: "",
      }}
      validationSchema={Yup.object().shape({
        address: Yup.string().required("Address is required"),
        upiId: Yup.string().required("UPI ID is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        handleOrderSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="order-detail-container">
          {/* First Section */}
          <div className="order-detail-section">
            <div className="product-info">
              <div className="product-image">
                {!!product?.productImages?.split(",")?.[0] && (
                  <img
                    src={
                      product?.imagePath +
                      product?.productImages?.split(",")?.[0]
                    }
                    alt=".product"
                  />
                )}
              </div>
              <div className="product-details">
                <h2>Product Name</h2>
                <p>{product?.productName}</p>
                <h3>Product Price</h3>
                <p>Rs.{product?.productPrice}</p>
                <h3>Winning Price</h3>
                <p>Rs.{product?.current_bidding_price}</p>
                <h3>Product Description</h3>
                <p>{product?.productDesc}</p>
              </div>
            </div>
          </div>

          {/* Second Section */}
          <div className="order-detail-section">
            <div className="user-info">
              <label htmlFor="address">Address</label>
              <Field
                id="address"
                name="address"
                as="textarea"
                rows="4"
                cols="50"
              />
              <ErrorMessage name="address" component="div" className="error" />
            </div>
          </div>

          {/* Third Section */}
          <div className="order-detail-section">
            <div className="payment-info">
              <h2>Payment</h2>
              <label htmlFor="upiId">UPI ID</label>
              <Field
                type="text"
                id="upiId"
                name="upiId"
                autoComplete="off"
              />
              <ErrorMessage name="upiId" component="div" className="error" />
            </div>
          </div>

          {/* Pay & Order Button */}
          <button
            type="submit"
            className="pay-order-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Pay & Order"}
          </button>
        </Form>
      )}
    </Formik>
  );
};
