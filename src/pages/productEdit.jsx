import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import './productEdit.css'; // Import your CSS file

const ProductEditPage = () => {
    const location = useLocation();
    const { authorizationToken } = useAuth();
    const [productData,setProductData] = useState("")

    const formatDateForInput = (dateTimeString) => {
        // Parse the input date and time string
        const date = new Date(dateTimeString);
    
        // Get the components of the date and time
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
    
        // Format the date and time in the required format
        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    
        return formattedDateTime;
    };
    
    // Usage:
    const formattedDateTime = formatDateForInput(productData?.bidStarting_time);
    


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
                    console.log("product Data", data);
                    setProductData(data?.data)
                    }
                    else{
                        console.log();
                    } 
    }catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getData()
    },[])
       
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prevState => ({
            ...prevState,
            [name]: value
        }));
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
                        value={productData?.productName}
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
                        value={productData?.productDesc}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="productImages" aria-readonly={true}>
                        Product Images{" "}
                        {/* {product?.productImagesFile?.length > 0 &&
                          `: ${product?.productImagesFile?.length} files Selected`} */}
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
                      {/* {!!product?.productImagesFile &&
                        product?.productImagesFile?.map((itm, index) => (
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
                        ))} */}
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
                        value={productData?.productPrice}
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
                        value={productData?.product_IncreasePrice}
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
                        value={formattedDateTime || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <br />
  
                    <input
                    //   ref={fileRef}
                      multiple
                      type="file"
                      style={{ display: "none" }}
                      name="productImages"
                      alt="Product Image"
                      id="productImages"
                      accept="images/*"
                      required
                      autoComplete="off"
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

export default ProductEditPage;
