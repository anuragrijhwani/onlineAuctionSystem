import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import "./productEdit.css";

const ProductEditPage = () => {
  const location = useLocation();
  const { authorizationToken } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [productData, setProductData] = useState({});
  const [images, setImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    // const formattedDateTime = formatDateForInput(
    //   productData?.bidStarting_time || new Date().toISOString()
    // );
    const getData = async () => {
      try {
        const response = await fetch(
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
        if (response.ok) {
          const data = await response.json();
          setProductData(data?.data);
          const existingImages = data?.data?.productImages.split(",") || [];
          setImages(existingImages);
          setImagePreviews(
            existingImages.map((image) => ({
              url: `${data?.data?.imagePath}${image}`,
              isNew: false,
            }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const formatDateForInput = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("_id", productData._id);
    formData.append("productName", productData.productName);
    formData.append("productDesc", productData.productDesc);
    formData.append("productPrice", productData.productPrice);
    formData.append("product_IncreasePrice", productData.product_IncreasePrice);
    formData.append("bidStarting_time", productData.bidStarting_time);
    formData.append("product_CreatedBy", productData.product_CreatedBy);
  
    // Append existing images
    images.forEach((image) => {
      formData.append("productImages", image);
    });
  
    // Append removed images
    removedImages.forEach((removedImage) => {
      formData.append("removedImages", removedImage);
    });
  
    try {
      const response = await fetch(
        "http://localhost:5000/api/add/editProduct",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        toast.success("Product updated successfully");
        navigate('/productDetails',{state:{id:productData._id}});
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push({ url: e.target.result, isNew: true });
        if (previews.length === files.length) {
          setImagePreviews([...imagePreviews, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Filter out duplicate files before updating the images state
    const uniqueFiles = files.filter(
      (file) => !images.some((image) => image.name === file.name)
    );
    setImages((prevImages) => [...prevImages, ...uniqueFiles]);
  };

  const handleRemoveImage = (index) => {
    // Remove the image from images state and add it to removedImages state
    const removedImage = images[index];
    setRemovedImages((prevRemovedImages) => [...prevRemovedImages, removedImage]);

    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
  };

  return (
    <>
      <section>
        <main>
          <div className="section-product">
            <div className="container ">
              <div className="product-form">
                <h1 className="main-heading mb-3">Edit Product</h1>
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
                      value={productData?.productName || ""}
                      onChange={handleChange}
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
                      value={productData?.productDesc || ""}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="productImages" aria-readonly={true}>
                      Product Images{" "}
                      {images?.length > 0 &&
                        `: ${images?.length} files Selected`}
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
                    <div className="imagesData">
                      {imagePreviews.map((preview, index) => (
                        <div className="showImage" key={index}>
                          <button
                            type="button"
                            className="crossButton"
                            onClick={() => handleRemoveImage(index)}
                          >
                            X
                          </button>
                          <img
                            src={preview.url}
                            alt={`product__image_${index}`}
                          />
                        </div>
                      ))}
                    </div>
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
                      value={productData?.productPrice || ""}
                      onChange={handleChange}
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
                      value={productData?.product_IncreasePrice || ""}
                      onChange={handleChange}
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
                      value={
                        formatDateForInput(productData?.bidStarting_time) || ""
                      }
                      onChange={handleChange}
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
                    autoComplete="off"
                    onChange={handleImageChange}
                  />
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
};

export default ProductEditPage;
