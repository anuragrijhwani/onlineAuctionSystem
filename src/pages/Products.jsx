import { useEffect, useState } from "react";
import "./products.css";
import {useNavigate} from 'react-router-dom';
import { useAuth } from "../store/auth";
export const Product = () => {
  const [products, setProducts] = useState([]);
  const { authorizationToken } = useAuth();

  const getProducts = async () => {
   
    try {
      const response = await fetch("http://localhost:5000/api/data/product", {
        method: "GET",
        headers:{
        }
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data?.message);
        setProducts(data?.message); 
      }
    } catch (error) {
      console.log("error from frontend product side", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const navigate = useNavigate();
  const sendData = (id) => {
    navigate('/productDetails',{state:{id}});
   }

  return (
    <>
      <section className="section-productData">
        <div className="container">
          <h1 className="main-heading">Products</h1>
        </div>

        <div className="container grid grid-three-cols">
          {products?.map((currentElem, index) => {
            const {
              _id,
              imagePath,
              productName,
              productDesc,
              productImages,
              productPrice,
              product_IncreasePrice,
              product_createDate,
              product_CreatedBy,
            } = currentElem;
            const proImages = productImages.split(",");


            return (
              <div className="card" key={index} onClick= {() =>{
                  sendData(_id)
              }}> 
                <div className="card-images">{productImages.length > 0 && (
                    <img
                      src={imagePath + proImages[0]} // Display only the first image
                      alt="product-image"
                      width="300px"
                      height="300px"
                    />
                  )}
                </div>
                < div className="card-details">
                   <div className="Pname">
                      <h2>{productName}</h2>
                    </div>
                  <div className="grids grid-two-colss">
                    <p>Price:{productPrice}</p>
                  </div>
                  <p className="desc" >{productDesc}</p>
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
