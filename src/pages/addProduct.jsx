import {useRef, useState } from "react";
import "./addProduct.css";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";

export const AddProduct = () => {
  const { user } = useAuth();
  const fileRef = useRef();
  const [product, setProduct] = useState({
    productName: "",
    productDesc: "",
    productImages: [],
    productImagesFile: [],
    productPrice: "",
    product_IncreasePrice: "",
    product_CreatedBy: user._id,
    bidStarting_time: "",
  });

  const HandleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (
      (name == "productPrice" || name == "product_IncreasePrice") &&
      value < 1
    ) {
      setProduct({
        ...product,
        [name]: 1,
      });
    } else if (name == "productImages") {
      // console.log("front data",e.target);
      const filesArray = Array.from(e.target.files);
      setProduct({
        ...product,
        ["productImagesFile"]: filesArray,
        [name]: value,
      });
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };
  const RemoveImage = (indexToRemove) => {
    const updatedImages = product.productImagesFile.filter(
      (_, index) => index !== indexToRemove
    );
    setProduct({
      ...product,
      productImagesFile: updatedImages,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("productDesc", product.productDesc);
    product?.productImagesFile?.map((itm, index) => {
      formData.append(`productImages`, itm);
    });
    formData.append("productPrice", product.productPrice);
    formData.append("product_IncreasePrice", product.product_IncreasePrice);
    formData.append("bidStarting_time", product.bidStarting_time);
    formData.append("product_CreatedBy", user._id);
    try {
      const Response = await fetch("http://localhost:5000/api/add/Addproduct", {
        method: "POST",
        body: formData,
      });
      if (Response.ok) {
        const data = await Response.json();
        toast.success("Product Added Successfully");
        setProduct({
          productName: "",
          productDesc: "",
          productImages: [],
          productImagesFile: [],
          productPrice: "",
          product_IncreasePrice: "",
          product_CreatedBy: "",
          bidStarting_time: "",
        });
      } else {
        toast.error("Product Not Added");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section>
        <main>
          <div className="section-product">
            <div className="container grid grid-two-cols">
              <div className="product-image">
                <img src="/images/ecom.png" alt="registrationImage" />
              </div>
              <div className="product-form">
                <h1 className="main-heading mb-3">Add Product</h1>
                <br />
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="productName">Product Name</label>
                    <br />
                    <input
                      type="text"
                      name="productName"
                      placeholder="Product Name"
                      id="productName"
                      required
                      autoComplete="off"
                      value={product.productName}
                      onChange={HandleInput}
                    />
                  </div>
                  <div>
                    <label htmlFor="productDesc">Product Description</label>
                    <br />
                    <textarea
                      name="productDesc"
                      placeholder="Product Details"
                      id="productDesc"
                      cols="70"
                      rows="5"
                      required
                      autoComplete="off"
                      value={product.productDesc}
                      onChange={HandleInput}
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="productImages" aria-readonly={true}>
                      Product Images{" "}
                      {product?.productImagesFile?.length > 0 &&
                        `: ${product?.productImagesFile?.length} files Selected`}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        fileRef.current.click();
                      }}
                    >
                      Select files
                    </button>
                    <br />
                  </div>
                  <div className="imagesData">
                    {!!product?.productImagesFile &&
                      product?.productImagesFile?.map((itm, index) => (
                        console.log(itm),
                        <div className="showImage" key={index}>
                          <button
                            type="button"
                            className="crossButton"
                            onClick={() => RemoveImage(index)}
                          >
                            X
                          </button>
                          <img
                            src={URL.createObjectURL(itm)}
                            alt="product__image"
                          />
                        </div>
                      ))}
                  </div>
                  <div>
                    <label htmlFor="productPrice">Product Price</label>
                    <br />
                    <input
                      type="number"
                      name="productPrice"
                      placeholder="Product Price"
                      id="productPrice"
                      required
                      autoComplete="off"
                      value={product.productPrice}
                      onChange={HandleInput}
                    />
                  </div>
                  <div>
                    <label htmlFor="product_IncreasePrice">
                      Bid Increased By
                    </label>
                    <br />
                    <input
                      type="number"
                      name="product_IncreasePrice"
                      placeholder="IncreasePrice"
                      id="product_IncreasePrice"
                      required
                      autoComplete="off"
                      value={product.product_IncreasePrice}
                      onChange={HandleInput}
                    />
                  </div>
                  <br />
                  <div>
                    <label htmlFor="bidStarting_time">Bidding Start Time</label>
                    <br />
                    <input
                      type="datetime-local"
                      name="bidStarting_time"
                      id="bidStarting_time"
                      required
                      autoComplete="off"
                      value={product.bidStarting_time}
                      onChange={HandleInput}
                    />
                  </div>
                  <br />

                  <input
                    ref={fileRef}
                    multiple
                    type="file"
                    style={{ display: "none" }}
                    name="productImages"
                    alt="Product Image"
                    id="productImages"
                    accept="images/*"
                    required
                    autoComplete="off"
                    value={product.productImages}
                    onChange={HandleInput}
                  />
                  <button type="submit" className="btn btn-submit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};
