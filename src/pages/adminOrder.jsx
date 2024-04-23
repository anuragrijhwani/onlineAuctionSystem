import "./adminOrder.css";
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";

export const AdminOrder = () => {
  const [winner, setWinner] = useState([]);
  const { user } = useAuth();
//   const [token, setToken] = useState(localStorage.getItem("Token"));


  useEffect(() => {
        getBidsData();
  }, [user]);

  const getBidsData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/order", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setWinner(data?.data);
      }
    } catch (error) {
      console.log("error from fetching data in admin", error);
    }
  };



  const navigate = useNavigate();
  const order = (id) => {
    navigate("/order", { state: { id } });
  };

  return (
    <>
      <section className="winner-section">
        <div className="container">
          <h1>Product Winner</h1>
        </div>
        <div className="container admin">
          <table>
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Winner</th>
                <th>Original Product Price</th>
                <th>Your Bid Price</th>
                <th>Order</th>
              </tr>
            </thead>
            <tbody>
              {winner && winner.length > 0 ? (
                winner?.map((itm, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={
                          itm?.imagePath +
                          (itm?.productImages?.split(",")[0] || "")
                        }
                        alt="Product"
                      />
                    </td>
                    <td>{itm?.productName}</td>
                    <td>{itm?.current_bidder}</td>
                    <td>{itm?.productPrice}</td>
                    <td>{itm?.current_bidding_price}</td>
                    <td>
                      <button onClick={() => order(itm?._id)}>
                        {itm?.bidStatus === "order"
                          ? " View Order"
                          : "Place Order"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No winners available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
