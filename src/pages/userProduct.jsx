import { useEffect, useState } from "react";
import "./products.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const getProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/user/product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_CreatedBy: user?._id }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data?.data);
      }
    } catch (error) {
      console.log("error from frontend product side", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, [user]);

  const navigate = useNavigate();
  const sendData = (id) => {
    navigate("/productDetails", { state: { id } });
  };

  const change = () => {
    navigate("/addProduct")
  }

  return (
    <>
      <section className="section-productData">
        <div className="container">
          <h1 className="main-heading">My Products</h1>
        </div>
        {products.length === 0 && (
          <div className="no-products-message">
            <h2>No products available</h2>
            <br /><br />
            <h2>Add Your Product <button onClick={change}>Add Product</button> </h2>
          </div>
        )}
        <div className="container grid grid-three-cols">
          {products?.map((currentElem, index) => {
            const {
              _id,
              imagePath,
              productName,
              productDesc,
              productImages,
              productPrice,
            } = currentElem;
            const proImages = productImages.split(",");

            return (
              <div
                className="card"
                key={index}
                onClick={() => {
                  sendData(_id);
                }}
              >
                <div className="card-images">
                  {productImages.length > 0 && (
                    <img
                      src={imagePath + proImages[0]} // Display only the first image
                      alt="product-image"
                      width="300px"
                      height="300px"
                    />
                  )}
                </div>
                <div className="card-details">
                  <div className="Pname">
                    <h2>{productName}</h2>
                  </div>
                  <div className="grids grid-two-colss">
                    <p>Price:{productPrice}</p>
                  </div>
                  <p className="desc">{productDesc}</p>
                  <p></p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
