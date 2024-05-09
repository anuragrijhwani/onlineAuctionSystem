import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export const Home = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { authorizationToken } = useAuth();

  const getImg = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/data/product", {
        method: "GET",
        headers:{
          Authorization:authorizationToken,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data?.message);
      }
    } catch (error) {
      console.log("error from frontend product side", error);
    }
  };

  useEffect(() => {
    getImg();
  }, []);

  // Auto slide function
  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const navigate = useNavigate();
  const sendData = (id) => {
    navigate('/productDetails',{state:{id}});
  };

  return (
    <>
      <main>
        <section className="Section-hero">
          <div className="container grid grid-two-cols">
            <div className="hero-content">
              <div className="mainName">
                <h2>Welcome to BidLaunchPad</h2>
              </div>
              <p>Welcome to BidLaunchPad, where your bidding journey begins.</p>
              <p>
                Your premier destination for online auctions that revolutionize
                the bidding experience. With BidLaunchPad, bidding isn't just
                about securing an item, it's about embarking on an exhilarating
                journey where every bid counts. Join us at BidLaunchPad and
                discover a world where every bid unlocks endless possibilities.
              </p>

              <div className="btn btn-group">
                <div className="grpButton">
                  <a href="/contactus">
                    <button className="btn">Connect Now</button>
                  </a>
                  <a href="/about">
                    <button className="btn">Learn More</button>
                  </a>
                </div>
              </div>
            </div>

            <div className="hero-image">
              <img
                src="/images/home.png"
                alt="Home_Image"
                height="300"
                width="300"
              />
            </div>
          </div>
        </section>
        <section className="Section-hero">
          <div className="container grid grid-two-cols">
            {/* Hero content */}
          </div>
        </section>
        <section>
          <h1>current Product</h1>
          <div className="productData">
            {/* Product slider */}
            <div className="slider-container">
              <div
                className="slider"
                style={{ transform: `translateX(-${currentIndex * 310}px)` }}
              >
                {images.map((item, index) => (
                  <div
                    className="card"
                    key={index}
                    onClick={() => {
                      sendData(item._id);
                    }}
                  >
                    <div className="card-images">
                      {item.productImages.length > 0 && (
                        <img
                          src={
                            item.imagePath + item.productImages.split(",")[0]
                          }
                          alt="product-image"
                          width="300px"
                          height="300px"
                        />
                      )}
                    </div>
                    <div className="card-details">
                      <div className="Pname">
                        <h2>{item.productName}</h2>
                      </div>
                      <div className="grids grid-two-colss">
                        <p>Price:{item.productPrice}</p>
                      </div>
                      <p className="desc">{item.productDesc}</p>
                    </div>
                  </div>
                ))}
              
              </div>
            </div>
          </div>
        </section>
       
      </main>
      <div className="forMore">
        <button onClick={()=>{navigate("/product")}}>For More</button>
        </div>
    </>
  );
};