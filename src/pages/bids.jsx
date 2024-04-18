import "./bids.css";
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";


export const MyBids = () => {

    const[bid,setBid] = useState([]) 
    const { user } = useAuth();
    useEffect(() => {
        const getBidsData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/bidding/get", {
                    method: "POST", 
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({userId: user?._id}), 
                });
                
                if(response.ok) {
                    const data = await response.json();
                    setBid(data?.BidsData); 
                } else {
                    console.log("No Data available");
                }
            } catch (error) {
                console.log("error", error);
            }
        };

        if (user) {
            getBidsData();
        }
    }, [user]);

    return (
        <>
          <section className="bids-section">
            <div className="container">
              <h1>My Bids</h1>
            </div>
            <div className="container Bids">
              <table>
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Original Product Price</th>
                    <th>Your Bid Price</th>
                  </tr>
                </thead>
                <tbody>
                  {bid.map((itm, index) => (
                    <tr key={index}>
                      <td><img src={"http://localhost:5000/uploads/"+itm.productInfo.productImages.split(',')[0]} alt="Product" /></td>
                      <td>{itm?.productInfo?.productName}</td>
                      <td>{itm?.productInfo?.productPrice}</td>
                      <td>{itm?.current_bidding_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      );
}