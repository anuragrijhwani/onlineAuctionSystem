import React, { useEffect, useState } from "react";
import "./productDetails.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import moment from "moment";
import io from "socket.io-client";

export const ProductDetails = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { authorizationToken } = useAuth();
  let timerData = null;

  const [productData, setProductData] = useState();
  const [current_bidding_price, setCurrent_bidding_price] = useState("");
  const [bidPrice, setBidPrice] = useState("");
  const [bidUser, setBidUser] = useState("");
  const [bidUserId, setUserId] = useState("");
  const [updateTime, setUpdateTime] = useState("");
  const [imgArr, setImgArr] = useState([]);
  const [bidding, setBidding] = useState([]);
  const [seconds, setSeconds] = useState(0); // Countdown timer in seconds
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState({});
  const [remainingTime, setRemainingTime] = useState(null);

  const socket = io("http://localhost:5000");

  // Function to calculate the countdown timer
  const calculateCountdown = (time) => {
    const now = moment();
    const bidStartTime = moment(time);
    const diff = bidStartTime.diff(now);
    const remainingTimeInSeconds = moment.duration(diff).asSeconds();
    return setSeconds(
      remainingTimeInSeconds > 0 ? Math.floor(remainingTimeInSeconds) : 0
    );
  };

  useEffect(() => {
    if (isActive) {
      const intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          const updatedSeconds = prevSeconds - 1;
          updateCountdown(updatedSeconds);
          if (updatedSeconds < 1) {
            try {
              clearInterval(intervalId);
              updateBidStatusAPI("start");
            } catch (error) {}
          }
          return updatedSeconds;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isActive]);

  // Function to update countdown values
  const updateCountdown = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Update the state with new countdown values
    setCountdown({
      days,
      hours,
      minutes,
      seconds: remainingSeconds,
    });
  };

  const updateBidStatusAPI = async (bidStatus) => {
    const bidStatusResponse = await fetch(
      "http://localhost:5000/api/data/product/bidstatusupdate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({
          _id: location?.state?.id,
          bidStatus: bidStatus,
        }),
      }
    );
    if (bidStatusResponse.ok) {
      getData();
    }
  };

  const bidData = async () => {
    try {
      const biddingData = await fetch(
        "http://localhost:5000/api/admin/bidding/data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: location?.state?.id }),
        }
      );
      if (biddingData) {
        const data = await biddingData.json();
        setBidding(data?.biddingData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    bidData();
  }, [user]);

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
        setProductData(data?.data);
        setBidPrice(
          data?.data?.current_bidding_price || data?.data?.productPrice
        );
        setCurrent_bidding_price(data?.data?.current_bidding_price);
        setBidUser(data?.data?.current_bidder);
        setUserId(data?.data?.user_id);
        setUpdateTime(data?.data?.updatedDate);
        const proImg = data?.data?.productImages?.split(",");
        setImgArr(proImg);
        handleImageClick(data?.data?.imagePath + proImg[0]);

        // Start the countdown timer
        calculateCountdown(data?.data?.bidStarting_time);
        const currentUtcTime = moment.utc(data?.data?.bidStarting_time);
        const currentLocalTime = moment();
        if (currentUtcTime.isAfter(currentLocalTime)) {
          setIsActive(true);
        } else if (data?.data?.bidStatus == "coming") {
          updateBidStatusAPI("start");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      clearInterval(timerData);
    } catch (error) {}
    if (!!updateTime && productData?.bidStatus == "start") {
      timerData = setInterval(() => {
        const now = moment();
        const Time = moment(updateTime);
        const diff = now.diff(Time);
        const remainingTimeInSeconds = moment.duration(diff).asSeconds();
        if (remainingTimeInSeconds < 60) {
          const sec = 60 - remainingTimeInSeconds;
          setRemainingTime(sec);
        } else {
          clearInterval(timerData);
          updateBidStatusAPI("win");
        }
      }, 1000);
    }
    return () => clearInterval(timerData);
  }, [updateTime]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected");
    });
    socket.on("disconnect", () => {
      console.log("socket disConnected");
    });
    socket.on("bidSendBE", (params) => {
      if (params?.productId == location?.state?.id) {
        setBidPrice(params?.current_bidding_price);
        setBidUser(params?.current_bidder);
        setCurrent_bidding_price(params?.current_bidding_price);
        setUserId(params?.userId);
        setUpdateTime(params?.updatedDate);
        if (isActive == true) {
          setSeconds(calculateCountdown());
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!!location?.state?.id && !!isLoggedIn) getData();
    else navigate("/");
  }, []);

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/data/product/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify({ _id: id }),
        }
      );
      if (response.ok) {
        toast.success("Product successfully deleted");
        if (user.isAdmin == true) navigate("/admin/products");
        else navigate("/product");
      }
    } catch (error) {
      console.log("error from product detail Page", error);
    }
  };
  const editProduct = () => {
    const id = productData?._id;
    navigate("/productEdit", { state: { id } });
  };

  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };
  const onChange = async () => {
    let params = {
      productId: location?.state?.id,
      userId: user._id,
      current_bidding_price:
        bidPrice == productData?.productPrice &&
        bidPrice != current_bidding_price
          ? bidPrice
          : bidPrice + productData?.product_IncreasePrice,
      current_bidder: user.username,
    };
    socket.emit("bidSendFE", params);
    bidData();

    return true;
    try {
      const response = await fetch("http://localhost:5000/api/bidding/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("product Data get", data);
        getData();
      }
    } catch (error) {
      console.log("error in get api", error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="images-column">
          {imgArr?.map((itm, index) => (
            <img
              key={index}
              src={productData?.imagePath + itm}
              alt="product images"
              className="thumbnail"
              onClick={() => handleImageClick(productData?.imagePath + itm)}
            />
          ))}
        </div>
        <div className="selected-image-column">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected Image"
              className="selected-image"
            />
          )}
        </div>
        <div className="product-details-column">
          {productData && (
            <>
              <h1>{productData?.productName}</h1>
              <p className="userName">
                Upload By : {productData?.uploadByUser.username}
              </p>
              <p className="price">Price : {productData?.productPrice}</p>
              <p className="price">
                Biding Price :{" "}
                {bidPrice == current_bidding_price ? bidPrice : 0}
              </p>
              <br />
              <div className="countDown">
                {(countdown.days > 0 ||
                  countdown.hours > 0 ||
                  countdown.minutes > 0 ||
                  countdown.seconds > 0) && (
                  <>
                    <h1>Bidding will start in :</h1>
                    <div className="clock-container">
                      <div className="clock-digit">{countdown.days} days</div>
                      <div className="clock-digit">{countdown.hours} hours</div>
                      <div className="clock-digit">
                        {countdown.minutes} minutes
                      </div>
                      <div className="clock-digit">
                        {countdown.seconds} seconds
                      </div>
                    </div>
                  </>
                )}
              </div>
              {productData?.bidStatus == "start" && !!updateTime && (
                <div>
                  <p>Bidding ends in:{Math.round(remainingTime)} s</p>
                </div>
              )}
              <br />
              {(user.isAdmin == true ||
                user?._id == productData?.product_CreatedBy) &&
                productData?.bidStatus == "coming" && (
                  <>
                    <button className="edit" onClick={editProduct}>
                      edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => {
                        deleteProduct(location?.state?.id);
                      }}
                    >
                      delete
                    </button>
                  </>
                )}
              {user?._id != productData?.product_CreatedBy &&
                !user.isAdmin &&
                remainingTime >= 0 &&
                productData?.bidStatus == "start" && (
                  <button onClick={onChange}>
                    {`bid of rs.${
                      bidPrice != current_bidding_price
                        ? bidPrice
                        : bidPrice + productData?.product_IncreasePrice
                    }`}
                  </button>
                )}

              {bidPrice == current_bidding_price &&
                productData?.bidStatus == "start" && (
                  <p className="bidData">{`Bid By : ${
                    bidUserId == user._id ? "You" : bidUser
                  } With Rs.${current_bidding_price} `}</p>
                )}

              {productData?.bidStatus == "win" && (
                <p className="bidData">{` Bid Win by : ${bidUser} With Rs.${current_bidding_price} `}</p>
              )}

              <p className="description">
                Description : {productData?.productDesc}
              </p>
            </>
          )}
        </div>
      </div>
      {user.isAdmin == true || user?._id === productData?.product_CreatedBy && (
        <div>
          <section className="bidding-section">
            <div className="container">
              <h1>Bidding Data</h1>
            </div>
            <div className="container bidding">
              <table>
                <thead>
                  <tr>
                    <th>Index Number</th>
                    <th>Product Name</th>
                    <th>Original Product Price</th>
                    <th>Your Bid Price</th>
                    <th>Bidder Name</th>
                  </tr>
                </thead>
                <tbody>
                  {bidding?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{productData?.productName}</td>
                      <td>{productData?.productPrice}</td>
                      <td>{item?.current_bidding_price}</td>
                      <td>{item?.productInfo?.username}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </>
  );
};